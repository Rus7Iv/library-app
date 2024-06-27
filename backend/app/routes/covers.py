from fastapi import APIRouter, HTTPException, UploadFile, File, Response, Depends
import gridfs
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from bson import ObjectId
from ..database import get_db_client

router = APIRouter()

@router.post("/covers",
             summary="Загрузить изображение на сервер",
             description="Загрузка изображения в базу данных")
async def upload_cover(cover: UploadFile = File(...), db_client=Depends(get_db_client)):
    db = db_client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)

    try:
        cover_data = await cover.read()
        cover_id = await fs.upload_from_stream(cover.filename, cover_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

    return {"cover_id": str(cover_id)}

@router.get("/covers/{cover_id}",
           summary="Получить изображение",
           description="Получение изображения по id",
           response_class=Response,
           responses={200: {"content": {"image/*": {}}}})
async def get_cover(cover_id: str, db_client=Depends(get_db_client)):
    db = db_client.bookstore
    fs = AsyncIOMotorGridFSBucket(db)

    try:
        cover = await fs.open_download_stream(ObjectId(cover_id))
        data = await cover.read()
        return Response(content=data, media_type="image/jpeg")
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download file: {str(e)}")
