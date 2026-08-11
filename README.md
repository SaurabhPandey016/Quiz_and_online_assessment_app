# PulseQuiz

PulseQuiz is an enterprise-ready assessment platform built with a clean separation between frontend, backend, and database layers. It delivers a modern dark dashboard UX for students and administrators while maintaining secure, scalable backend operations.

## Highlights

- **Role-based user experience** for students and admins
- **Secure authentication** with JWT/cookie session management
- **Full admin control panel** for users, categories, quizzes, and questions
- **Live analytics & performance dashboards** powered by Chart.js
- **Dark-mode glassmorphism UI** with gradient accents and responsive mobile behavior
- **API-driven architecture** with Express, Prisma, and a centralized Axios client

## Architecture Overview

### Frontend

- `client/` is a **Next.js 16 App Router** app using React 19 and Tailwind CSS v4.
- Global app state is managed through a custom `useAuth` hook and auth provider.
- Role guard components protect admin and student routes.
- Shared UI components include `SiteShell`, admin charts, and navigation cards.
- `lucide-react` is used for crisp iconography across the UI.

### Backend

- `server/` is built with **Express 5** and **Prisma ORM**.
- Routes are organized by domain: auth, admin, student, analytics, grading, sessions, and users.
- Input validation and error handling are centralized using Zod and custom middleware.
- Dynamic CORS support allows authenticated browser and API clients to connect safely.

### Data layer

- Prisma models power the relational schema for users, quizzes, questions, sessions, attempts, and grades.
- PostgreSQL is the production-ready database for transactional consistency.

## What makes this app impressive

- **Complete feature flow**: onboarding, quizzes, submission, grading, and analytics.
- **Professional UI polish** with a layered dark theme, responsive cards, and elevated surfaces.
- **Developer-friendly structure** that is easy to extend with CI/CD, Docker, or cloud deployment.
- **Security-first design** with auth guards and credentialed CORS support.

## Run the project locally

### 1. Backend

```bash
cd server
npm install
npm run dev
```

### 2. Frontend

```bash
cd ../client
npm install
npm run dev
```

### 3. Open

Visit `http://localhost:3000` for the frontend; the backend defaults to `http://localhost:10000`.

## Detailed feature summary

### Authentication

- Secure login and registration flows
- Password recovery and reset flows
- Role-based redirecting for admins and students
- Session preservation using secure cookies

### Student experience

- Quiz discovery with search and filter controls
- Performance summary cards and leaderboard panel
- Attempt history and dynamic scoring metrics
- Responsive quiz runner UI with progress controls

### Admin experience

- Admin hub with navigation cards and analytics banner
- Manage users, categories, quizzes, and questions from a single interface
- Dashboard analytics sections that scroll cleanly from navigation links
- Chart-driven insights for registrations, attempts, and quiz popularity

### Developer & interviewer notes

- The app uses a clear **client/server separation** and avoids monolithic design.
- Authentication is implemented securely while keeping the UI smooth and intuitive.
- The frontend uses a central Axios client for consistent backend requests.
- The backend is organized by route and controller, making business logic easy to maintain.
- The codebase is optimized for rapid expansion with more roles, features, or SaaS onboarding.

## Environment variables

Create a `.env` file in `server/` with:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pulsequiz
JWT_SECRET=supersecuresecret
PORT=10000
```

## Recommended next steps

- Add automated tests for frontend flows and backend endpoints
- Wire deployment to Vercel (frontend) and a managed database backend
- Add Docker support for local development parity
- Add more granular admin analytics, audit logs, and student progress reports
