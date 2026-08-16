# PulseQuiz Server

<div align="center">

![PulseQuiz API](https://img.shields.io/badge/Backend-Express%20%2B%20Prisma-000000?style=for-the-badge&logo=express&logoColor=white)

[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<p>
  <strong>Secure API layer for quiz management, user auth, grading, and admin operations</strong>
</p>

<p>
  The backend powers the full PulseQuiz platform with route protection, validation, database access, and production-oriented session handling.
</p>

</div>

---

## Overview

The PulseQuiz server is the backend engine of the platform. It handles authentication, user and role management, quiz logic, grade evaluation, analytics, and admin operations through a structured Express API.

This layer is designed not only to support the current app, but to scale cleanly for more advanced features such as reporting, audits, role-based permissions, and expanded assessment workflows.

---

## Core responsibilities

- authentication and session management
- user registration and account lifecycle
- password reset and token verification
- category, question, and quiz content management
- grading and evaluation flows
- admin analytics and summary endpoints
- secure request validation and centralized error handling

---

## Why this backend matters

- secures the application with token-based authentication and cookie support
- separates business logic into maintainable controllers and route modules
- supports admin operations, student workflows, and analytics through a single API layer
- uses Prisma ORM for database safety, query structure, and easier scaling
- keeps validation and safety checks centralized for consistent API behavior

---

## Architecture summary

```mermaid
flowchart TD
    FE[Frontend Client] --> API[Express API]
    API --> AUTH[Auth Middleware]
    API --> CTRL[Controllers]
    CTRL --> SERVICE[Services / Business Logic]
    SERVICE --> PRISMA[Prisma ORM]
    PRISMA --> DB[(PostgreSQL)]
    API --> VALIDATE[Zod Validation]
    API --> ERR[Error Middleware]
```

---

## Primary API groups

### Authentication

- `/api/v1/auth/register`
- `/api/v1/auth/login`
- `/api/v1/auth/logout`
- `/api/v1/auth/forgot-password`
- `/api/v1/auth/reset-password`

### Admin features

- `/api/v1/admin`
- `/api/v1/admin/users`
- `/api/v1/admin/questions`
- `/api/v1/admin/categories`
- `/api/v1/admin/quizzes`
- `/api/v1/admin/analytics`

### Student features

- `/api/v1/student`
- `/api/v1/student/attempts`
- `/api/v1/student/grading`
- `/api/v1/student/results`

---

## Folder structure

```text
server/
├── app.js                        # Express app bootstrap
├── config/
│   └── prisma.js                 # Prisma client setup
├── controllers/                  # Request handlers by domain
├── middleware/                   # auth, validation, and error handling
├── routes/                       # endpoint registration
├── schemas/                      # Zod validation schemas
├── services/                     # reusable logic and helpers
├── prisma/
│   ├── schema.prisma             # database schema
│   └── seed.js                  # seed script
├── generated/                    # generated Prisma client artifacts
├── package.json
├── README.md
└── .env
```

---

## Local development

```bash
cd server
npm install
npm run dev
```

Default backend URL:

```bash
http://localhost:10000
```

---

## Environment variables

Create a `.env` file in the `server` folder with values similar to:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pulsequiz
JWT_SECRET=supersecuresecret
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=http://localhost:3000
```

---

## Security and reliability patterns

### Authentication

- JWT-based access control
- secure session handling through cookies
- role-oriented route restrictions
- password hashing with bcrypt

### Validation and safety

- Zod validation for request payloads
- consistent custom error structure
- middleware-controlled access checks
- token expiration and reset flow verification

### Database layer

- Prisma-managed schema and queries
- relational design for users, quizzes, categories, questions, and results
- easier extension for future data model growth

---

## Production-readiness notes

This backend is designed to be used in a real deployment environment with separate frontend and API hosting.

### Production-friendly practices

- dynamic CORS handling
- credential-aware cross-origin support
- env-based config and secrets
- secure cookie configuration for frontend sessions
- modular code structure that is easier to maintain and extend

---

## Why this backend is strong for interviews

This API is not just a simple CRUD layer. It demonstrates:

- separation of concerns across routes, middleware, and controllers
- secure application design principles
- realistic workflow modeling for assessments and training platforms
- a strong data layer with Prisma and PostgreSQL
- scalable organization suitable for real-world product growth

That combination makes the backend feel much more like a product-ready SaaS API instead of a toy project.

---

## Extendability roadmap

Recommended next enhancements:

- automated API testing with Jest or Vitest
- audit logging for admin actions
- request tracing and observability
- email delivery integration for password reset and notifications
- Docker support for consistent local and production environments
- stronger analytics and reporting endpoints for progress monitoring

---

## Final note

The PulseQuiz server is built to support both immediate product functionality and long-term growth. It balances correctness, maintainability, and security while staying structured enough for real project evolution.

This is the kind of backend that signals strong engineering judgment and practical software design thinking.
