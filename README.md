# Allo Inventory Management System

A full-stack Inventory Management and Reservation System built using Next.js, Prisma, PostgreSQL, and Tailwind CSS.

---

# Features

## Product Management
- Add new products
- View all products
- Display product details and pricing

## Warehouse Inventory
- Manage stock across multiple warehouses
- Track:
  - Available Stock
  - Reserved Stock
- Dynamic stock status:
  - In Stock
  - Low Stock
  - Out Of Stock

## Reservation System
- Create reservations
- Auto-expiry after 60 seconds
- Confirm reservation
- Cancel reservation
- Real-time countdown timer

## Inventory Synchronization
- Reserved stock updates automatically
- Expired reservations restore stock
- Cancelled reservations restore stock
- Confirmed reservations finalize inventory changes

## Dashboard
- Total products
- Total reservations
- Pending reservations
- Recent products
- Recent reservations

## Notifications
- Toast notifications for:
  - Reservation success
  - Reservation failure
  - Confirm success
  - Cancel success

---

# Tech Stack

## Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS

## Backend
- Next.js API Routes
- Prisma ORM

## Database
- PostgreSQL (Neon Database)

## Deployment
- Vercel

---

# Project Structure

```bash
src/
 ├── app/
 │   ├── dashboard/
 │   ├── products/
 │   ├── reservations/
 │   ├── create-reservation/
 │   ├── add-product/
 │   ├── update-inventory/
 │   └── api/
 │       ├── cron/
 │       ├── products/
 │       ├── warehouses/
 │       └── reservations/
 │
 ├── components/
 │   ├── Sidebar.tsx
 │   └── StatsCards.tsx
 │
 └── lib/
     └── prisma.ts
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/allo-inventory.git
```

## Navigate To Project

```bash
cd allo-inventory
```

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your_database_url"
```

---

# Prisma Setup

## Generate Prisma Client

```bash
npx prisma generate
```

## Push Database Schema

```bash
npx prisma db push
```

## Open Prisma Studio

```bash
npx prisma studio
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# Reservation Expiry Logic

Reservations remain in `PENDING` state for 60 seconds.

If not confirmed or cancelled within 60 seconds:
- status changes to `EXPIRED`
- inventory stock is restored automatically

Implemented using:
- `/api/cron` route
- periodic cleanup logic

---

# Reservation Status Flow

```text
PENDING
   ↓
CONFIRMED

PENDING
   ↓
CANCELLED

PENDING
   ↓
EXPIRED
```

---

# API Routes

## Products

```bash
GET    /api/products
POST   /api/products
DELETE /api/products/delete
```

## Warehouses

```bash
GET /api/warehouses
```

## Reservations

```bash
GET    /api/reservations
POST   /api/reservations
POST   /api/reservations/[id]/confirm
POST   /api/reservations/[id]/release
```

## Cron Cleanup

```bash
GET /api/cron
```

---

# Deployment

Deployed using Vercel.

## Production URL

```bash
Add your deployed Vercel URL here
```

---

# Future Improvements

- Authentication
- Role-based access
- Search and filtering
- Analytics dashboard
- Email notifications
- Pagination
- Redis queue for expiry jobs

---

# Author

Devadharshini S

Integrated M.Tech CSE (Business Analytics)  
VIT Chennai
