from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from .database import client

async def create_book(book_dict, cover_file):
    db = client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    cover_id = await fs.upload_from_stream(cover_file.filename, await cover_file.read())
    book_dict["cover"] = str(cover_id)
    books_collection = db.books
    result = await books_collection.insert_one(book_dict)
    return {"id": str(result.inserted_id), **book_dict, "cover": str(cover_id)}

async def get_cover(cover_id):
    db = client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    cover = await fs.open_download_stream(ObjectId(cover_id))
    data = await cover.read()
    return data

async def list_books(page, limit, sort):
    db = client.bookstore
    books_collection = db.books
    total_books = await books_collection.count_documents({})
    total_pages = -(-total_books // limit)
    sort_key = sort if sort in ["title", "description", "cover"] else "title"
    books_cursor = books_collection.find().sort(sort_key).skip((page - 1) * limit).limit(limit)
    books = await books_cursor.to_list(length=limit)
    return {"total_pages": total_pages, "books": [{"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]} for book in books]}

async def get_book(book_id):
    db = client.bookstore
    books_collection = db.books
    book = await books_collection.find_one({"_id": ObjectId(book_id)})
    if book:
        return {"id": str(book["_id"]), "title": book["title"], "description": book["description"], "cover": book["cover"]}
    return None
