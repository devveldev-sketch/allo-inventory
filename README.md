# Allo Inventory Management System

A full-stack inventory reservation and warehouse management system built using Next.js, Prisma, Neon PostgreSQL, and TypeScript.

This project was developed as part of the Allo Engineering Take-Home Exercise.

---

# Live Demo

https://allo-inventory-self-delta.vercel.app/dashboard

---

# Features

- Multi-warehouse inventory management
- Product stock tracking
- Reservation-based checkout flow
- Reservation confirmation and cancellation
- Automatic reservation expiry handling
- Real-time stock restoration
- Dashboard analytics
- Prisma ORM integration
- Neon PostgreSQL database
- Fully deployed on Vercel

---

# Tech Stack

## Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

## Deployment
- Vercel

---

# Core Functionality

## Inventory Management
- Add products
- Track stock warehouse-wise
- Update inventory dynamically

## Reservation System
- Reserve stock temporarily during checkout
- Confirm reservation after successful payment
- Release reservation if cancelled
- Automatically expire reservations after timeout

## Concurrency Handling
The reservation logic prevents overselling by:
- Using Prisma transactional operations
- Checking available stock before reservation
- Maintaining separate `stock` and `reservedStock` values

---

# Reservation Expiry Mechanism

Expired reservations are automatically released using an API-based cleanup process.

The system:
1. Finds expired pending reservations
2. Restores reserved stock back to inventory
3. Updates reservation status to `EXPIRED`

This ensures inventory consistency and prevents permanently locked stock.

---

# Database Models

## Product
- Product information
- Pricing
- Description

## Warehouse
- Warehouse details

## Inventory
- Product-wise warehouse stock
- Reserved stock tracking

## Reservation
- Reservation status
- Expiry handling
- Quantity tracking

---

# API Endpoints

## Products
- `GET /api/products`

## Warehouses
- `GET /api/warehouses`

## Reservations
- `POST /api/reservations`
- `POST /api/reservations/[id]/confirm`
- `POST /api/reservations/[id]/release`

## Inventory
- `POST /api/inventory/update`

## Expiry Cleanup
- `GET /api/cron`

---

# Project Structure

```bash
app/
 ├── api/
 ├── dashboard/
 ├── inventory/
 ├── reservations/
 ├── add-product/
 └── update-inventory/

lib/
 └── prisma.ts

prisma/
 ├── schema.prisma
 └── seed.ts
```

---

# How to Run Locally

## 1. Clone Repository

```bash
git clone <your-repository-url>
cd allo-inventory
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
```

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Push Database Schema

```bash
npx prisma db push
```

---

## 6. Seed Database

```bash
npm run seed
```

---

## 7. Start Development Server

```bash
npm run dev
```

---

# Production Deployment

The application is deployed on:
- Vercel (Frontend + API)
- Neon PostgreSQL (Database)

---

# Challenges Faced

- Handling race conditions during reservation
- Managing Prisma deployment issues on Vercel
- Reservation expiry synchronization
- Ensuring stock consistency

---

# Future Improvements

- Redis-based distributed locking
- Idempotency support
- Real-time updates using WebSockets
- Better UI/UX enhancements
- Background workers for expiry cleanup
- Payment gateway integration
- Authentication & authorization

---

# Trade-offs

- Used API-triggered cleanup instead of dedicated background workers
- Focused more on correctness and deployment stability
- Simplified frontend UI for faster delivery

---

# Author

Devadharshini S

Integrated M.Tech CSE (Business Analytics)  
VIT Chennai
