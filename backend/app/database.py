from motor.motor_asyncio import AsyncIOMotorClient

client = None

async def connect_to_mongo():
    global client
    if client is None:
        client = AsyncIOMotorClient("mongodb://localhost:27017")
    return client

async def close_mongo_connection():
    global client
    if client:
        client.close()
        client = None

async def startup_db_client():
    await connect_to_mongo()

async def shutdown_db_client():
    await close_mongo_connection()
