from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.base import Base

from core.config import DATA_BASE_URL

from db.user import User
from db.menu import Category, MenuItem

engine = create_engine(DATA_BASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()