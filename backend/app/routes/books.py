from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from bson import ObjectId
from ..database import client, connect_to_mongo, close_mongo_connection
from ..schemas import BookDB, BookResponse, BooksResponse
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
import json

router = APIRouter()

@router.post("/books", response_model=BookResponse, status_code=201)
async def create_book(book: str = Form(...), cover: UploadFile = File(...)):
    await connect_to_mongo()
    try:
        db = client.bookstore
        fs = AsyncIOMotorGridFSBucket(db)
        cover_id = await fs.upload_from_stream(cover.filename, cover.file.read())
        book_dict = json.loads(book)
        book_dict["cover"] = str(cover_id)
        books_collection = db.books
        result = await books_collection.insert_one(book_dict)
        return {"id": str(result.inserted_id), **book_dict, "cover": str(cover_id)}
    finally:
        await close_mongo_connection()

@router.get("/books", response_model=BooksResponse)
async def list_books(page: int = 1, limit: int = 9, sort: str = "title"):
    await connect_to_mongo()
    try:
        db = client.bookstore
        books_collection = db.books
        total_books = await books_collection.count_documents({})
        total_pages = -(-total_books // limit)
        sort_key = sort if sort in ["title", "description", "cover"] else "title"
        books_cursor = books_collection.find().sort(sort_key).skip((page - 1) * limit).limit(limit)
        books = await books_cursor.to_list(length=limit)
        return {"total_pages": total_pages, "books": [{"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]} for book in books]}
    finally:
        await close_mongo_connection()

@router.get("/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    await connect_to_mongo()
    try:
        db = client.bookstore
        books_collection = db.books
        book = await books_collection.find_one({"_id": ObjectId(book_id)})
        if book:
            return {"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]}
        raise HTTPException(status_code=404, detail="Book not found")
    finally:
        await close_mongo_connection()
