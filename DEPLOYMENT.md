# Deploying AgriSeva

You have a **frontend** (React/Vite) and a **backend** (FastAPI). Deploy both so the app works in production.

---

## 1. Deploy the backend (API)

The frontend calls `VITE_API_BASE_URL` (or `http://localhost:8000`). Set this to your deployed backend URL after step 2.

### Option A: Render (free tier, recommended)

1. Push your code to **GitHub**.
2. Go to [render.com](https://render.com) → Sign up → **New** → **Web Service**.
3. Connect your repo and set:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables** in Render dashboard (e.g. `JWT_SECRET`, `GROQ_API_KEY` if you use chatbot). Do **not** commit `.env` to git.
5. Deploy. Your API URL will be like `https://your-app-name.onrender.com`. Use this as `VITE_API_BASE_URL` for the frontend.

### Option B: Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. Select repo, set **Root Directory** to `backend`.
3. Railway will detect Python. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env vars in Railway dashboard. Copy the generated URL (e.g. `https://xxx.railway.app`) for the frontend.

### Option C: Fly.io

```bash
cd backend
fly launch   # follow prompts, choose region
fly secrets set JWT_SECRET=your-secret   # add other env vars as needed
fly deploy
```

Your API URL: `https://your-app-name.fly.dev`

---

## 2. Deploy the frontend

Set the backend URL when building so the app talks to your deployed API.

### Option A: GitHub Pages (already configured)

Your `package.json` has `homepage` and `deploy` script. To use your **deployed backend**:

1. Create a file `frontend/.env.production` (do not commit secrets; use GitHub Actions or build env):
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
   Or build locally with:
   ```bash
   cd frontend
   VITE_API_BASE_URL=https://your-backend-url.onrender.com npm run build
   npm run deploy
   ```

2. If you use GitHub Actions, add a workflow that sets `VITE_API_BASE_URL` and runs `npm run build` then deploys `dist` to `gh-pages`.

### Option B: Vercel (recommended for React)

1. Push code to GitHub, then go to [vercel.com](https://vercel.com) → Import your repo.
2. Set **Root Directory** to `frontend`.
3. **Environment Variables:** Add `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com` (or your backend URL).
4. **Build Command:** `npm run build` (default).
5. **Output Directory:** `dist` (default for Vite).
6. Deploy. Vercel will give you a URL like `https://your-app.vercel.app`.

**Note:** If your app uses client-side routing (React Router), in Vercel add a `vercel.json` so all routes serve `index.html` (see below).

### Option C: Netlify

1. [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git.
2. Root: `frontend`, Build command: `npm run build`, Publish directory: `dist`.
3. Add env var `VITE_API_BASE_URL` = your backend URL.
4. Create `frontend/netlify.toml` (see below) for SPA routing.

---

## 3. CORS

Your backend already allows origins with `CORS_ALLOW_ALL: bool = True` or a list in `backend/app/core/config.py`. For production you can set `CORS_ORIGINS` in backend env to your frontend URLs, e.g.:

- `https://your-app.vercel.app`
- `https://Seetharam2000.github.io` (for GitHub Pages)

---

## 4. Checklist

| Step | Action |
|------|--------|
| 1 | Deploy backend (Render/Railway/Fly) and copy API URL |
| 2 | Set `VITE_API_BASE_URL` to that URL when building frontend |
| 3 | Deploy frontend (GitHub Pages / Vercel / Netlify) |
| 4 | Add frontend URL to backend CORS if you use a strict list |
| 5 | (Optional) Set `JWT_SECRET`, `GROQ_API_KEY`, etc. in backend env |

---

## Quick commands (after backend URL is ready)

**Frontend (build with API URL):**
```bash
cd frontend
VITE_API_BASE_URL=https://YOUR_BACKEND_URL npm run build
```

**Backend (local test):**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
