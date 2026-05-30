from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from back.routers.auth import router as auth_router
from back.routers.users import router as users_router
from back.routers.menu import router as menu_router
from back.routers.cart import router as cart_router
from back.core.logs import setup_logging

setup_logging()

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(menu_router)
app.include_router(cart_router)

app.mount("/static", StaticFiles(directory="back/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
