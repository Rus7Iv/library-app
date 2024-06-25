from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Response
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pydantic import BaseModel
from typing import List
from bson import ObjectId
import json

app = FastAPI(root_path="/api")

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
    db = app.mongodb_client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    cover_data = await cover.read()
    cover_id = await fs.upload_from_stream(cover.filename, cover_data)
    book_dict = json.loads(book)
    book_dict["cover"] = str(cover_id)
    books_collection = db.books
    result = await books_collection.insert_one(book_dict)
    return {"id": str(result.inserted_id), **book_dict, "cover": str(cover_id)}

@app.get("/covers/{cover_id}", response_class=Response, responses={200: {"content": {"image/*": {}}}})
async def get_cover(cover_id: str):
    db = app.mongodb_client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    cover = await fs.open_download_stream(ObjectId(cover_id))
    data = await cover.read()
    return Response(content=data, media_type="image/jpeg")

@app.get("/books", response_model=BooksResponse)
async def list_books(page: int = 1, limit: int = 9, sort: str = "title"):
    db = app.mongodb_client.bookstore
    books_collection = db.books
    total_books = await books_collection.count_documents({})
    total_pages = -(-total_books // limit)
    sort_key = sort if sort in ["title", "description", "cover"] else "title"
    books_cursor = books_collection.find().sort(sort_key).skip((page - 1) * limit).limit(limit)
    books = await books_cursor.to_list(length=limit)
    return {"total_pages": total_pages, "books": [{"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]} for book in books]}

@app.get("/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    db = app.mongodb_client.bookstore
    books_collection = db.books
    book = await books_collection.find_one({"_id": ObjectId(book_id)})
    if book:
        return {"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]}
    raise HTTPException(status_code=404, detail="Book not found")

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017")

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
