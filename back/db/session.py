from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from back.db.base import Base

from back.core.config import DATA_BASE_URL

from back.db.user import User
from back.db.menu import Category, MenuItem
from back.db.order import Order
from back.db.order_items import OrderItem

engine = create_engine(DATA_BASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()