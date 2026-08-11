# AI Resume Analyzer Pro

## Phase 1: Project Setup

### Folder structure

resume-analyzer/
  frontend/     -> React + Vite + Tailwind app
  backend/      -> FastAPI app connected to MySQL

### 1. Set up MySQL

Create a database called `resume_analyzer` (using MySQL Workbench, phpMyAdmin, or command line):

    CREATE DATABASE resume_analyzer;

### 2. Backend setup

    cd backend
    python -m venv venv
    venv\Scripts\activate        (Windows)
    source venv/bin/activate     (Mac/Linux)
    pip install -r requirements.txt
    copy .env.example .env       (Windows: copy, Mac/Linux: cp .env.example .env)

Edit `.env` and put your real MySQL password.

Run the backend:

    uvicorn app.main:app --reload --port 8000

Visit http://localhost:8000/docs to see the API docs.
Visit http://localhost:8000/health to confirm database connects.

### 3. Frontend setup

    cd frontend
    npm install
    copy .env.example .env       (Windows: copy, Mac/Linux: cp .env.example .env)
    npm run dev

Visit http://localhost:5173 in your browser.

You should see "AI Resume Analyzer Pro" with a gold "Backend status: ok (db: connected)" box.
If it says "backend not reachable", the backend isn't running.
If it says "db: error...", check your MySQL password/DB name in backend/.env.
