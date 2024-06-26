from fastapi import APIRouter, HTTPException, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from ..database import client

router = APIRouter()

@router.post("/covers")
async def upload_cover(cover: UploadFile = File(...)):
    if client is None:
        raise HTTPException(status_code=500, detail="Database client is not initialized")

    db = client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    cover_id = await fs.upload_from_stream(cover.filename, cover.file.read())
    return {"cover_id": str(cover_id)}

@router.get("/covers/{cover_id}")
async def get_cover(cover_id: str):
    if client is None:
        raise HTTPException(status_code=500, detail="Database client is not initialized")

    db = client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)
    stream = await fs.open_download_stream(cover_id)
    cover = await stream.read()
    return {"filename": stream.filename, "content": cover}
