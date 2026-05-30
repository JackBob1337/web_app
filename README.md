# 🍕 Food Delivery App

Full-stack food delivery web application with user and admin interfaces.

**Live Demo:** [frontend-production-4c7c.up.railway.app](https://frontend-production-4c7c.up.railway.app)

---

## Tech Stack

**Backend**
- Python, FastAPI
- PostgreSQL, SQLAlchemy
- JWT authentication (PyJWT + bcrypt)
- pytest

**Frontend**
- React (Create React App)
- CSS Modules

**Infrastructure**
- Deployed on Railway
- CI/CD via GitHub Actions

---

## Features

**User**
- Browse menu by categories (Pizza, Burgers, Sushi, Desserts)
- Add items to cart
- Place and view orders
- Register / Login with JWT auth
- Edit profile

**Admin**
- Create, edit, delete menu categories and items
- Upload item images
- Manage users and orders
- Admin dashboard

---

## Project Structure

```
FoodDelivery/
├── back/                  # Backend
│   ├── core/              # Config, security, JWT, logging
│   ├── db/                # SQLAlchemy models
│   ├── models/            # Pydantic schemas
│   ├── routers/           # API routes (auth, users, menu, cart)
│   ├── services/          # Business logic
│   ├── crud/              # DB queries
│   └── tests/             # pytest tests
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks (useCart, useLogin, useCatalog...)
│   │   └── pages/         # UserDashboard, AdminDashboard
├── main.py                # FastAPI entry point
└── requirements.txt
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT token |
| GET | `/menu/get_all_categories` | Get all categories with items |
| GET | `/menu/get_items_by_category/{id}` | Get items by category |
| POST | `/menu/create_category` | Create category (admin) |
| POST | `/menu/create_item` | Create menu item (admin) |
| PATCH | `/menu/update_item/{id}` | Update menu item (admin) |
| DELETE | `/menu/delete_item/{id}` | Delete menu item (admin) |
| GET | `/cart/cart-items` | Get user cart |
| POST | `/cart/add-item` | Add item to cart |
| GET | `/cart/orders` | Get user orders |
| GET | `/users/me` | Get current user profile |

Full API docs: [fooddelivery-production-0879.up.railway.app/docs](https://fooddelivery-production-0879.up.railway.app/docs)

---

## Local Setup

### Backend

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your DB credentials and SECRET_KEY

# Run server
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install

# Create .env.development
echo "REACT_APP_API_URL=http://localhost:8000" > .env.development

npm start
```

### Environment Variables

**Backend `.env`:**
```
DATA_BASE_URL=postgresql://user:password@localhost:5432/fooddelivery
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend `.env.development`:**
```
REACT_APP_API_URL=http://localhost:8000
```

---

## Running Tests

```bash
python -m pytest back/tests/ -v
```
