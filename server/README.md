# PulseQuiz Server

This folder contains the Express backend for PulseQuiz.

## What is included

- `app.js` — Express app entry point and route loader
- `config/prisma.js` — Prisma client configuration
- `routes/` — Route definitions for auth, quizzes, questions, analytics, student actions, sessions, grading, and users
- `controllers/` — Request handlers implementing business logic for each route group
- `services/` — Shared service logic such as authentication and authorization helpers
- `middleware/` — Error handling, input validation, and auth middleware
- `prisma/schema.prisma` — Data model for users, quizzes, questions, sessions, grading records, and relations

## Run locally

```bash
cd server
npm install
npm run dev
```

The backend starts on `http://localhost:10000` unless `PORT` is overridden.

## API Surface

The server is mounted under the following main paths:

- `/api/v1/auth` — authentication and password recovery
- `/api/v1/admin` — admin quiz management and analytics
- `/api/v1/admin/users` — user management
- `/api/v1/admin/questions` — question management
- `/api/v1/admin/analytics` — dashboard analytics
- `/api/v1/student` — student quiz browsing and categories
- `/api/v1/student/attempts` — quiz sessions and history
- `/api/v1/student/grading` — grading endpoints

## Environment

Create a `.env` file with the values required for your database and JWT secrets. Example entries include:

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/pulsequiz
JWT_SECRET=supersecuresecret
PORT=10000
```

## Notes for developers

- CORS is configured to dynamically echo back the request origin while allowing credentials.
- Secure cookies and cookie parsing are enabled for session management.
- Prisma generates the client after install via `postinstall`.
