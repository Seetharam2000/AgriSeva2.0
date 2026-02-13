# Deploy frontend to GitHub Pages

The repo uses **GitHub Actions** to build and deploy the frontend to GitHub Pages on every push to `main`.

---

## 1. Enable GitHub Pages (one-time)

1. On GitHub, open your repo **AgriSeva2.0**.
2. Go to **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment**:
   - **Source:** select **GitHub Actions** (not “Deploy from a branch”).
4. Save. You don’t need to create a `gh-pages` branch; the workflow deploys for you.

---

## 2. Add your backend URL (required)

1. In the repo, go to **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. **Name:** `VITE_API_BASE_URL`
4. **Value:** your backend URL, e.g. `https://agriseva-api.onrender.com` (no trailing slash).
5. Click **Add secret**.

Without this secret, the frontend will use `http://localhost:8000` in the build and API calls will fail in production.

---

## 3. Deploy

- **Automatic:** Push to `main` (e.g. `git push origin main`). The workflow runs and deploys.
- **Manual:** **Actions** tab → **Deploy Frontend to GitHub Pages** → **Run workflow** → **Run workflow**.

After the workflow finishes (about 2–3 minutes), the site is at:

**https://Seetharam2000.github.io/AgriSeva2.0/**

(Replace `Seetharam2000` and `AgriSeva2.0` with your username and repo name if different.)

---

## 4. Optional: build and deploy from your machine

If you prefer not to use Actions:

```bash
cd frontend
npm install
VITE_API_BASE_URL=https://your-backend.onrender.com VITE_BASE_PATH=/AgriSeva2.0 npm run build
npx gh-pages -d dist
```

Your GitHub Pages site will update from the contents of `dist`.
