from fastapi import APIRouter, Response
from bson import ObjectId
from ..database import client, connect_to_mongo, close_mongo_connection
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

router = APIRouter()

@router.get("/covers/{cover_id}", response_class=Response, responses={200: {"content": {"image/*": {}}}})
async def get_cover(cover_id: str):
    await connect_to_mongo()
    try:
        db = client.bookstore
        fs = AsyncIOMotorGridFSBucket(db)
        cover = await fs.open_download_stream(ObjectId(cover_id))
        data = await cover.read()
        return Response(content=data, media_type="image/jpeg")
    finally:
        await close_mongo_connection()
