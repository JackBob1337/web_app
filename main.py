from fastapi import FastAPI
from routers.auth import router as auth_router
from core.logs import setup_logging

setup_logging()
app = FastAPI()
app.include_router(auth_router)

