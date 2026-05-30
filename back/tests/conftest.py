import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from back.db.menu import Category, MenuItem
from back.db.user import User as UserModel
from back.core.security import create_access_token, hash_password
from back.main import app
from back.db.base import Base
from back.db.session import get_db

TEST_DATABASE_URL = "postgresql+psycopg2://jack_bob:tolik03121999@localhost:5432/User_DB_test"
engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()

    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture
def user(db):
    user = UserModel(
        username="testuser",
        email="testuser@example.com",
        hashed_password=hash_password("Password123"),
        phone_number="1234567890"
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def user_token_header(client, user):
    token = create_access_token(
        data = {"sub": str(user.id),
                "role": user.role}
    )
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def another_user(db):
    user = UserModel(
        username="otheruser",
        email="other@example.com",
        hashed_password=hash_password("password123"),
        phone_number="9999999999"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@pytest.fixture
def admin_user(db):
    user = UserModel(
        username="admin",
        email="admin@test.com",
        hashed_password=hash_password("Password123"),
        phone_number="0000000000",
        role="admin"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@pytest.fixture
def admin_token_header(admin_user):
    token = create_access_token(
        data={
            "sub": str(admin_user.id),
            "role": admin_user.role
        }
    )

    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def category(db):
    category = Category(name="Pizza")
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@pytest.fixture
def menu_item(db, category):
    item = MenuItem(
        name="Pepperoni",
        description="Test pizza",
        price_cents=1500,
        stock=10,
        is_available=True,
        category_id=category.id
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

