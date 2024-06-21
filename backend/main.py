from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId
from pydantic import BaseModel, Field

app = FastAPI(root_path="/api") 

async def connect_to_mongo():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    return client

async def close_mongo_connection(client):
    client.close()

class BookDB(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias='_id')
    title: str
    description: str
    cover: str

class BookResponse(BaseModel):
    id: str
    title: str
    description: str
    cover: str

@app.post("/books", response_model=BookResponse, status_code=201)
async def create_book(book: BookDB):
    client = await connect_to_mongo()
    try:
        db = client.bookstore
        books_collection = db.books
        book_dict = book.dict(by_alias=True)
        result = await books_collection.insert_one(book_dict)
        return {"id": str(result.inserted_id), **book.dict(by_alias=True)}
    finally:
        await close_mongo_connection(client)

@app.get("/books", response_model=List[BookResponse])
async def list_books(page: int = 1, limit: int = 10, sort: str = "title"):
    client = await connect_to_mongo()
    try:
        db = client.bookstore
        books_collection = db.books
        sort_key = sort if sort in ["title", "description", "cover"] else "title"
        books_cursor = books_collection.find().sort(sort_key).skip((page - 1) * limit).limit(limit)
        books = await books_cursor.to_list(length=limit)
        return [{"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]} for book in books]
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
