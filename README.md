# CAT Prep — Personal Tracker (MERN Stack)

A complete MERN stack CAT preparation command center featuring daily motivation quote flashcards, today's mission, weekly goals, interactive study calendar, target tracker, mock score charts, achievements, learning log, and settings.

---

## 🚀 Live Deployment URLs

- **Frontend (Netlify)**: [https://enchanting-stardust-faddd9.netlify.app](https://enchanting-stardust-faddd9.netlify.app)
- **Backend API (Render)**: [https://catprep-ayd2.onrender.com](https://catprep-ayd2.onrender.com)
- **API Health Check**: [https://catprep-ayd2.onrender.com/api/health](https://catprep-ayd2.onrender.com/api/health)

---

## ⚙ Environment Variables Setup

### Frontend (Netlify Environment Variables)
- `VITE_API_URL`: `https://catprep-ayd2.onrender.com/api`

### Backend (Render Environment Variables)
- `MONGODB_URI`: *Your MongoDB connection string*
- `JWT_SECRET`: *Your JWT secret token*
- `CLIENT_ORIGIN`: `https://enchanting-stardust-faddd9.netlify.app`

---

## 📌 How to Push Updates to GitHub & Auto-Deploy

```bash
git add .
git commit -m "Update live production deployment URLs for Netlify & Render"
git push origin main
```

*(Pushing to `main` will automatically trigger fresh builds on both Netlify and Render!)*

---

## 🛠 Local Development Setup

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
