# PulseQuiz Client

A polished dark-mode frontend built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. This client delivers a premium quiz dashboard experience with secure authentication, student progress tracking, and admin management tools.

## What makes this UI stand out

- Elegant dark glassmorphism surfaces with neon accent highlights
- Responsive layout optimized for dashboards, quizzes, and admin workflows
- Smooth page transitions and modern CTA styles for login/register flows
- Consistent brand across login, dashboard, admin, and instructor views
- Clean student dashboard with filters, leaderboard, stats cards, and quiz cards

## Key features

- Secure login, registration, password recovery, and reset flows
- Role-based navigation for students and admin users
- Real-time analytics, leaderboard, and quiz browsing panels
- Fully themed dark interface with gradient accents and elevated surfaces

## Local development

Install dependencies and run the client:

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the frontend.

## Useful scripts

- `npm run dev`: Start the Next.js development server
- `npm run build`: Build production assets
- `npm run start`: Run the production server after build
- `npm run lint`: Run ESLint checks

## Code structure

- `src/app`: Next.js App Router pages and layouts
- `src/components`: shared UI components and guards
- `src/hooks`: authentication state hooks
- `src/lib`: site config and API client setup
- `src/services`: auth service abstraction
- `public`: static assets and icons

## Notes for interviewers

PulseQuiz is designed as a full-stack, production-ready assessment platform with:

- custom authentication flow and secure cookie handling
- admin controls for quizzes, questions, categories, and users
- student experience with performance metrics and search filters
- modern dark UI with a cohesive, polished theme

If you'd like, I can also show the matching backend architecture and API contract in the project root.
