# Smart Leads Dashboard (MERN + Strict TypeScript)

An enterprise-grade, production-ready Lead Management Dashboard built using the MERN stack with strict TypeScript compilation verification. The system features a responsive Tailwind CSS UI, dark mode support, token-based authentication with role-based access control (RBAC), advanced lead filtering with query serialization, and direct-to-browser filtered CSV exports.

---

## 🏗 Architecture Overview

The project is structured under a feature-based clean architecture layout:
- **Backend (Express + Node + Mongoose)**: Decoupled into `models`, `services`, `controllers`, `middleware`, `validators` (Zod), and `routes`.
- **Frontend (Vite + React + Tailwind CSS v4)**: Utilizes custom URL state synchronizers (`useFilter`, `usePagination`), service layers, custom loaders, and visual dark/light theme providers.

---

## ⚙️ Environment Configuration

Both local development and Docker containers read configurations from `.env` files.
A comprehensive list of options is provided in `backend/.env.example`:

| Key | Example Value | Description |
|---|---|---|
| `PORT` | `5005` | Backend port number |
| `NODE_ENV` | `development` | Runtime environment mode |
| `MONGODB_URI` | `mongodb://localhost:27017/smart_leads_db` | Connection string for MongoDB |
| `JWT_SECRET` | `super_secret_key_change_me_in_production` | HS256 secret key for signing tokens |
| `JWT_EXPIRES_IN` | `7d` | Access token duration |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin (mapped dynamically) |

---

## 🚀 Running the Project

### Option A: Using Docker Compose (Recommended)
Spin up the complete ecosystem (MongoDB database daemon, Express backend server, and Nginx frontend client) with one command from the project root:

```bash
docker-compose up --build
```

- **Frontend client**: Available at `http://localhost` (port 80)
- **Backend server**: Available at `http://localhost:5005`
- **MongoDB Instance**: Port `27017`

---

### Option B: Local Development
Ensure you have a running MongoDB instance locally (`mongodb://127.0.0.1:27017`), then proceed:

#### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The API server will listen on `http://localhost:5005`.

#### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The client Vite dev server will run at `http://localhost:5173`.

---

## 📡 API Endpoints & Schema Specification

All Express responses wrap database operations inside a standard global payload layout:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { ... }
}
```

### 🔒 Authentication Enpoints

#### 1. Register User
- **Route**: `POST /api/auth/register`
- **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
- **Response**: Triggers registration. Passwords must meet secure guidelines (8+ characters, uppercase, digit, symbol). Requires login step.

#### 2. Login User
- **Route**: `POST /api/auth/login`
- **Payload**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: Returns standard JWT access token inside JSON payload alongside user metadata.

#### 3. Log Out
- **Route**: `POST /api/auth/logout`

#### 4. Current User Session
- **Route**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

---

### 📋 Leads Management Endpoints (JWT Required)

#### 1. Create Lead
- **Route**: `POST /api/leads`
- **Payload**:
  ```json
  {
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "status": "new",
    "source": "website",
    "notes": "Interested in enterprise offerings"
  }
  ```

#### 2. List Leads (with Filter & Paginate)
- **Route**: `GET /api/leads`
- **Queries**:
  - `status` (`new` | `contacted` | `qualified` | `lost`)
  - `source` (`website` | `instagram` | `referral`)
  - `search` (case-insensitive substring match on `name` or `email`)
  - `sortBy` (`latest` | `oldest`)
  - `page` (default `1`)
  - `limit` (default `10`)

#### 3. Export Filtered Leads to CSV
- **Route**: `POST /api/leads/export/csv`
- **Queries**: Mapped similarly to filters list query above.
- **Output**: Direct file stream (`text/csv`) with formatted headers.

#### 4. Delete Lead (Admin Only)
- **Route**: `DELETE /api/leads/:id`
