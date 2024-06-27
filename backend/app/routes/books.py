from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from bson import ObjectId
from ..schemas import BookDB, BookResponse, BooksResponse
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
import json
from ..database import get_db_client

router = APIRouter()

@router.post("/books", 
             response_model=BookResponse, 
             status_code=201,
             summary="Создание новой книги",
             description='Данные в поле book вглядят так: { "title": "TitleExample", "description": "DescritionExample" }')
async def create_book(book: str = Form(...), cover: UploadFile = File(...), db_client=Depends(get_db_client)):
    db = db_client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    cover_id = await fs.upload_from_stream(cover.filename, cover.file.read())
    book_dict = json.loads(book)
    book_dict["cover"] = str(cover_id)
    books_collection = db.books
    result = await books_collection.insert_one(book_dict)
    return {"id": str(result.inserted_id), **book_dict, "cover": str(cover_id)}

@router.get("/books",
           response_model=BooksResponse,
           summary="Получение списка книг",
           description="Учитывается пагинация, количество книг на одной странице и поиск по имени")
async def list_books(page: int = 1, limit: int = 9, sort: str = "title", db_client=Depends(get_db_client)):
    db = db_client.bookstore
    books_collection = db.books
    total_books = await books_collection.count_documents({})
    total_pages = -(-total_books // limit)
    sort_key = sort if sort in ["title", "description", "cover"] else "title"
    books_cursor = books_collection.find().sort(sort_key).skip((page - 1) * limit).limit(limit)
    books = await books_cursor.to_list(length=limit)
    return {"total_pages": total_pages, "books": [{"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]} for book in books]}

@router.get("/books/{book_id}",
           response_model=BookResponse,
           summary="Получить книгу по id",
           description="Получение книги по её id")
async def get_book(book_id: str, db_client=Depends(get_db_client)):
    db = db_client.bookstore
    books_collection = db.books
    book = await books_collection.find_one({"_id": ObjectId(book_id)})
    if book:
        return {"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]}
    raise HTTPException(status_code=404, detail="Book not found")
