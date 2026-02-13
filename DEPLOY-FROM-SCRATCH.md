# Deploy AgriSeva from scratch

Follow these steps in order. You need: GitHub account, Render account, Netlify account.

---

## Part 1: Push code to GitHub

### 1.1 Open terminal in your project folder

```bash
cd "c:\Users\Hp\OneDrive\Desktop\SRM\4th sem\Hackathon\Hackalite\App"
```

### 1.2 Check Git status

```bash
git status
```

### 1.3 If this is a new repo (no remote yet)

```bash
git init
git add .
git commit -m "Initial commit - AgriSeva app"
```

Create a **new repository** on GitHub (github.com → New repository). Name it e.g. `AgriSeva2.0`. Do **not** add README or .gitignore.

Then link and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/AgriSeva2.0.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 1.4 If the repo already exists and you just want to push latest code

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Part 2: Deploy backend on Render

### 2.1 Go to Render

- Open [render.com](https://render.com) and sign in (or sign up with GitHub).

### 2.2 Create Web Service

- Click **New** → **Web Service**.
- Connect your **GitHub** account if asked.
- Select the repo: **AgriSeva2.0** (or your repo name).

### 2.3 Configure the service

| Field | Value |
|-------|--------|
| **Name** | `agriseva-api` (or any name) |
| **Region** | Choose nearest (e.g. Oregon) |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### 2.4 Add environment variables

Click **Environment** (or **Environment Variables**) and add:

| Key | Value |
|-----|--------|
| `JWT_SECRET` | Any long random string (e.g. `agriseva-secret-2026-xyz`) |
| `GROQ_API_KEY` | Your Groq key (optional, for chatbot AI) |

Leave others empty if you don’t use them.

### 2.5 Deploy

- Click **Create Web Service**.
- Wait for the first deploy to finish (a few minutes).
- Copy your backend URL: **https://agriseva-api.onrender.com** (or whatever name you used). You need this for the frontend.

---

## Part 3: Deploy frontend on Netlify

### 3.1 Go to Netlify

- Open [app.netlify.com](https://app.netlify.com) and sign in (or sign up with GitHub).

### 3.2 Add new site

- Click **Add new site** → **Import an existing project**.
- Choose **GitHub** and authorize Netlify.
- Select the repo: **AgriSeva2.0**.

### 3.3 Build settings

| Field | Value |
|-------|--------|
| **Base directory** | `frontend` |
| **Build command** | `npx vite build` |
| **Publish directory** | `dist` (or `frontend/dist` if Netlify shows it) |

### 3.4 Environment variables

Click **Add environment variables** / **Show advanced** and add:

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | Your Render backend URL, e.g. `https://agriseva-api.onrender.com` |
| `VITE_BASE_PATH` | `/` |

No trailing slash on the backend URL.

### 3.5 Deploy

- Click **Deploy site**.
- Wait for the build to finish. Your site URL will be like **https://something.netlify.app**.

---

## Part 4: Allow frontend in backend CORS (optional)

If the backend uses a strict CORS list:

- In **Render** → your backend service → **Environment**.
- Add: `CORS_ALLOW_ALL` = `True`  
  **or** add your Netlify URL to the CORS list (e.g. `https://your-site.netlify.app`).
- Save and let the service redeploy.

---

## Quick checklist

- [ ] Code pushed to GitHub (`git push origin main`)
- [ ] Render: Web Service created, Root = `backend`, env `JWT_SECRET` set
- [ ] Render: Start command = `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Backend URL copied from Render
- [ ] Netlify: Site from Git, Base = `frontend`, Build = `npx vite build`, Publish = `dist`
- [ ] Netlify: `VITE_API_BASE_URL` = Render URL, `VITE_BASE_PATH` = `/`
- [ ] Both deploys successful; open Netlify URL and test login/features

---

## If something fails

- **Render build fails:** Check that Root Directory is `backend` and `requirements.txt` is in that folder.
- **Netlify “vite: Permission denied”:** Build command must be `npx vite build` (already in `frontend/netlify.toml`).
- **Frontend can’t reach API:** Check `VITE_API_BASE_URL` has no typo and no trailing slash; check backend CORS allows your Netlify URL.
