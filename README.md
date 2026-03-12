# Alpha Wealth Pro – Affiliate Binary Network Platform

Alpha Wealth Pro is a full‑stack affiliate / network marketing platform that combines a modern React dashboard with a robust Django API.  
It implements a binary tree referral system, automatic binary income calculation, E‑Pin based account creation, financial operations, and an “Alpha Bonus” tiered reward program.

---

## Overview

Alpha Wealth Pro is designed for affiliate / MLM‑style businesses that want to:

- Track users in a **binary tree** (left / right) structure.
- Pay **binary income** whenever left/right pairs are completed.
- Manage **deposits** and **withdrawals** with multiple payment methods (EasyPaisa, JazzCash, Bank).
- Sell and consume **E‑Pins** to create new accounts under the network.
- Reward growth via **Alpha Bonus tiers** that unlock one‑time bonuses when team‑size requirements are met.
- Provide a clean, mobile‑friendly **dashboard** and an **admin panel** to manage the whole system.

---

## Tech Stack

- **Frontend**
  - React (Create React App)
  - `react-router-dom` – routing and protected dashboard routes
  - React Context for authentication (JWT in `localStorage`)
  - `axios` (via `apiFetch` wrapper) for API calls
  - `lucide-react` icons, custom CSS for modern UI

- **Backend**
  - Django 4.x
  - Token‑based auth with JWT (PyJWT)
  - Models for `UserProfile`, `Deposit`, `Withdrawal`, `Reward`, `UserReward`, `PinCode`, `PinRequest`, and `Account`
  - SQLite (dev) / PostgreSQL (via `dj-database-url`) in production
  - `django-cors-headers`, `whitenoise`, `gunicorn` for production

---

## Core Features

- **User Authentication & Roles**
  - Login with JWT‑based authentication.
  - `UserProfile` extends Django’s `User` with `role` (user/admin) and binary tree info.

- **Binary Tree Network**
  - Each user has a `parent` and a `position` (`left` / `right`).
  - Backend computes team size recursively.
  - Frontend shows a collapsible **My Tree** view with a binary diagram and stats for left/right members.

- **Binary Income (Pair Bonus)**
  - For every **1 left + 1 right** completed pair in a user’s downline, the user earns **200 PKR**.
  - Left and right counts include the entire subtree on each side (all levels).
  - The **available balance** displayed in the dashboard and sidebar includes this binary income.

- **Financial Operations**
  - **Deposits**: users can submit deposit requests with payment screenshot and method.
  - **Withdrawals**: users can request withdrawals to EasyPaisa, JazzCash, or Bank.
  - Admin views for pending/approved/rejected deposits and withdrawals.

- **E‑Pins**
  - Users can request/buy E‑Pins.
  - E‑Pins are used to create new accounts under a specific user and side (left/right).
  - Admin can manage available and pending pins.

- **Alpha Bonus (One‑Time Rewards)**
  - Configurable reward tiers (team size, rank, and amount).
  - When a user meets the team requirement and clicks **Unlock**, they receive a **one‑time bonus** (credited as an approved deposit).
  - Each level can be claimed only once; users then aim for the next tier.

- **Admin Panel**
  - Separate admin dashboard for:
    - Users
    - Deposits (pending / all)
    - Withdrawals (pending / today / all)
    - E‑Pins (available / pending requests)
    - Reward tiers

---

## Project Structure

- `backend/` – Django project (`core`) and API app (`api`)
  - `api/models.py` – domain models (profiles, tree, deposits, withdrawals, rewards, pins, accounts, contact messages).
  - `api/views/` – `auth_views`, `user_views`, `admin_views` for the REST‑like API.
  - `core/settings.py` – Django settings, database, CORS, static files.
  - `core/urls.py` – routes `/admin/` and `/api/`.

- `src/` – React SPA
  - `Pages/Dashboard/` – user & admin dashboard shell + all dashboard pages.
  - `Pages/Dashboard/Components/DashboardHome/` – main user overview (balances, stats).
  - `Pages/Dashboard/Components/MyTree/` – binary tree visualization.
  - `Pages/Dashboard/Components/RewardList/` – Alpha Bonus UI.
  - `context/AuthContext` – authentication and user role context.
  - `utils/api.js` – fetch wrapper that injects JWT and base API URL.
  - `utils/format.js` – currency formatting helper for PKR.

---

## Running the Project Locally

### 1. Backend (Django API)

From the project root:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The API will be available at `http://localhost:8000`.

### 2. Frontend (React)

From the project root:

```bash
npm install
npm start
```

The React app will run at `http://localhost:3000` and, in development, proxy `/api/*` calls to `http://localhost:8000`.

---

## Environment Configuration

### Backend

Key environment variables:

- `DJANGO_SECRET_KEY` – secret key for Django (required in production).
- `DATABASE_URL` – (optional) PostgreSQL connection string.
- `FRONTEND_URL` – URL of the deployed frontend (for CORS).
- `RENDER` / `RENDER_EXTERNAL_HOSTNAME` – used when deploying to Render or similar PaaS.

### Frontend

The API base URL is configured via:

- `REACT_APP_API_URL` – e.g. `https://your-backend-domain.com`

If this is not set, the React app will call relative `/api/...` paths (useful for local dev with a proxy).

---

## Scripts

### Frontend

- `npm start` – start the React dev server.
- `npm run build` – create a production build of the React app.

### Backend

- `python manage.py runserver` – start the Django development server.
- `python manage.py migrate` – apply database migrations.

---

## License

This project is proprietary and intended for demonstration / client use.  
Do not use, modify, or distribute without permission from the project owner.

