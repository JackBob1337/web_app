from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.menu import router as menu_router
from core.logs import setup_logging

setup_logging()

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(menu_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

