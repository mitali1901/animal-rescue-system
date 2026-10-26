# 🐾 PawsCare — Animal Rescue & Pet Healing System

A modern, full-stack animal welfare, adoption, and medical rescue platform built with **React**, **Node.js**, **Express**, **MongoDB Atlas (Mongoose)**, and a custom pastel UI design system.

---

## 🌟 Key Features

1. **🐕 Meet Our Pets → Adopt a Pet (`/adopt`)**:
   - Filterable adoptable pet catalog (Dogs, Cats, Rabbits, Birds).
   - Detailed pet profiles with medical status (vaccinations, neutering) and urgency badges.
   - Interactive adoption application modal with database persistence to MongoDB Atlas.

2. **🏥 Cure Animals Gateway (`/cure-animals`)**:
   - Central healthcare hub routing between emergency street animal rescue and home pet healthcare.

3. **🚨 Cure Injured Animal (`/rescue`)**:
   - Live rescue cases tracker with interactive recovery timeline (`Reported` ➔ `Helper Dispatched` ➔ `Under Vet Care` ➔ `Recovered`).
   - **Report Injured Animal Modal**: Photo upload preview, geolocation auto-detect, database storage, and optional email alert dispatch to `ADMIN_EMAIL`.

4. **🩺 Help My Pet (`/petcare`)**:
   - Searchable first-aid remedies and home veterinary care guides by symptom and category.
   - Certified veterinary appointment consultation request booking with database storage.

5. **📍 Nearby Helpers Map (`/helpers`)**:
   - Interactive live map powered by Leaflet & OpenStreetMap showing nearby volunteer rescue ambulances, emergency 24/7 clinics, and wildlife handlers.

6. **🤖 AI Veterinary Assistant (`/chatbot`)**:
   - Integrated Google Gemini AI assistant for real-time pet health questions, triage assessment, and first-aid recommendations.

7. **🔐 User Authentication & Security**:
   - Secure account registration with password complexity enforcement and bcrypt hashing.
   - 6-digit OTP verification system with smart local development mode auto-fill.
   - Stateless JWT authentication (7-day sessions) and protected routes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 7, Leaflet / React-Leaflet, Lucide Icons, Vanilla CSS Pastel Design System.
- **Backend**: Node.js, Express.js (ES Modules), Mongoose & MongoDB Atlas, JWT, Bcrypt.js, Nodemailer.
- **Database**: MongoDB Atlas with dual-mode fallback (in-memory + local JSON store synchronization).
- **AI**: Google Gemini API (`@google/genai`).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+
- A free **MongoDB Atlas** cluster (or local MongoDB instance)

---

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/mitali1901/animal-rescue-system.git
cd animal-rescue-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 3. Environment Configuration

#### Backend Configuration:
Create a `.env` file in the `backend/` directory (you can copy `backend/.env.example`):
```bash
cd backend
cp .env.example .env
```

Configure your variables in `backend/.env`:
```env
PORT=5001
JWT_SECRET=your_jwt_secret_key_here
ADMIN_EMAIL=admin@pawsrescue.org

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.your_cluster.mongodb.net/animal-rescue?retryWrites=true&w=majority

# Optional: To enable real outgoing Gmail messages (Nodemailer 16-character App Password)
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_gmail_app_password

# Optional: Google Gemini API Key for AI Veterinary Assistant
# GEMINI_API_KEY=your_gemini_api_key
```

> **Note on Port 5001**: On macOS, port `5000` is reserved by AirPlay Receiver (`commplex-main`). The backend runs on port `5001` by default to avoid port collisions.

---

### 4. Running Locally

```bash
# Terminal 1 — Start Backend Server (runs on http://localhost:5001)
cd backend
node server.js

# Terminal 2 — Start Frontend Dev Server (runs on http://localhost:3000)
cd frontend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📡 API Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check probe |
| `/api/db-status` | `GET` | Check live MongoDB Atlas connection status |
| `/api/auth/signup-request` | `POST` | Request account creation & generate 6-digit OTP |
| `/api/auth/verify-otp` | `POST` | Verify OTP code & issue JWT session token |
| `/api/auth/login` | `POST` | User login & JWT issuance |
| `/api/auth/me` | `GET` | Retrieve logged-in user profile (Bearer token) |
| `/api/adoption` | `GET` | List adoptable pets (supports `?species=` filter) |
| `/api/adopt` | `POST` | Submit adoption application |
| `/api/adoption/applications` | `GET` | List all adoption applications |
| `/api/rescue` | `GET` | List active animal rescue cases |
| `/api/rescue/report` | `POST` | Report a new injured/stray animal |
| `/api/rescue/:id/status` | `PUT` | Update rescue status & append timeline note |
| `/api/petcare/guides` | `GET` | List first-aid pet care guides (supports `?query=` & `?category=`) |
| `/api/petcare/consult` | `POST` | Book a veterinary consultation request |
| `/api/helpers` | `GET` | List nearby clinics, ambulances, and volunteers (supports `?type=`) |
| `/api/chatbot/message` | `POST` | Ask veterinary care questions to Gemini AI |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
