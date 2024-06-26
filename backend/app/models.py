from pydantic import BaseModel

class BookDB(BaseModel):
    title: str
    description: str
