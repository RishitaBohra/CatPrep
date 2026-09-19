# CAT Prep — Personal Tracker (MERN Stack)

A complete MERN stack CAT preparation command center with daily motivation quote flashcards, today's mission, weekly goals, interactive study calendar, target tracker, mock score charts, achievements, learning log, and settings.

---

## 1. Pushing Code to GitHub

1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CAT Prep MERN App"
   ```

2. Create a new repository on [GitHub](https://github.com/new).
3. Connect and push your local code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cat-tracker-mern.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Deploying Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository (`cat-tracker-mern`).
3. Fill in the following settings:
   - **Name**: `cat-tracker-api` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A strong random string (e.g. `super_secret_cat_prep_key_2026`)*
   - `CLIENT_ORIGIN`: *Your Netlify URL (e.g. `https://your-site-name.netlify.app` or `*` temporarily)*
5. Click **Create Web Service**.
6. Copy your Render live backend URL (e.g., `https://cat-tracker-api.onrender.com`).

---

## 3. Deploying Frontend on Netlify

1. Log into [Netlify Dashboard](https://app.netlify.com/) and click **Add new site** → **Import an existing project**.
2. Select **GitHub** and authorize access to your `cat-tracker-mern` repository.
3. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist` (or `dist`)
4. Expand **Environment variables** and add:
   - `VITE_API_URL`: `https://cat-tracker-api.onrender.com/api` *(replace with your actual Render API URL followed by `/api`)*
5. Click **Deploy Site**.
6. Once deployed, copy your Netlify site URL (e.g., `https://cat-tracker.netlify.app`).

---

## 4. Final Step: Link CORS on Render

Go back to your **Render Dashboard** → **cat-tracker-api** → **Environment**:
- Update `CLIENT_ORIGIN` to your live Netlify site URL (e.g., `https://cat-tracker.netlify.app`).
- Save changes (Render will automatically redeploy).

---

## Local Development

1. **Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Runs on `http://localhost:5000`

2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Runs on `http://localhost:5173`
