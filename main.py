from fastapi import FastAPI
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.menu import router as menu_router
from core.logs import setup_logging

setup_logging()

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(menu_router)

