from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Response
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId
import json

app = FastAPI(root_path="/api") 

async def connect_to_mongo():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    return client

async def close_mongo_connection(client):
    client.close()

class BookDB(BaseModel):
    title: str
    description: str

class BookResponse(BaseModel):
    id: str
    title: str
    description: str
    cover: str

class BooksResponse(BaseModel):
    total_pages: int
    books: List[BookResponse]

@app.post("/books", response_model=BookResponse, status_code=201)
async def create_book(book: str = Form(...), cover: UploadFile = File(...)):
    client = await connect_to_mongo()
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
        await close_mongo_connection(client)

@app.get("/covers/{cover_id}", response_class=Response, responses={200: {"content": {"image/*": {}}}})
async def get_cover(cover_id: str):
    client = await connect_to_mongo()
    try:
        db = client.bookstore
        fs = AsyncIOMotorGridFSBucket(db)
        cover = await fs.open_download_stream(ObjectId(cover_id))
        data = await cover.read()
        return Response(content=data, media_type="image/jpeg")
    finally:
        await close_mongo_connection(client)

@app.get("/books", response_model=BooksResponse)
async def list_books(page: int = 1, limit: int = 10, sort: str = "title"):
    client = await connect_to_mongo()
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
        await close_mongo_connection(client)

@app.get("/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    client = await connect_to_mongo()
    try:
        db = client.bookstore
        books_collection = db.books
        book = await books_collection.find_one({"_id": ObjectId(book_id)})
        if book:
            return {"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]}
        raise HTTPException(status_code=404, detail="Book not found")
    finally:
        await close_mongo_connection(client)

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection(app.mongodb_client)
