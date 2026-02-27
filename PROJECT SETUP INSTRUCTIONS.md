# Hobby in a Box - Setup Guide

This guide matches the current project implementation:
- Vue 3 + Vite frontend
- Node.js + Express backend
- MySQL database
- Simulated card payment flow (no active PayFast integration)

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- MySQL server

## Project Structure

- Frontend config: `.env` (project root)
- Backend config: `backend/.env`
- DB dump: `backend/DB/Dump20260224.sql`

## 1. Install Dependencies

From project root:

```bash
npm install
cd backend
npm install
```

## 2. Configure Environment Variables

### Frontend (`.env` in project root)

```dotenv
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=Hobby in a Box
```

### Backend (`backend/.env`)

Create it from the example first:

```bash
cd backend
copy .env.example .env
cd ..
```

Then update values:

```dotenv
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=hobbyinabox

PORT=5000
HOST=0.0.0.0

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d

# Optional for custom origins:
# CORS_ORIGINS=http://localhost:5173
```

Note: backend code also accepts `DB_PASS` as a fallback, but `DB_PASSWORD` is preferred.

## 3. Create and Load Database

Create the database:

```sql
CREATE DATABASE hobbyinabox;
```

Import the SQL dump:

```bash
mysql -u your_mysql_user -p hobbyinabox < backend/DB/Dump20260224.sql
```

If `mysql` is not on PATH, import the same file using MySQL Workbench.

## 4. Run the App

Terminal 1 (backend):

```bash
cd backend
npm start
```

Backend: `http://localhost:5000`

Terminal 2 (frontend):

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## 5. Verify Backend Is Up

- `GET http://localhost:5000/` -> `HobbyInABox is running`
- `GET http://localhost:5000/test-db` -> DB connection check
- `GET http://localhost:5000/products` -> products response

## 6. Verify Checkout + Payment Flow

1. Open `http://localhost:5173`
2. Register/login
3. Add products to cart
4. Submit checkout details
5. Continue to review
6. Click `Confirm & Pay`
7. Fill card form in modal and submit
8. Confirm redirect to payment success page

Notes:
- Payment endpoint used: `POST /payments/process`
- Payment provider stored in DB: `simulated`
- `src/views/Payfast.vue` is not part of active flow (redirect page only)

## LAN Access (Optional)

For access from another device on your local network:

1. Find your machine IP (for example `192.168.1.20`)
2. Update root `.env`:

```dotenv
VITE_API_URL=http://192.168.1.20:5000
```

3. Restart backend + frontend
4. Open `http://192.168.1.20:5173` from the other device

## Troubleshooting

### Database connection fails

- Ensure MySQL is running
- Confirm `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `backend/.env`
- Confirm `hobbyinabox` exists and dump is imported

### Frontend cannot reach backend

- Confirm root `.env` has correct `VITE_API_URL`
- Confirm backend is running on `5000`
- Check browser network tab for failing request URL

### CORS blocked

- Localhost/LAN/ngrok patterns are allowed by default in `backend/server.js`
- Add custom origin to `CORS_ORIGINS` in `backend/.env` if needed

## Key Files

- Checkout: `src/views/Checkout.vue`
- Review + payment modal: `src/views/Review.vue`
- Payment controller: `backend/controllers/paymentController.js`
- Server/CORS: `backend/server.js`
- DB connection: `backend/config/db.js`
- DB dump: `backend/DB/Dump20260224.sql`
