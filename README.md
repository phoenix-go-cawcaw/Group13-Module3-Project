# Hobby in a Box

Full-stack project with:
- Vue 3 + Vite frontend
- Node.js + Express backend
- MySQL database
- Simulated card payment flow (`POST /payments/process`)

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- MySQL server

## Install Dependencies

From the project root:

```sh
npm install
cd backend
npm install
cd ..
```

## Configure Environment Variables

Root `.env`:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=Hobby in a Box
```

Backend `.env` (copy from `backend/.env.example`):

```dotenv
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=hobbyinabox
PORT=5000
HOST=0.0.0.0
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d
```

## Create Database

```sql
CREATE DATABASE hobbyinabox;
```

Import:

```sh
mysql -u your_mysql_user -p hobbyinabox < backend/DB/Dump20260224.sql
```

## Run the App

Terminal 1 (backend):

```sh
cd backend
npm start
```

Terminal 2 (frontend):

```sh
npm run dev
```

Local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Verify

- `GET http://localhost:5000/` returns `HobbyInABox is running`
- `GET http://localhost:5000/test-db` confirms DB connection
- `GET http://localhost:5000/products` returns products

For full setup and troubleshooting details, see `PROJECT SETUP INSTRUCTIONS.md`.
