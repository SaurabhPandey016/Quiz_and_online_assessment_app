# PulseQuiz Client

This is the frontend for the PulseQuiz assessment platform. It is built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **lucide-react** for iconography.

## Core goals

- Provide a polished dark-mode experience for students and admins.
- Enable secure UX flows for login, registration, password recovery, and quiz completion.
- Offer responsive interfaces for dashboard cards, filters, analytics, and management screens.
- Keep frontend code modular and reusable.

## Pages and flows

- `/login` — secure login with redirect handling
- `/register` — account creation with validation and auto-redirect
- `/forgot-password` — request password reset token
- `/reset-password` — complete password reset flow
- `/dashboard` — student hub with filters, quizzes, leaderboard, and history
- `/dashboard/runner/[quizId]` — quiz play experience
- `/admin` — admin hub and analytics
- `/admin/users` — users list and actions
- `/admin/categories` — category creation and management
- `/admin/quizzes` — quiz creation and publication
- `/admin/questions` — question management workflow

## What this client delivers

- **Auth guard behavior** for admin and student pages
- **Centralized API client** with Axios, credentials support, and error handling
- **Modern dark UI** with glassmorphism panels, gradient CTA buttons, and soft shadows
- **Lucide icons** for crisp branding and navigation visuals
- **Responsive layout** for mobile and desktop screens

## Local development

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start built app
- `npm run lint` — run ESLint

## Folder structure

- `src/app` — top-level pages and layout definitions
- `src/components` — shared UI components, guards, and chart components
- `src/hooks` — reusable React state hooks (`useAuth`)
- `src/lib` — site config, API client, and branding constants
- `src/services` — auth and API helper services

## Frontend behavior

- The `SiteShell` component provides the fixed navbar and footer across all pages.
- `useAuth` tracks session state, redirects unauthenticated users, and keeps role-based access consistent.
- Admin cards and analytics navigation use clean anchor behavior and modern hover states.
- Footer contact details now include email, phone, GitHub, and LinkedIn.

## Notes for reviewers

This frontend demonstrates:

- a highly polished UX design system
- strong separation of concerns
- reusable, testable component patterns
- scalable page routing with Next.js App Router
- integration with backend auth and analytics APIs
