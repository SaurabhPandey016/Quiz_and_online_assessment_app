# PulseQuiz Server

The backend for PulseQuiz, responsible for authentication, quiz content, admin operations, analytics, grading, and student session management.

## Why this backend matters

- Secures the application with token-based authentication and cookie support.
- Separates business logic into maintainable controllers and route modules.
- Supports admin operations, student workflows, and analytics data in a single API layer.
- Uses Prisma ORM for database safety, migrations, and type-safe queries.

## Folder layout

- `app.js` — Express app bootstrapping and route registration
- `config/prisma.js` — Prisma database client initialization
- `routes/` — HTTP routes for auth, admin, student, sessions, grading, analytics, and users
- `controllers/` — business logic handlers for each route group
- `services/` — shared helpers and auth utilities
- `middleware/` — custom error handling and request validation
- `prisma/schema.prisma` — data model definitions

## Primary API groups

- `/api/v1/auth`
  - login, register, refresh, forgot-password, reset-password
- `/api/v1/admin`
  - quiz creation, publication, analytics dashboard
- `/api/v1/admin/users`
  - user listing and admin actions
- `/api/v1/admin/questions`
  - create and manage quiz questions
- `/api/v1/admin/analytics`
  - aggregated dashboard metrics for admin reporting
- `/api/v1/student`
  - quiz browsing and category access
- `/api/v1/student/attempts`
  - attempt history, quiz session tracking
- `/api/v1/student/grading`
  - grading and result calculation endpoints

## Running locally

```bash
cd server
npm install
npm run dev
```

The backend listens on `http://localhost:10000` by default.

## Environment variables

Create a `.env` file in `server/` with the following:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pulsequiz
JWT_SECRET=supersecuresecret
PORT=10000
```

## Important backend patterns

- **Dynamic CORS** allows browser clients while preserving credential support.
- **Central error middleware** ensures consistent JSON error responses.
- **Zod validation** is used to protect incoming payloads.
- **Prisma client** is generated automatically after install with `postinstall`.

## Notes for interviewers

This backend is designed for real production use:

- Cleanly separated route and controller layers
- Scalable admin analytics and content operations
- Secure API patterns with token/cookie combos
- Easy extension for new roles, notifications, or reporting features

## Extendability

Recommended follow-up enhancements:

- Add request logging and audit trails
- Add automated endpoint tests with Jest or Mocha
- Add database seeding for sample data
- Add Docker support for local and deployment parity
