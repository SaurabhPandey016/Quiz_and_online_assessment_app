# PulseQuiz Client

<div align="center">

![PulseQuiz Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<p>
  <strong>Modern, role-aware frontend for the PulseQuiz assessment platform</strong>
</p>

<p>
  Designed to deliver a premium experience for students, administrators, and secure authentication workflows across a responsive application.
</p>

</div>

---

## Overview

The PulseQuiz client is the user-facing layer of the platform. It is built with Next.js App Router and provides the interface for authentication, dashboard navigation, quiz participation, admin management, and analytics workflows.

The frontend is intentionally designed with a modern, dark premium aesthetic and clean component structure to make the product feel sharp, credible, and production-ready.

---

## Product goals

- provide a premium experience for quiz-taking and admin operations
- support secure authentication and protected routes
- make dashboard data and actions easy to scan and use
- keep UI structure reusable and scalable for future features
- align with the backend API with clean, credential-aware requests

---

## Key user journeys

### Student portal

- sign in or register
- browse available quizzes
- search and filter content
- launch a quiz from the dashboard
- complete the assessment flow and review results

### Admin portal

- access admin dashboard and analytics screens
- manage categories and question banks
- create and structure quizzes
- review user data and role access
- create additional admin accounts from the admin management page

### Auth and recovery flows

- login and registration screens
- forgot-password workflow
- reset-password screen with token validation
- protected route guards based on role and auth state

---

## Core frontend capabilities

### Interface design

- premium dark UI with layered cards and modern spacing systems
- responsive layout for mobile and large desktop screens
- clean navigation patterns and user-friendly actions
- feature polish such as refined search clear behavior and visual hierarchy

### Architecture

- App Router-based page organization
- reusable components and guards
- centralized HTTP client for API calls
- role-aware UX for admin and student flows
- clean separation between UI, hooks, services, and config

### Client-side logic

- auth session tracking through a dedicated hook
- redirect handling for protected screens
- cookie-aware requests for secure backend communication
- shared config for site metadata and API endpoints

---

## Pages and routes

- `/login` — user authentication
- `/register` — account creation
- `/forgot-password` — password reset request
- `/reset-password` — final password reset
- `/dashboard` — student dashboard
- `/dashboard/runner/[quizId]` — quiz execution experience
- `/admin` — admin dashboard overview
- `/admin/users` — user management
- `/admin/categories` — category management
- `/admin/quizzes` — quiz management
- `/admin/questions` — question management

---

## Folder structure

```text
client/
├── src/
│   ├── app/                 # application pages and layouts
│   ├── components/          # shared UI, site shell, charts, guards
│   ├── hooks/               # auth and shared client state
│   ├── lib/                 # API client and site config
│   ├── services/            # auth and data helpers
│   ├── types/               # TypeScript interfaces
│   └── ...
├── public/                  # static assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── README.md
└── next-env.d.ts
```

---

## Local development

```bash
cd client
npm install
npm run dev
```

Frontend URL:

```bash
http://localhost:3000
```

---

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Script purpose

- `npm run dev` — run the client in development mode
- `npm run build` — create a production build
- `npm run start` — start the production build
- `npm run lint` — validate code quality and consistency

---

## Production considerations

The frontend is designed for secure deployment with a backend API hosted separately. The client is configured to use credential-aware requests and works smoothly in Vercel + Render deployments.

### Important behavior

- API calls use cookies for session interaction when needed
- protected endpoints redirect unauthenticated users properly
- admin and student routes use role-aware gating
- frontend settings are environment dependent for live deployment

---

## Why this frontend stands out

This client demonstrates more than a simple landing page or demo UI. It shows:

- modern framework usage in production-style architecture
- robust auth flow integration
- component-level thinking and reusable design patterns
- polished UX across dashboards and management screens
- deployment readiness for a realistic SaaS-style application

This makes it a strong frontend project for interviews, portfolio review, and technical assessment scenarios.
