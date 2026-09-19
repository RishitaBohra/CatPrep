# 🎯 CAT Prep — Personal Tracker Command Center

A full-stack MERN application built for **CAT (Common Admission Test)** aspirants to organize, track, and optimize their daily study schedule, mock test performances, long-term targets, and consistency metrics.

---

## 🌐 Live Application Links

- **Frontend Web Application (Netlify)**:  
  👉 **[https://catprep-tracker.netlify.app](https://catprep-tracker.netlify.app)**

- **Backend REST API (Render)**:  
  👉 **[https://catprep-ayd2.onrender.com](https://catprep-ayd2.onrender.com)**

- **API Health Check**:  
  👉 [https://catprep-ayd2.onrender.com/api/health](https://catprep-ayd2.onrender.com/api/health)

---

## ✨ Key Features

- 💡 **Motivational Quote Flashcards**: Daily rotating CAT prep motivation quotes with interactive click-to-advance controls.
- ⏳ **CAT Countdown & Phase Tracker**: Dynamic day counter to exam day categorized into Build, Sprint, and Revision phases.
- 🎯 **Today's Mission & Weekly Goals**: User-controlled daily checklist and weekly task planner with real-time progress bars.
- 📅 **Interactive Monthly Study Calendar**: Click-to-cycle study day statuses (*Full Day*, *Partial Day*, *Missed Day*), monthly metrics summary, and per-day study notes.
- 📊 **Mock Test Analytics**: Interactive score charts and log history tracking percentile performance across VARC, DILR, and Quant.
- 📈 **Long-term Target Tracker**: Customizable prep targets with progress bars, status badges (*On Track*, *Behind*, *Completed*), and quick increment buttons.
- 🏆 **Gamified XP & Prep Streaks**: Earn XP for task completions, maintain active study streaks, and unlock consistency achievements.
- 🧠 **Learning Log**: Persistent notebook for key shortcuts, formulas, and concepts.
- 📱 **Responsive UI with Slide-out Mobile Side Navbar**: Mobile layout with a left slide-out navigation drawer toggled via a three-line hamburger menu logo.
- 🔐 **Private Account Authentication**: JWT authentication (Register / Login / Logout) ensuring each aspirant's data is isolated and safely stored in MongoDB Atlas.

---

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), React Router, Custom CSS (Teal/Cyan Dark Glassmorphic Theme)
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt password encryption
- **Database**: MongoDB Atlas with Mongoose ODM
- **Deployment**: Netlify (Frontend) + Render (Backend Web Service)

---

## ⚙ Environment Variables Setup

### Frontend (`client/.env`)
```env
VITE_API_URL=https://catprep-ayd2.onrender.com/api
```

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cat_tracker?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_key
CLIENT_ORIGIN=https://catprep-tracker.netlify.app,http://localhost:5173
```

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RishitaBohra/CatPrep.git
   cd CatPrep
   ```

2. **Start Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:5000`*

3. **Start Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:5173`*
