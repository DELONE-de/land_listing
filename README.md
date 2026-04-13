# LandApp

A land listing platform with a Next.js frontend and Express/Prisma backend.

---

## Prerequisites

- Node.js 18+
- PostgreSQL
- Cloudinary account (for image uploads)

---

## Backend

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/landapp
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
ADMIN_EMAIL=admin@landapp.com
ADMIN_PASSWORD=admin123
```

### 3. Set up the database

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # push schema to database
```

### 4. Create an admin user

```bash
npm run admin:create
```

### 5. (Optional) Seed listings

```bash
npm run seed:listings
```

### 6. Run the server

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Backend runs on `http://localhost:5000`.

---

## Frontend

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Run the dev server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
landapp/
├── backend/        # Express API + Prisma ORM
│   ├── prisma/     # Database schema
│   └── src/        # Routes, controllers, services
└── frontend/       # Next.js 14 app
    ├── app/        # App router pages
    ├── components/ # UI components
    ├── hooks/      # Custom React hooks
    └── lib/        # API client & utilities
```
