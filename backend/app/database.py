from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")

async def startup_db_client():
    pass

async def shutdown_db_client():
    await client.close()
