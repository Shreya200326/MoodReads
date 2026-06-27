# MoodReads — Complete Setup & Deployment Guide

---

## PART 1 — Running in VS Code (Local Development)

### Step 1: Install Prerequisites

Before anything, make sure these are installed on your machine.

**Python 3.11+**
Download from https://python.org/downloads
During install on Windows → check **"Add Python to PATH"**
Verify: open Terminal and run `python --version`

**Node.js 18+**
Download from https://nodejs.org (pick the LTS version)
Verify: `node --version` and `npm --version`

**Git**
Download from https://git-scm.com
Verify: `git --version`

**VS Code Extensions to install** (open VS Code → Extensions tab → search each):
- Python (by Microsoft)
- Pylance
- ESLint
- Tailwind CSS IntelliSense
- Thunder Client (optional — for testing the API)

---

### Step 2: Get the Project into VS Code

**Option A — from the zip file (downloaded from Claude)**

1. Unzip `moodreads.zip` somewhere on your computer, e.g. `C:\Projects\moodreads` or `~/Projects/moodreads`
2. Open VS Code
3. File → Open Folder → select the `moodreads` folder
4. You should see `backend/` and `frontend/` in the Explorer panel

**Option B — from GitHub (if you've pushed it)**
```
git clone https://github.com/your-username/moodreads.git
cd moodreads
code .
```

---

### Step 3: Set Up the Backend

In VS Code, open a new terminal: **Terminal → New Terminal**

```bash
# Go into the backend folder
cd backend

# Create a virtual environment (keeps Python packages isolated)
python -m venv venv
```

**Activate the virtual environment:**
```bash
# On Windows (Command Prompt or PowerShell):
venv\Scripts\activate

# On Mac / Linux:
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal line.

```bash
# Install all backend dependencies
pip install -r requirements.txt
```

This installs FastAPI, SQLAlchemy, JWT, Anthropic SDK, etc. Takes about 1-2 minutes.

**Create your .env file:**
```bash
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

Now open `.env` in VS Code and edit it:

```
DATABASE_URL=sqlite:///./moodreads.db
SECRET_KEY=any-long-random-string-you-make-up
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
ANTHROPIC_API_KEY=sk-ant-api03-...your key here...
```

Where to get the Anthropic API key: https://console.anthropic.com → API Keys → Create Key
(AI features work without this, they just fall back to tag-based filtering.)

**Seed the database with 25 books:**
```bash
python seed_data.py
```
You should see: `✅  Seeded 25 books into the database.`

**Start the backend server:**
```bash
uvicorn app.main:app --reload --port 8000
```

Leave this terminal running. You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Test it's working: open your browser and go to http://localhost:8000
You should see `{"message":"MoodReads API is running ✨","docs":"/api/docs"}`

API docs (Swagger UI) are at: http://localhost:8000/api/docs

---

### Step 4: Set Up the Frontend

Open a **second terminal** in VS Code: click the `+` icon in the terminal panel.

```bash
# Go into the frontend folder
cd frontend

# Install all npm packages
npm install
```

This installs React, Vite, Tailwind, Framer Motion, etc. Takes 1-2 minutes.

**Start the frontend dev server:**
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 400ms
  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser — MoodReads is running.

---

### Step 5: VS Code Layout for Development

You'll have two terminals running at all times:

| Terminal | Command | What it does |
|----------|---------|-------------|
| Terminal 1 | `uvicorn app.main:app --reload --port 8000` | Backend API (auto-reloads on save) |
| Terminal 2 | `npm run dev` | Frontend (hot-reloads on save) |

**To stop either server:** press `Ctrl + C` in its terminal.

**To restart after closing VS Code:**
```bash
# Terminal 1 — backend
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
npm run dev
```

---

### Common Issues

**"python not found" on Windows**
Use `py` instead of `python`, e.g. `py -m venv venv`

**"venv\Scripts\activate : cannot be loaded because running scripts is disabled"**
Run this in PowerShell as admin: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Port 8000 already in use**
`uvicorn app.main:app --reload --port 8001` — then update the proxy in `frontend/vite.config.ts` to match.

**Books not showing up**
Make sure you ran `python seed_data.py` inside the `backend/` folder with the venv active.

---
---

## PART 2 — Deploying to Render (Recommended — Free Tier)

Render gives you a free PostgreSQL database, a free backend web service, and a free static site.
Everything you need, no credit card required.

---

### Step 1: Push Your Code to GitHub

Render deploys from GitHub, so you need the code there first.

```bash
# In your moodreads/ root folder:
git init
git add .
git commit -m "Initial commit — MoodReads"
```

Go to https://github.com/new → create a new repo called `moodreads` → **don't** add a README.

```bash
git remote add origin https://github.com/YOUR_USERNAME/moodreads.git
git branch -M main
git push -u origin main
```

Refresh GitHub — you should see all your files there.

---

### Step 2: Create a Render Account

Go to https://render.com → Sign Up → use GitHub to sign in (easier, links your repos automatically).

---

### Step 3: Create the PostgreSQL Database

1. On the Render dashboard click **New +** → **PostgreSQL**
2. Fill in:
   - Name: `moodreads-db`
   - Database: `moodreads`
   - User: `moodreads_user`
   - Region: Singapore (closest to India)
   - Plan: **Free**
3. Click **Create Database**
4. Wait ~2 minutes for it to spin up
5. Once created, scroll down to **Connection** section
6. Copy the **Internal Database URL** — it looks like:
   `postgresql://moodreads_user:somepassword@dpg-xxxxx-a/moodreads`
   
   **Save this — you'll paste it in the next step.**

---

### Step 4: Deploy the Backend

1. Click **New +** → **Web Service**
2. Connect Repository → find `moodreads` → click **Connect**
3. Fill in the settings:

| Field | Value |
|-------|-------|
| Name | `moodreads-api` |
| Region | Singapore |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `bash start.sh` |
| Plan | **Free** |

4. Scroll down to **Environment Variables** → click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | The Internal Database URL you copied in Step 3 |
| `SECRET_KEY` | Any long random string (e.g. `x7k2m9p4q1r8s3t6v5w0y2z`) |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (or leave blank) |
| `PYTHON_VERSION` | `3.11.0` |

5. Click **Create Web Service**

Render will now build and deploy. This takes 3-5 minutes. Watch the logs — you should see:
```
Running database setup...
✅  Seeded 25 books into the database.
Starting server...
INFO:     Application startup complete.
```

6. Your backend URL will be something like: `https://moodreads-api.onrender.com`
   Test it: open that URL in your browser — you should see the `{"message":"MoodReads API is running ✨"}` response.

---

### Step 5: Deploy the Frontend

1. Click **New +** → **Static Site**
2. Connect the same `moodreads` repo → click **Connect**
3. Fill in the settings:

| Field | Value |
|-------|-------|
| Name | `moodreads` |
| Branch | `main` |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. Add Environment Variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://moodreads-api.onrender.com` (your backend URL from Step 4 — no trailing slash) |

5. Click **Create Static Site**

Build takes 2-3 minutes. Your frontend URL will be: `https://moodreads.onrender.com`

---

### Step 6: Connect Frontend and Backend (CORS)

Go back to your **moodreads-api** Web Service → Environment → add one more variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://moodreads.onrender.com` |

Click **Save Changes** — Render will redeploy automatically (takes ~2 min).

Now open `https://moodreads.onrender.com` — your app is live on the internet.

---

### Render Notes

- **Free tier sleeps after 15 minutes of inactivity.** First request after sleeping takes ~30 seconds to wake up. This is normal.
- The free PostgreSQL database is deleted after 90 days. You can export data or upgrade to avoid this.
- To redeploy after pushing new code: Render auto-deploys on every `git push` to `main`.

---
---

## PART 3 — Deploying to Railway (Alternative)

Railway is slightly faster to set up than Render and doesn't sleep on free tier (but has a $5/month credit limit).

---

### Step 1: Create a Railway Account

Go to https://railway.app → Sign Up with GitHub.

---

### Step 2: Deploy the Backend

1. Click **New Project** → **Deploy from GitHub repo**
2. Select your `moodreads` repo
3. Railway will detect it and create a service
4. Click the service → **Settings** tab:
   - Root Directory: `backend`
   - Start Command: `bash start.sh`
5. Click **Variables** tab → add all environment variables:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | Any long random string |
| `ANTHROPIC_API_KEY` | Your Anthropic key |

6. Now add PostgreSQL: click **New** → **Database** → **Add PostgreSQL**
7. Railway auto-injects `DATABASE_URL` into your service — no need to copy-paste.
8. Go back to your backend service → **Settings** → **Networking** → **Generate Domain**
   Your backend URL will be like `moodreads-api.up.railway.app`

---

### Step 3: Deploy the Frontend

1. In the same Railway project, click **New** → **GitHub Repo** → same `moodreads` repo
2. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve dist` (Railway needs a start command for static sites)
3. Add variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://moodreads-api.up.railway.app` |

4. Generate domain for this service too.

---

### Step 4: Add CORS variable to backend

Go back to backend service → Variables → add:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-frontend.up.railway.app` |

Railway will redeploy both services automatically.

---
---

## Quick Reference: Environment Variables Summary

### Backend (.env locally / Environment Variables on Render or Railway)

| Variable | Local | Production |
|----------|-------|------------|
| `DATABASE_URL` | `sqlite:///./moodreads.db` | PostgreSQL URL from hosting provider |
| `SECRET_KEY` | Any string | Long random string — keep secret |
| `ANTHROPIC_API_KEY` | Your key | Your key |
| `FRONTEND_URL` | Not needed | Your deployed frontend URL |

### Frontend (.env.local locally / Environment Variables on Render or Railway)

| Variable | Local | Production |
|----------|-------|------------|
| `VITE_API_URL` | Not needed (uses Vite proxy) | Your deployed backend URL |

---

## Adding More Books Later

Edit `backend/seed_data.py` → add a new entry to the `BOOKS` list with:
- `title`, `author`, `genre`, `isbn`, `pages`, `year`, `description`
- `mood_tags`: list like `["Dreamy", "Romantic"]`
- `moods`: same as string `"Dreamy,Romantic"`
- `cover_url`: `https://covers.openlibrary.org/b/isbn/YOUR_ISBN-L.jpg`

Valid moods: `Happy`, `Sad`, `Heartbroken`, `Motivated`, `Dreamy`, `Peaceful`, `Adventurous`, `Thrilling`, `Romantic`, `Mystery`

Then locally: delete `moodreads.db` and run `python seed_data.py` again.
On production: Render/Railway will run `seed_data.py` on next deploy (it skips if books already exist).
