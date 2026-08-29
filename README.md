# 🐾 PawsCare — Animal Rescue & Pet Healing System

A full-stack animal welfare and medical rescue platform built with React, Node.js, Express, and a custom pastel UI design system.

---

## 🌟 Key Features

1. **Meet Our Pets → Adopt a Pet (`/adopt`)**:
   - Filterable adoptable pet catalog (Dogs, Cats, Rabbits, Birds)
   - Detailed pet cards and adoption application submission modal with database persistence.

2. **Cure Animals Gateway (`/cure-animals`)**:
   - Central healthcare hub routing to stray emergency rescue and pet healthcare.

3. **Cure Injured Animal (`/rescue`)**:
   - Live rescue cases tracker with recovery timeline.
   - **Report Injured Animal Modal**: Photo upload preview, GPS auto-detect, database storage, and email alert dispatch to `ADMIN_EMAIL`.

4. **Help My Pet (`/petcare`)**:
   - Searchable first-aid remedies and home veterinary care guides by symptom.
   - Certified veterinary appointment consultation requests.

5. **Nearby Helpers Map (`/helpers`)**:
   - Interactive live map showing nearby volunteer rescue ambulances, clinics, and animal helpers.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Lucide React Icons, Vanilla CSS Design System with Pastel theme.
- **Backend**: Node.js, Express.js, JSON database store, Nodemailer email dispatcher.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Run Locally
```bash
# Start Backend Server (runs on http://localhost:5000)
cd backend
node server.js

# Start Frontend Dev Server (runs on http://localhost:3000)
cd frontend
npm run dev
```
