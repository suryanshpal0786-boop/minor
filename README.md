# TruthLens — Intelligent AI News Verification Platform

> **BCA Academic Minor Project**  
> A commercial-grade, explainable AI news verification and misinformation detection platform inspired by Apple's design philosophy: simplicity, elegant typography, generous whitespace, subtle animations, and exceptional attention to detail.

---

## 🧭 Project Overview

**TruthLens** helps users evaluate whether a news article, headline, or claim appears reliable, potentially misleading, or suspicious. Rather than acting as an opaque black box, TruthLens emphasizes **Explainable AI (XAI)**, providing clear linguistic reasoning, evidence cross-referencing, and source domain reputation checks.

> **Automated Assessment Notice:** TruthLens provides probabilistic evaluations based on linguistic stylometry, emotional arousal markers, and domain trust heuristics. It does not replace independent primary journalism or legal fact-checking. Automated confidence scores represent model pattern certainty, never absolute truth.

---

## 🛠️ Complete Tech Stack (Hackathon-IDC Specification)

### Frontend
- **Framework:** React 18 + TypeScript
- **Tooling / Dev Server:** Vite
- **Styling:** Tailwind CSS (Apple Minimalist Light Aesthetics `#fbfbfd` / `#ffffff` / `#1d1d1f` / `#0071e3`)
- **Design Inspiration:** Apple Human Interface Guidelines (clean typography, generous whitespace, rounded-3xl cards, subtle borders, soft diffuse shadows)
- **Animations:** Framer Motion
- **Routing:** React Router v6 (Protected User Dashboard & Admin routes)
- **HTTP Client:** Axios (automatic JWT authorization interceptor)
- **Real-Time Engine:** Socket.io-client
- **Icons:** Lucide React

### Backend
- **Server Framework:** Node.js + Express (ES Modules)
- **Database & ODM:** MongoDB + Mongoose (with intelligent in-memory fallback for zero-configuration development)
- **Real-Time WebSockets:** Socket.io (live step-by-step radar progress streaming)
- **Authentication:** JWT (`jsonwebtoken`) with role-based access control (`user` and `admin`)
- **Password Security:** bcryptjs
- **Environment & Tooling:** dotenv, nodemon, concurrently

---

## ⚡ Quick Start & Running

Start both the Express Backend and Vite Frontend with one command from the project root:

```bash
npm run dev
```

Or on Windows, simply double-click **`start-dev.bat`** or run **`start-dev.ps1`**.

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API & WebSockets:** [http://localhost:5001](http://localhost:5001)

---

## 🔑 Pre-Seeded Academic Test Credentials

The database comes pre-seeded with two ready-to-test accounts (with quick fill buttons on the login page):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo@truthlens.ai` | `Demo@123` | Full personal dashboard, news verification, history, saved reports, profile |
| **Administrator** | `admin@truthlens.ai` | `Admin@123` | Complete administrator panel, user management, telemetry, audit logs |

*You can also register your own new account anytime on the Registration page.*

---

## 🌟 Key Functional Modules

### 1. Landing Page (Apple-Inspired Hero & Engine)
- **Headline:** *"Not Everything You Read Is True."*
- **Hero Input Area:** Large verification card with category selector, headline input, content textarea, URL toggle, and quick test sample cases.
- **Trust Section:** AI-Assisted Analysis, Explainable Results, Source Credibility Checks, Transparent Predictions.
- **How It Works:** 3-step intuitive workflow.
- **Features Section:** 6 core capability cards.
- **Live System Telemetry:** Real database metrics (total analyses, credible vs misleading breakdown).

### 2. Four Objective Classification Categories
1. **Appears Credible** — High objectivity, verified institutional attribution, measured prose.
2. **Potentially Misleading** — Mixed indicators, framing bias, anonymous sourcing, or exaggerated headlines.
3. **Suspicious** — High emotional manipulation, aggressive clickbait hooks, unverified conspiracy narratives, or flagged domain history.
4. **Inconclusive** — Insufficient context or early-stage laboratory claims requiring independent benchmarking.

### 3. Explainable AI Analysis Report
- **Calibrated Confidence Score:** Explicitly distinguishes model confidence from absolute truth.
- **Headline Analysis:** Sensationalism score (0-100%), clickbait rating, and manipulative syntax detection.
- **Language Analysis:** Objectivity score, emotional charge, urgency level, and capitalization anomalies.
- **Source Credibility Module:** Publisher name, website domain, author information, transparency, and reliability tier.
- **Suspicious Indicators:** Tagged red flags with severity indicators.
- **Claims to Verify:** Specific extracted claims with status (*Corroborated*, *Unsupported*, *Requires Verification*).
- **Automated Limitations:** Transparent boundaries acknowledging probabilistic heuristics.
- **Action Buttons:** Save Report to library, Copy Analysis, Download Report as PDF (vector print layout), and Analyze Another.

### 4. User Workspace & Dashboard
- **Overview:** Real statistics queried directly from user records (Total Analyses, Credible, Misleading, Suspicious).
- **Verify News:** Dedicated verification studio with real-time Socket.io radar scanning updates.
- **Analysis History:** Chronological archive with search, category filters, classification filters, and delete functionality.
- **Saved Reports:** Bookmarked dossier with search, viewing, and export actions.
- **Profile & Settings:** Update Full Name, Email, change password, and permanent account deletion.

### 5. Administrator Panel
- **Role-Based Authorization:** Strictly protected for accounts with `role: 'admin'`.
- **System Telemetry:** Real-time database engine status, AI model status, memory usage, and classification distribution.
- **User Directory:** View users, search by name/email, activate/deactivate accounts.
- **Analyses Audit:** Review all user submissions across the network.
- **Activity Log:** Real-time audit trail of logins, registrations, verifications, and administrative actions.

---

## 📁 Project Structure

```
minor/
├── frontend/                   # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── public/                 # SVG icon and public assets
│   ├── src/
│   │   ├── components/         # Navbar, Footer, DashboardLayout, ClassificationBadge, ConfidenceGauge, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT & profile) & SocketContext (WebSocket stream)
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage,
│   │   │                       # DashboardPage, VerifyNewsPage, AnalysisResultPage, AnalysisHistoryPage,
│   │   │                       # SavedReportsPage, ProfileSettingsPage, AdminPage
│   │   ├── services/           # Axios API configuration
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # React Router v6 routing table
│   │   ├── main.tsx            # Application root
│   │   └── index.css           # Apple styling directives
│   ├── tailwind.config.js      # Custom Apple color palette & shadows
│   ├── vite.config.ts          # Proxy configuration to port 5001
│   └── package.json
│
├── backend/                    # Node.js + Express + Socket.io + MongoDB
│   ├── src/
│   │   ├── config/             # Mongoose connection & initial database seeder
│   │   ├── controllers/        # Auth, Analysis, Saved Reports, and Admin controllers
│   │   ├── middleware/         # JWT verification & Admin authorization middleware
│   │   ├── models/             # Mongoose schemas: User, NewsAnalysis, SavedReport, ActivityLog
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # AI News Credibility & Stylometry Analysis engine
│   │   ├── sockets/            # Socket.io connection & real-time progress streamer
│   │   ├── store/              # In-memory fallback store for offline development
│   │   └── server.js           # Server bootstrap
│   ├── .env                    # Environment variables
│   └── package.json
│
├── package.json                # Root concurrently runner
├── start-dev.bat               # Windows 1-click launcher
├── start-dev.ps1               # PowerShell launcher
└── README.md
```

---

## 📡 API Reference

- `GET  /api/health` — Service health check
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Sign in and receive JWT
- `GET  /api/auth/me` — Retrieve authenticated user profile
- `POST /api/analysis/detect` — Execute AI news verification (supports real-time Socket.io progress streaming)
- `GET  /api/analysis/user/history` — Retrieve authenticated user's analysis history
- `GET  /api/analysis/stats` — Real system statistics
- `GET  /api/analysis/:id` — Get full analysis report details
- `DELETE /api/analysis/:id` — Delete analysis report (author or admin only)
- `POST /api/saved-reports` — Bookmark report to library
- `GET  /api/saved-reports` — Retrieve user's saved library
- `DELETE /api/saved-reports/:analysisId` — Remove report from library
- `GET  /api/admin/overview` — Administrative metrics & telemetry (Admin only)
- `GET  /api/admin/users` — User directory & search (Admin only)
- `PUT  /api/admin/users/:id/toggle-status` — Activate/deactivate user account (Admin only)
- `GET  /api/admin/logs` — Audit activity logs (Admin only)
