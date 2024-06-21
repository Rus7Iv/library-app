from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId

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

@app.post("/books", response_model=BookDB, status_code=201)
async def create_book(book: BookDB):
    client = await connect_to_mongo()
    try:
        db = client.bookstore
        books_collection = db.books
        book_dict = book.dict()
        book_dict['_id'] = ObjectId(book_dict['id'])
        del book_dict['id']
        result = await books_collection.insert_one(book_dict)
        inserted_id = str(result.inserted_id)
        book_dict['id'] = inserted_id
        return book_dict
    finally:
        await close_mongo_connection(client)

@app.get("/books", response_model=List[BookDB])
async def list_books(page: int = 1, limit: int = 10, sort: str = "title"):
    async with connect_to_mongo() as client:
        db = client.bookstore
        books_collection = db.books
        sort_key = sort if sort in ["title", "description", "cover"] else "title"
        books_cursor = books_collection.find().sort(sort_key).skip((page - 1) * limit).limit(limit)
        books = await books_cursor.to_list(length=limit)
        return [{**book, "id": str(book["_id"])} for book in books]

@app.get("/books/{book_id}", response_model=BookDB)
async def get_book(book_id: str):
    async with connect_to_mongo() as client:
        db = client.bookstore
        books_collection = db.books
        book = await books_collection.find_one({"_id": ObjectId(book_id)})
        if book:
            return {**book, "id": str(book["_id"])}
        raise HTTPException(status_code=404, detail="Book not found")

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection(app.mongodb_client)
