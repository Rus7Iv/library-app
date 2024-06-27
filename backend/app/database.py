from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends

class DatabaseClient:
    def __init__(self):
        self.client = None

    async def startup(self):
        self.client = AsyncIOMotorClient("mongodb://localhost:27017")

    async def shutdown(self):
        if self.client is not None:
            try:
                await self.client.close()
            except Exception as e:
                print(f"Error closing database connection: {e}")
            finally:
                self.client = None

    async def __call__(self):
        if self.client is None:
            raise RuntimeError("Database client is not initialized")
        return self.client

get_db_client = DatabaseClient()
