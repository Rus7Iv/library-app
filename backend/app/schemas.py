from pydantic import BaseModel
from typing import List

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
