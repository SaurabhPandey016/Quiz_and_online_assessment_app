# PulseQuiz

<div align="center">

![PulseQuiz Banner](https://img.shields.io/badge/PulseQuiz-Assessment%20Platform-0A0F1E?style=for-the-badge&logo=nextdotjs&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<p>
  <strong>Modern quiz, assessment, and admin management platform</strong>
</p>

<p>
  Built for students, educators, and administrators with secure authentication, role-aware access, quiz workflows, and a polished experience across desktop and mobile.
</p>

</div>

---

## Overview

PulseQuiz is a full-stack assessment platform designed to streamline quiz delivery, learning tracking, and administrative control in a single cohesive product. It combines a premium frontend experience with a robust backend for secure authentication, role management, quiz lifecycle handling, and data-driven insights.

The application is built to support:

- student quiz discovery and completion
- admin content management and user administration
- secure credential workflows including password reset
- scalable architecture with Prisma + PostgreSQL
- professional cross-platform UI for live deployment environments

---

## Executive summary

PulseQuiz is a modern, production-focused online assessment platform created for academic, training, and evaluation scenarios where both usability and operational control matter. It blends a premium desktop-first experience with a secure backend foundation and role-aware workflows that feel natural for both students and administrators.

This project is designed to reflect how real SaaS products are built: clear architecture, secure auth, robust validation, responsive UI, and deployment considerations that matter in production environments.

### Product impact

- reduces friction for students taking quizzes and tracking progress
- gives institutions or teams a clean administrative control layer
- enables secure role separation between learners and administrators
- supports scalable growth with a database-first architecture
- demonstrates strong engineering fundamentals for technical interviews and portfolio review

### At a glance

- full-stack product with a modern frontend and Node.js backend
- secure JWT + HTTP-only cookie authentication
- role-based access for admins and students
- modular backend with Prisma-powered persistence
- dashboard with user insights, metrics, and workflow clarity
- deployment-ready configuration for cloud hosting

---

## Product showcase

### Experience pillars

- User-centered flows: login, registration, password recovery, and quiz completion are designed to feel smooth and intuitive.
- Professional interface: dark premium UI, layered cards, content grouping, and polished layout decisions create an elevated product feel.
- Admin power: content and user management are structured to support real-world operational needs.
- Security-first architecture: session handling and reset token logic are designed with production safety in mind.
- Extensible platform: the app is structured so future enhancements like analytics, reporting, and additional assessment modes can be added without major rework.

### Feature matrix

| Area | What the app delivers | Business value |
| --- | --- | --- |
| Student flow | quiz discovery, attempt handling, dashboard visibility | smoother learning and assessment experience |
| Administration | user management, content management, role access | easier operational control |
| Security | encrypted passwords, token validation, cookies, reset flow | better trust and safer deployments |
| Data layer | Prisma + PostgreSQL model structure | reliability and scalability |
| Frontend | modern UI and responsive screens | stronger product perception and usability |
| Deployment | Vercel + Render setup | aligns with real-world SaaS hosting patterns |

---

## Why this project stands out

PulseQuiz is more than a quiz app. It is a production-ready platform with a clean architecture, strong security posture, and user-first experience.

### Core differentiators

- role-based access for students and admins
- secure HTTP-only cookie authentication
- modern Next.js app-router frontend with reusable UI structure
- centralized backend logic using controllers, routes, and validation schemas
- complete password recovery workflow with reset token handling
- admin-level account creation including additional admin user creation
- analytics-aware dashboard with score summaries and performance-focused UX
- deployment-ready configuration for Vercel + Render workflows

---

## Tech stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios for API communication
- Chart.js + react-chartjs-2 for analytics views
- Lucide icons for modern interface polish

### Backend

- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- Zod validation
- JWT authentication
- bcrypt password hashing
- cookie-based session management

### Infrastructure & deployment

- Vercel for frontend hosting
- Render for backend hosting
- PostgreSQL managed database
- environment-based config for secure deployment

---

## Architecture

```mermaid
flowchart LR
    U[Student / Admin User] --> FE[Next.js Frontend]
    FE --> API[Express API]
    API --> AUTH[JWT + HTTP-only Cookies]
    API --> DB[(PostgreSQL)]
    FE --> GUARD[Protected Routes & Role Guards]
    ADMIN[Admin Dashboard] --> CRUD[Users / Questions / Categories / Quizzes]
    STUDENT[Student Dashboard] --> QUIZ[Quiz Discovery, Attempt, Feedback]
```

---

## User experience

### Student experience

- sign up or log in securely
- browse available quizzes with search and filters
- open a quiz from the dashboard
- complete assessment flow with result processing
- review progress, recent quizzes, and ranking signals

### Admin experience

- manage categories and question banks
- create and organize quizzes
- review users and account roles
- create new admins from the admin management panel
- monitor system usage and performance-oriented data

### Authentication flow

- user registration validates form input
- login creates secure authenticated sessions
- protected endpoints enforce role and identity checks
- forgot-password workflow generates a reset token and exposes a reset URL for direct access
- reset-password validates and clears the token after successful password change

---

## Feature highlights

### Advanced frontend

- premium dark interface with layered cards and modern visual hierarchy
- responsive dashboard layout for student and admin workflows
- improved search UX with cleaner clear actions
- user-friendly navigation logic where quiz links appear only after login
- polished authentication screens for registration, login, reset, and recovery

### Secure backend services

- password hashing using bcrypt
- JWT issuance and validation with secure token lifecycle handling
- HTTP-only cookie-based session storage
- middleware-based route protection
- custom error handling and validation with structured responses

### Data model and logic

- Prisma schema-driven persistence
- relational database design for users, quizzes, questions, categories, and attempt data
- modular architecture with maintenance-friendly separation of concerns
- role-aware permissions and status handling for accounts

---

## Project structure

```text
Project-5/
├── client/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/                    # App Router pages and layouts
│   │   ├── components/             # Shared components and guards
│   │   ├── hooks/                  # Authentication context
│   │   ├── lib/                    # API client and helper config
│   │   ├── services/               # Auth/service abstraction
│   │   └── types/                  # Type definitions
│   ├── public/                     # Static assets
│   ├── package.json
│   └── next.config.ts
├── server/                         # Express.js backend API
│   ├── controllers/                # Auth, quiz, grading, user, analytics logic
│   ├── middleware/                 # Auth + validation + error handling
│   ├── routes/                     # Route definitions
│   ├── schemas/                    # Zod request validation
│   ├── prisma/                     # Prisma schema and seed scripts
│   ├── app.js                      # Application bootstrap
│   ├── package.json
│   └── .env.example (if configured)
├── README.md                       # Full project documentation
├── .gitignore
└── package.json                    # Optional workspace root metadata
```

---

## Local development setup

### 1) Install backend dependencies

```bash
cd server
npm install
```

### 2) Configure environment variables

Create a `.env` file inside the `server/` folder with values similar to:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pulsequiz
JWT_SECRET=your_super_secure_secret
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=http://localhost:3000
```

### 3) Initialize Prisma and sync the database

```bash
npx prisma generate
npx prisma db push
```

Optional seed:

```bash
node prisma/seed.js
```

### 4) Start the backend

```bash
npm run dev
```

### 5) Install frontend dependencies and run the app

```bash
cd ../client
npm install
npm run dev
```

### 6) Open the app

- Frontend: http://localhost:3000
- Backend API: http://localhost:10000/api/v1

---

## Production deployment setup

This project is designed to work smoothly in a Vercel + Render deployment pattern.

### Frontend environment

```bash
NEXT_PUBLIC_API_URL=https://your-render-backend-url/api/v1
```

### Backend environment

```bash
DATABASE_URL=postgresql://... 
JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=https://your-vercel-frontend-url
```

### Critical production auth configuration

- frontend uses cookies with `withCredentials: true`
- backend sets HTTP-only cookies for secure session management
- CORS is configured to allow the frontend domain
- cookie settings are aligned for secure cross-origin deployment

This ensures the login flow works reliably in production without unsafe browser storage patterns.

---

## Password reset workflow

The application includes a complete forgot/reset password flow.

### Flow

1. user enters email on the forgot-password page
2. server validates the account and creates a time-limited reset token
3. the app returns a reset link in the response for direct browser access
4. user opens the reset link and sets a new password
5. backend validates the reset token and updates the password securely
6. old token is cleared after successful completion

### Notes

- this is intentionally designed to display the reset link in the browser so it can be copied or opened directly
- it avoids depending on a production email service in this version while keeping the flow complete and usable

---

## Admin capabilities

Administrators can manage more than content alone. The platform includes account-level management features such as:

- creating user accounts
- creating additional admin accounts
- managing user status and access
- reviewing users in one centralized admin panel
- controlling role-based access throughout the app

---

## Security posture

PulseQuiz follows a solid production-minded security approach:

- bcrypt hashing for passwords
- JWT sessions with token expiration
- HTTP-only cookies instead of local storage for session transport
- protected route middleware for authenticated access
- input validation via Zod schemas
- reset tokens with expiration windows
- environment-driven secrets and deployment configuration

---

## Roadmap and future upgrades

The foundation is already strong, and the app is ready for the next phases of growth:

- automated test coverage for auth, user, and quiz logic
- email delivery integration with SendGrid, Resend, or Azure Communication Services
- richer analytics and reporting dashboards
- live leaderboards and advanced scoring analytics
- role-based reporting and academic performance insights
- Docker-based local setup and deployment standardization
- CI/CD workflow for automated deployment validation

---

## Why this app is portfolio-ready

PulseQuiz demonstrates practical full-stack engineering across the entire stack:

- modern frontend architecture
- secure backend design
- database modeling with Prisma
- deployment considerations for real-world hosting
- polished UX and application flow
- business-ready login, admin, and quiz workflows

This makes it a compelling project for interviews, code reviews, and senior-level technical discussions.

---

## Credits

Built as a modern assessment platform combining a premium user experience with a strong engineering foundation.

---

## Project status

Status: Production-ready structure with live deployment compatibility and secure cookie-based authentication.

Live deployment example:

- Frontend: https://pulsequiz-ten.vercel.app
- Backend: https://quiz-and-online-assessment-app.onrender.com/api/v1

---

## Final note

PulseQuiz is designed to balance usability, security, scalability, and maintainability. It is structured not just as a demo, but as a realistic platform that can evolve into a bigger product for education, assessments, training, or internal testing workflows.

If you are showcasing this project in an interview, portfolio, or technical review, it is positioned to leave a strong impression because it combines polished UX, robust architecture, and practical production thinking.
