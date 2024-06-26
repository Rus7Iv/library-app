from fastapi import FastAPI

app = FastAPI(root_path="/api")

from .database import startup_db_client, shutdown_db_client
from .routes import books, covers

app.include_router(books.router)
app.include_router(covers.router)

@app.on_event("startup")
async def startup():
    await startup_db_client()

@app.on_event("shutdown")
async def shutdown():
    await shutdown_db_client()
