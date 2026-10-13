# Ticket System

 <!--  SORRY I GOT CARRIED AWAY WITH FRONTEND DESIGN -->

A full-stack ticketing system composed of two parts that work together:

- **Backend API** — a Django REST framework application (`api/`).
- **Frontend Dashboard** — a React + TypeScript + Vite application (`dashboard/`).

In development, the Vite dev server proxies all `/api` requests to the Django
backend, so the UI and API can be developed side by side with **no CORS
configuration required**.

---

## Repository layout

| Path | Purpose |
| --- | --- |
| `api/` | Django (REST) backend |
| `dashboard/` | React + TypeScript + Vite frontend |
| `api/db.sqlite3` | SQLite database created by migrations |
| `api/env/` | Python virtualenv (shipped, pre-configured) |
| `dashboard/node_modules/` | npm dependencies (shipped) |
| `api/requirements.txt` | Backend dependency lockfile |

---

## Prerequisites

### Back-end
- **Python 3.11+** (this repo ships `env/` on Python 3.13; all Python
  dependencies are already installed).
- `pip` (for installing from `requirements.txt`, if you create a fresh environment).

### Front-end
- **Node.js 20 LTS** (this repo ships `v20.19.2`).
- **npm 10+** (installed with Node).

---

## Quick start

Open **three terminals** (or run the backend in the background):

```bash
# Terminal 1 — Backend API
cd api
./env/bin/python manage.py migrate  # applies migrations + seeds dev users
./env/bin/python manage.py runserver 0.0.0.0:8000

# Terminal 2 — Frontend dashboard
cd dashboard
npm run dev
```

Once both are running:

- Frontend (UI): **http://localhost:5173** — open, sign up or log in, manage tickets.
- Backend API: **http://localhost:8000/api** — (plus `/api/admin/` for the Django admin).
- Seeded logins: `user` / `user12345` (dashboard) and `admin` / `admin12345`
  (superuser, Django admin) — see §1.3 below.

---

# 1. Back-end (API)

## 1.1 Install dependencies

The shipped `env/` virtualenv already contains all packages. If you want a clean
environment from scratch:

```bash
cd api
python3 -m venv env              # 'python' on Windows
./env/bin/pip install --upgrade pip
./env/bin/pip install -r requirements.txt
```

`requirements.txt` pins the runtime packages:

```
Django==6.1.2
djangorestframework==3.18.3
django-cors-headers==4.9.0
django-filter==26.2
```

## 1.2 Apply database migrations

```bash
cd api
./env/bin/python manage.py migrate
```

This creates the `auth`, `contenttypes`, `sessions`, and `app` (Ticket) tables in
`db.sqlite3`. It also runs the user seeders automatically (see §1.3 below).
On first clone there are no migrations for `app`, so run `makemigrations`
first if `Ticket` tables are missing:

```bash
./env/bin/python manage.py makemigrations app
./env/bin/python manage.py migrate
```

## 1.3 Seed users (runs automatically with migrations)

`manage.py migrate` runs the `seed_users` seeder via a data migration in the
`authentication` app, so the Quick start and §1.2 above already create these two
development accounts:

| Username | Password | Role |
| --- | --- | --- |
| `user` | `user12345` | Regular user — log in to the dashboard |
| `admin` | `admin12345` | Superuser — Django admin at `/api/admin/` |

The seeder is idempotent: re-running it skips accounts that already exist and
never overwrites their passwords.

To run the seeders manually at any time:

```bash
cd api
./env/bin/python manage.py seed_users
```

To create a different superuser instead, use Django's built-in auth:

```bash
./env/bin/python manage.py createsuperuser
```

> The seeded credentials are for local development only — do not run the
> seeder against a production database.

## 1.4 Run the development server

```bash
cd api
./env/bin/python manage.py runserver 0.0.0.0:8000
```

The API is then reachable at **http://localhost:8000/api**.

- Django admin: **http://localhost:8000/admin/**
- DRF browsable API login: **http://localhost:8000/api-auth/**

## 1.5 Run the test suite

```bash
cd api
./env/bin/python manage.py test
```

Runs the full Django test runner, including the 24 ticket-service tests in
`app/tests/test_ticket_service.py` (plus any `authentication` app tests).

---

# 2. Front-end (Dashboard)

## 2.1 Install dependencies

```bash
cd dashboard
npm install
```

Dependencies are already installed here, so this is only needed after a clean
clone or after changing `package.json`.

## 2.2 Configure the API origin

The repo ships `.env` with:

```env
VITE_API_BASE_URL=/api
```

The value is a **relative path** — it makes the UI call the API through the Vite
dev proxy (`/api` → `http://localhost:8000`), avoiding CORS issues in development.
In production you can set this to the real API origin, e.g.
`https://api.example.com/api`.

## 2.3 Run the development server

```bash
cd dashboard
npm run dev
```

Open **http://localhost:5173**.

## 2.4 Build for production

```bash
cd dashboard
npm run build        # tsc -b && vite build
npm run preview      # locally preview the production build
```

---
## 2.5 (Optional) Run lint

```bash
cd dashboard
npm run lint
```

---

# How the two systems talk

```
Browser (http://localhost:5173)
   │  fetch('/api/...')
   ▼
Vite dev server (http://localhost:5173)
   │  proxy  /api  →  http://localhost:8000
   ▼
Django REST API (http://localhost:8000/api)
```

- The frontend calls **relative** `/api/...` paths, which the Vite dev server
  forwards to Django. No CORS headers or absolute URLs are needed during
  development.
- `dashboard/vite.config.ts` contains the dev proxy configuration.
- In production, build the frontend and serve `dashboard/dist` together with the
  API on the same origin (or set `VITE_API_BASE_URL` to the production API host).

---

# API reference

All endpoints (except auth) require authentication. The frontend stores the
session cookie and sends it automatically (`credentials: 'include'`), so most
requests work with no extra headers.

## Auth (public)

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register/` | `{ username, email, password, re_password }` | Create an account |
| `POST` | `/api/auth/login/` | `{ username, password }` | Log in (sets session cookie) |
| `GET` | `/api/auth/me/` | *(none)* | Current authenticated user |
| `POST` | `/api/auth/logout/` | *(none)* | Log out |

## Tickets (authenticated)

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `GET` | `/api/tickets/` | *(query)* `?status=&priority=&search=` | List tickets (supports `status`, `priority`, `search` filters) |
| `POST` | `/api/tickets/` | `{ title, description, priority, status }` | Create a ticket |
| `GET` | `/api/tickets/{id}/` | *(none)* | Retrieve a single ticket |
| `PATCH` | `/api/tickets/{id}/` | `{ title, description, priority }` | Update a ticket (title/description/priority) |
| `DELETE` | `/api/tickets/{id}/` | *(none)* | Delete a ticket (superuser only) |
| `PATCH` | `/api/tickets/{id}/status/` | `{ status: open \| in_progress \| closed }` | Update a ticket's status |
| `GET` | `/api/tickets/statistics/` | *(query)* `?status=&priority=&search=` | Get `{ total, open, in_progress, closed }` breakdown |

## Response shape

Success responses use a consistent envelope:

```json
{
  "success": true,
  "message": "Tickets retrieved successfully.",
  "data": { ... },
  "meta": { "count": 2, "next": "/api/tickets/?page=2", "previous": null }
}
```

- `data` always holds the payload.
- List endpoints add a `meta` object with pagination info (`count`, `next`, `previous`).

---

# Project structure

```
api/
├── api/                      # Django project config
│   ├── settings.py           # Settings (SQLite, CORS, DRF)
│   ├── urls.py               # Root URL routing
│   ├── wsgi.py
│   └── asgi.py
├── app/                      # Ticket app
│   ├── models.py             # Ticket model (Status / Priority enums)
│   ├── services/
│   │   └── ticket_service.py # Business logic (create, list, get, update, ...)
│   ├── repositories/
│   │   └── ticket_repository.py
│   ├── serializers.py        # DRF serializers
│   ├── views.py              # TicketViewSet
│   ├── permissions.py
│   ├── pagination.py
│   ├── utilitis/             # helpers (responses, sanitizers)
│   └── tests/
│       └── test_ticket_service.py
├── authentication/           # Auth views + seed_users command (runs on migrate)
├── manage.py
└── env/                      # Python virtualenv
dashboard/
├── src/
│   ├── services/             # API calls (auth, tickets, statistics)
│   ├── store/                # Redux state (auth, tickets, statistics)
│   ├── pages/                # Login, signup, dashboard
│   ├── components/           # MUI React components
│   └── theme/                # MUI theme
└── vite.config.ts            # Dev proxy (/api → :8000)
```

---

# Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| `dashboard/.env` | `VITE_API_BASE_URL` | Frontend → API origin. Leave as `/api` during development; set to a real API host in production. |

The backend uses SQLite and reads no environment variables in development — the
secret key, debug flag, and allowed hosts are configured directly in
`api/api/settings.py`. For production, move secrets and `DEBUG = False` into a
proper environment configuration or a `.env` file loaded by `python-dotenv`.
```