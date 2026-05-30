# Web App Project

## Description
Multi-layer application: backend (FastAPI/Python) and frontend (React/JS).

## Structure
- `back/` — backend (FastAPI, SQLAlchemy, tests)
- `fronted/` — frontend (React)
- `static/uploads/` — user-uploaded files

## Quick Start
### Backend
1. Go to the `back/` folder
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Go to the `fronted/` folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm start
   ```

## Environment Variables
- `.env` for backend (DB, secrets)
- `.env` for frontend (if needed)

## Tests
- Backend: `python -m pytest back/tests/`

## Important
- Do not publish files from `.gitignore` (they may contain sensitive data)
- `users.txt` is not used in the code

---

## package.json and package-lock.json
- **Required!**
- `package.json` — describes dependencies, scripts, and project metadata (frontend)
- `package-lock.json` — locks exact versions of all packages for reproducibility
- Both files must be in the repository for correct npm/yarn and CI/CD operation
