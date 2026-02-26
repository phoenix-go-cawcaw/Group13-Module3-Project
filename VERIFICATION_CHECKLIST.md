# Project Verification Checklist

Use this checklist after setup to verify the current project works as expected.

## Environment and Install

- [ ] Root dependencies installed: `npm install`
- [ ] Backend dependencies installed: `cd backend && npm install`
- [ ] Frontend env file exists at project root `.env`
- [ ] Backend env file exists at `backend/.env`
- [ ] Required backend env values set:
  - [ ] `DB_HOST`
  - [ ] `DB_USER`
  - [ ] `DB_PASSWORD`
  - [ ] `DB_NAME`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
- [ ] SQL dump imported: `backend/DB/Dump20260224.sql`

## Server Startup

- [ ] Backend starts: `cd backend && npm start`
- [ ] Frontend starts: `npm run dev`
- [ ] Backend health route works: `GET /` -> `HobbyInABox is running`
- [ ] Database health route works: `GET /test-db`

## API Verification

- [ ] `GET /products` returns product data
- [ ] `POST /auth/register` creates account
- [ ] `POST /auth/login` returns `token` and `user`
- [ ] `POST /checkout` creates checkout row and returns `checkout_id`
- [ ] `POST /payments/process` accepts valid payment payload and returns:
  - [ ] `success: true`
  - [ ] `transactionId`

## Frontend Flow Verification

- [ ] Open app at `http://localhost:5173`
- [ ] Login/registration works
- [ ] Cart loads and updates
- [ ] Checkout form submits
- [ ] Review page opens with checkout data
- [ ] Payment modal opens from `Confirm & Pay`
- [ ] Payment success page displays after successful payment

## Database Verification

- [ ] `checkout` table receives new row after checkout submit
- [ ] `payments` table receives new row after payment submit
- [ ] Checkout status updates to `completed` after successful payment

## Current Payment Mode Confirmation

- [ ] Payment controller logs indicate simulated mode
- [ ] No PayFast credentials are required for current flow
- [ ] `src/views/Payfast.vue` is not used in checkout flow

## Optional LAN Verification

- [ ] Root `.env` updated with LAN API URL (if needed)
- [ ] App accessible from second device on same network

## Known Good Local Baseline

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- DB: local MySQL
- Payment: simulated (`/payments/process`)
