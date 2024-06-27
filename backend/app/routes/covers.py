from fastapi import APIRouter, HTTPException, UploadFile, File, Response
import gridfs
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from bson import ObjectId
from ..database import client

router = APIRouter()

@router.post("/covers")
async def upload_cover(cover: UploadFile = File(...)):
    if client is None:
        raise HTTPException(status_code=500, detail="Database client is not initialized")

    db = client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)

    try:
        cover_data = await cover.read()
        cover_id = await fs.upload_from_stream(cover.filename, cover_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

    return {"cover_id": str(cover_id)}

@router.get("/covers/{cover_id}", response_class=Response, responses={200: {"content": {"image/*": {}}}})
async def get_cover(cover_id: str):
    if client is None:
        raise HTTPException(status_code=500, detail="Database client is not initialized")

    db = client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)

    try:
        cover = await fs.open_download_stream(ObjectId(cover_id))
        data = await cover.read()
        return Response(content=data, media_type="image/jpeg")
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download file: {str(e)}")
