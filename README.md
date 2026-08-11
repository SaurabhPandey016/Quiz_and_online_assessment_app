# PulseQuiz

A premium full-stack assessment platform with a polished dark UI and modern admin controls.

## Project Overview

PulseQuiz is built as a student-facing quiz app with a secure admin dashboard, supporting:

- user authentication and role-based access
- quiz browsing, filtering, and attempts
- admin management for users, categories, quizzes, and questions
- analytics visualizations and leaderboard insights
- a dark theme with neon accents and elevated glass-style surfaces

## Repository Structure

- `client/` — Next.js 16 frontend using App Router, Tailwind CSS v4, React 19, and client-side auth state.
- `server/` — Express 5 backend with Prisma ORM, PostgreSQL, JWT auth, secure cookies, Zod validation, and API routing.

## Getting Started

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

The server listens on `http://localhost:10000` by default.

### 2. Start the frontend

```bash
cd ../client
npm install
npm run dev
```

Open `http://localhost:3000` to access the application.

## What interviewers should notice

- Clean separation between frontend and backend responsibilities
- Secure authentication flow with refresh tokens and session handling
- Admin and student role protections at the UI and routing level
- Polished dark theme with consistent brand identity
- Responsive dashboard UX and reusable component patterns

## Notes

This repo ships with a complete frontend and backend scaffold that is ready for additional enhancements like CI/CD, Docker, or cloud deployment.
