# 💸 Playto – AI-Powered Payout Engine

## 🚀 Overview

Playto is a full-stack fintech-inspired payout system that simulates real-world payment infrastructure. It allows merchants to request payouts, tracks balances, and uses basic AI-based risk scoring to flag suspicious transactions.

The system is built with a modern architecture:

* **Frontend**: React (Vercel)
* **Backend**: Node.js + Express (Render)
* **Database**: PostgreSQL (Render)

---

## 🧠 Core Features

### 1. Merchant Dashboard

* View available and held balances
* Monitor payout history
* Track account integrity (risk score)

### 2. Payout Requests

* Submit payout requests with amount & bank account
* Uses **idempotency keys** to prevent duplicate requests
* Supports retry-safe operations

### 3. AI Risk Engine (Simulated)

* Each payout is assigned a **risk score**
* High-risk payouts trigger warnings
* Helps simulate fraud detection systems

### 4. Ledger System

* Tracks all credits and debits
* Ensures accurate balance calculation
* Mimics real financial accounting systems

---

## ⚙️ System Architecture

```text
Frontend (Vercel)
        ↓
Backend API (Render)
        ↓
PostgreSQL Database (Render)
```

---

## 🗄️ Database Design

### Tables:

#### `merchants`

Stores merchant information

* id (UUID)
* name
* created_at

#### `ledger_entries`

Tracks all balance changes

* CREDIT / DEBIT system
* Linked to merchants

#### `payouts`

Main payout requests

* status: PENDING, PROCESSING, COMPLETED, FAILED
* risk_score (AI simulation)
* idempotency_key

#### `idempotency_keys`

Prevents duplicate transactions

---

## 🔄 Payout Flow

```text
User Request → PENDING
              ↓
        (Worker/Processor)
              ↓
        PROCESSING
              ↓
        COMPLETED / FAILED
```

---

## ⚠️ Important Learnings

### 1. Localhost vs Production

* `localhost` only works locally
* In production, always use deployed backend URL

### 2. Separate Databases

* Local DB ≠ Production DB
* Data must be seeded manually in production

### 3. Environment Variables

* Frontend → `VITE_API_URL`
* Backend → `DATABASE_URL`

### 4. Idempotency

* Prevents duplicate payouts
* Critical in payment systems

### 5. Authentic Skill Development

This project emphasizes **hands-on learning and real implementation**.
While AI tools can assist in development, they cannot replace a developer’s understanding of system design, debugging, and architecture.

In particular, frameworks like **Django** (or any backend framework) require practical experience —
they cannot be meaningfully “faked” without actually building and understanding real systems like this one.

---

## 🧪 Challenges Faced

* CORS issues between frontend & backend
* Wrong API endpoints (`localhost` in production)
* Empty production database
* Incorrect state handling in React
* Deployment debugging (Render + Vercel)

---

## 🛠️ Future Improvements

* Background worker (queue system using Redis/Bull)
* Real-time updates using WebSockets
* Advanced fraud detection model
* Admin dashboard
* Multi-merchant authentication

---

## 📦 Setup Instructions

### Backend

```bash
npm install
npm start
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render
* Database: Render PostgreSQL

---

## 🎯 Conclusion

This project simulates a real-world payout infrastructure with:

* Scalable architecture
* Secure transaction handling
* Clean UI/UX
* Practical fintech concepts

It demonstrates strong understanding of:

* Full-stack development
* System design
* API architecture
* Database management

---

## 👨‍💻 Author

**Abhigyan Prakash**
