# PulseQuiz

PulseQuiz is a modern, full-stack assessment platform built to help students take quizzes, track progress, and receive structured feedback while giving administrators tools to manage users, categories, and question banks from a single dashboard.

It follows a clean separation between frontend, backend, and database layers, with a polished dark interface, secure authentication, and a role-aware app flow for both students and admins.

## App overview

PulseQuiz combines:

- a student-facing dashboard with search, filters, leaderboard insights, and attempt history
- an admin control center for managing users, quiz content, categories, and question data
- a secure auth layer with login, registration, password reset, and role-based access control
- a relational database-powered backend using Prisma and PostgreSQL
- responsive UI components built in Next.js with a premium glassmorphism theme

## Why this project stands out

- Role-based app flow for students and admins
- JWT-based authentication with HTTP-only cookies and protected routes
- Deep dashboard analytics with charts and score summaries
- Modular structure with controller/service/route separation in the backend
- Clean Next.js App Router architecture with reusable client-side guards
- Strong UX polish, including search input refinement, results cards, and responsive layout tuning

## High-level architecture

```mermaid
flowchart LR
  User[Student or Admin] --> FE[Next.js Frontend]
  FE --> API[Express API]
  API --> DB[(PostgreSQL)]
  API --> Auth[JWT Auth + Password Reset]
  FE --> Guard[Role Guards]
  Admin[Admin UI] --> CRUD[User / Quiz / Category / Question Management]
  Student[Student UI] --> Quiz[Quiz Discovery + Attempt Runner]
```

## Project structure

```text
Project-5/
├── client/                 # Next.js frontend
│   ├── src/app/            # App Router pages and layouts
│   ├── src/components/     # Shared UI and guards
│   ├── src/hooks/          # Auth state
│   ├── src/lib/            # API client and shared config
│   └── package.json
├── server/                 # Express API
│   ├── controllers/        # Auth, admin, student, analytics logic
│   ├── routes/             # API endpoints
│   ├── schemas/            # Zod validation schemas
│   ├── prisma/             # Prisma schema and seed data
│   └── package.json
├── README.md               # App overview and setup guide
└── package.json            # Optional workspace root config
```

## Key user flows

### Student flow

- sign up or log in
- browse quizzes with search and category filters
- launch a quiz from the dashboard
- submit answers and review results
- check progress and leaderboard insights

### Admin flow

- access the admin dashboard
- create or manage categories and quizzes
- add and review users including admin accounts
- enable/disable user access or remove stale accounts
- monitor performance metrics and content activity

### Authentication flow

- login and registration validate user input with Zod
- protected routes use middleware to restrict unauthorized access
- forgot password creates a secure reset token and returns a reset link
- reset password validates the token, hashes the new password, and clears the token after successful reset

## Detailed feature summary

### Frontend

- Next.js 16 App Router with React 19
- Dark visual system with layered cards, gradients, and modern spacing
- Search experience with accessible clear button and filter controls
- Student dashboards with summary cards, recent history, and rankings
- Admin user management with creation and account moderation actions

### Backend

- Express 5 server with route-based organization
- Prisma ORM integration for PostgreSQL models
- Centralized validation with Zod schemas
- JWT cookie-based session handling
- Custom error middleware for consistent API responses

### Security

- password hashing with bcrypt
- protected admin endpoints and student route guards
- reset tokens stored as hashed values and expired automatically
- secure cookie configuration for authenticated sessions

## Local setup

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a `.env` file inside the `server/` directory:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pulsequiz
JWT_SECRET=supersecuresecret
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=http://localhost:3000
```

### 3. Generate Prisma client and initialize the database

```bash
npx prisma generate
npx prisma db push
```

If you want seed data, run:

```bash
node prisma/seed.js
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies and run the app

```bash
cd ../client
npm install
npm run dev
```

### 6. Open the app

- Frontend: http://localhost:3000
- Backend API: http://localhost:10000/api/v1

## Password reset flow

The application supports a complete reset flow:

1. user visits the forgot-password screen
2. app submits the email to `/api/v1/auth/forgot-password`
3. backend verifies the account and creates a time-limited reset token
4. frontend receives a reset URL in the response and opens it in the browser
5. user sets a new password at `/reset-password?token=...`
6. backend verifies the token, hashes the new password, and clears the reset token

> For local development, `FRONTEND_URL` should be set correctly so the reset link opens on the frontend route.

## Admin upgrade notes

Admins can now:

- create standard users or additional admin accounts from the admin user management screen
- enable or disable user accounts
- review the current role and account status in one place

## Recommended next steps

- add automated tests for auth and admin routes
- add email delivery integration with SendGrid or Azure Communication Services
- containerize the app with Docker for one-command setup
- extend analytics with richer charts, audit logs, and progress tracking
- prepare deployment pipelines for Vercel and a managed PostgreSQL service

## Product intent

PulseQuiz is designed as a scalable, production-ready assessment platform that balances usability, security, and operational control. It is structured to support more advanced features like live exams, role-specific reporting, and enterprise-grade deployment workflows as the app grows.
