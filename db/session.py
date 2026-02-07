from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import DATA_BASE_URL

engine = create_engine(DATA_BASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()