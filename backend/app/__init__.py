from fastapi import FastAPI, Depends
from .database import get_db_client
from .routes import books, covers

app = FastAPI(root_path="/api")

app.include_router(books.router, dependencies=[Depends(get_db_client)])
app.include_router(covers.router, dependencies=[Depends(get_db_client)])

@app.on_event("startup")
async def startup():
    await get_db_client.startup()

@app.on_event("shutdown")
async def shutdown():
    await get_db_client.shutdown()
