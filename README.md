
# NutriFlow — Frontend

NutriFlow is a **personalized nutrition and meal delivery web application**. It connects users with certified dietitians who create custom monthly meal plans based on individual health data. Fresh meals are then prepared by caterers and delivered daily to the user's door.

This repository contains the **React frontend** of the NutriFlow platform.

---

## Table of Contents

- [What is NutriFlow?](#what-is-nutriflow)
- [Who Uses It?](#who-uses-it)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [What is React?](#what-is-react)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment & API](#environment--api)
- [Internationalization](#internationalization)

---

## What is NutriFlow?

NutriFlow is a full-stack platform with three types of users:

| Role | What They Do |
|------|-------------|
| **User** | Registers, submits health data, receives a personalized monthly menu, tracks daily deliveries |
| **Dietitian** | Reviews patient health profiles, creates and manages monthly meal menus |
| **Caterer** | Views daily meal orders, prepares and delivers meals |
| **Admin** | Manages all users, dietitians, caterers, menus, payments, and system logs |

The typical user flow:
1. A user registers and verifies their email via OTP.
2. They submit a health profile (height, weight, goals, dietary restrictions, delivery address).
3. A certified dietitian reviews the profile and creates a personalized monthly menu (within 24–48 hours).
4. The user subscribes via a payment (Stripe).
5. A caterer prepares and delivers fresh meals daily.
6. The user tracks deliveries and manages their subscription from their dashboard.

---

## Who Uses It?

- **Busy professionals** who don't have time to plan meals
- **Health-conscious individuals** working toward fitness or wellness goals
- **People with special dietary needs** (allergies, medical requirements, specific diets)

---

## Key Features

- **Multi-role authentication** — JWT-based login with Google OAuth2 support, OTP email verification, forgot/reset password
- **Health data submission** — multi-step form (metrics, goals, restrictions, address, file uploads)
- **Dietitian dashboard** — patient list, patient profiles, drag-and-drop monthly menu editor
- **Caterer panel** — daily order view, delivery stats
- **Admin panel** — full control over users, dietitians, caterers, menus, payments, and audit logs
- **Stripe payment integration** — subscription checkout with success/cancel pages
- **Multilingual UI** — English, Azerbaijani, Russian (via i18next)
- **Responsive design** — mobile and desktop friendly
- **Animated landing page** — built with Framer Motion

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite 6** | Build tool and dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui + Radix UI** | Accessible UI components |
| **Axios** | HTTP client with interceptors for auth token refresh |
| **React Hook Form** | Form state management |
| **Recharts** | Charts and data visualization |
| **Framer Motion** | Page and element animations |
| **i18next + react-i18next** | Internationalization (EN / AZ / RU) |
| **Sonner** | Toast notifications |
| **Stripe** | Payment processing |
| **React DnD** | Drag-and-drop in the menu editor |

---

## Project Structure

```
nutriflow-front/
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── package.json
└── src/
    ├── main.tsx                # React app entry point
    ├── assets/imgs/            # Static images and SVGs
    ├── i18n/
    │   ├── index.ts            # i18next setup
    │   └── locales/
    │       ├── en.ts           # English translations
    │       ├── az.ts           # Azerbaijani translations
    │       └── ru.ts           # Russian translations
    ├── styles/                 # Global CSS and Tailwind config
    └── app/
        ├── App.tsx             # Root component
        ├── routes.tsx          # All route definitions
        ├── api/
        │   └── axiosClient.ts  # Axios instance with JWT refresh interceptor
        ├── components/
        │   ├── ui/             # shadcn/ui base components (Button, Card, etc.)
        │   └── figma/          # Custom components (ImageWithFallback, etc.)
        ├── hooks/
        │   └── useAuth.ts      # Authentication hook
        ├── layouts/
        │   ├── UserLayout.tsx
        │   ├── DietitianLayout.tsx
        │   ├── CatererLayout.tsx
        │   └── AdminLayout.tsx
        ├── pages/
        │   ├── public/         # Landing, Pricing, Payment pages
        │   ├── auth/           # Login, Register, VerifyOTP, ForgotPassword, ResetPassword
        │   ├── user/           # Dashboard, Menu, Deliveries, Profile, HealthDataSubmission
        │   ├── dietitian/      # Dashboard, Patients, PatientProfile, MenuEditor, Profile
        │   ├── caterer/        # Today, Stats, Profile
        │   └── admin/          # Dashboard, Users, Dietitians, Caterers, Menus, Payments, Logs, Tools
        └── services/
            ├── authService.ts
            ├── userService.ts
            ├── dietitianService.ts
            ├── catererService.ts
            ├── adminService.ts
            └── healthProfileService.ts
```

---

## Application Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Landing page | Public |
| `/pricing` | Pricing / Stripe checkout | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/verify-otp` | Email OTP verification | Public |
| `/forgot-password` | Forgot password | Public |
| `/reset-password` | Reset password | Public |
| `/user` | User dashboard | User |
| `/user/health-data` | Health data submission form | User |
| `/user/menu` | Monthly meal menu | User |
| `/user/deliveries` | Delivery tracking | User |
| `/user/profile` | User profile | User |
| `/dietitian` | Dietitian dashboard | Dietitian |
| `/dietitian/patients` | Patient list | Dietitian |
| `/dietitian/menu-editor/:userId` | Menu editor for a patient | Dietitian |
| `/caterer` | Today's orders | Caterer |
| `/caterer/stats` | Delivery statistics | Caterer |
| `/admin` | Admin dashboard | Admin |
| `/admin/users` | User management | Admin |
| `/admin/dietitians` | Dietitian management | Admin |
| `/admin/payments` | Payment overview | Admin |
| `/admin/logs` | System audit logs | Admin |

---

## What is React?

**React** is a JavaScript library made by Meta (Facebook) for building user interfaces. Instead of writing separate HTML, CSS, and JS files and manually updating the page, React lets you build **components** — reusable pieces of UI that automatically update when the underlying data changes.

Key concepts you'll encounter in this project:

| Concept | Simple Explanation |
|---------|-------------------|
| **Component** | A function that returns a piece of UI (like a button or a whole page) |
| **JSX / TSX** | HTML-like syntax written inside JavaScript/TypeScript files |
| **State (`useState`)** | Data that belongs to a component and causes it to re-render when it changes |
| **Effect (`useEffect`)** | Code that runs after a component renders (e.g., fetching data from an API) |
| **Props** | Data passed from a parent component down to a child component |
| **Hook** | A special React function (starts with `use`) that adds functionality to components |
| **Router** | React Router maps URLs (like `/login`) to specific page components |

This project is written in **TypeScript**, which is JavaScript with type annotations. It catches bugs during development before you even run the code.

**Vite** is the build tool — it starts a super-fast local development server and bundles the app for production.

---

## Prerequisites

Before running the project, make sure you have these installed:

| Tool | Minimum Version | Check with |
|------|----------------|------------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |

> **Don't have Node.js?** Download it from [https://nodejs.org](https://nodejs.org) — choose the **LTS** version.

You also need the **NutriFlow backend** running locally on `http://localhost:8080` for API calls to work.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd nutriflow-front
```

### 2. Install dependencies

```bash
npm install
```

> This reads `package.json` and downloads all required libraries into a `node_modules/` folder. This may take a minute.

### 3. Start the development server

```bash
npm run dev
```

> Vite will start a local server, typically at **http://localhost:5173**. Open this URL in your browser.

The page automatically reloads whenever you save a file — no manual refresh needed.

### 4. Build for production

```bash
npm run build
```

> This creates an optimized `dist/` folder ready to be deployed to any static hosting service (Vercel, Netlify, Nginx, etc.).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local development server with hot reload |
| `npm run build` | Build the app for production into the `dist/` folder |

---

## Environment & API

All API requests are sent to `http://localhost:8080` (defined in `src/app/api/axiosClient.ts`).

The axios client handles:
- **Attaching the JWT access token** to every request via the `Authorization: Bearer <token>` header
- **Proactive token refresh** — before sending a request, the client checks if the JWT is expired (or expiring within 30 seconds) and silently refreshes it using the refresh token stored in `localStorage`
- **Redirecting to `/login`** if the refresh also fails

Tokens and user data are stored in `localStorage` under these keys:

| Key | Value |
|-----|-------|
| `accessToken` | JWT access token |
| `refreshToken` | JWT refresh token |
| `userRole` | `USER`, `DIETITIAN`, `CATERER`, or `ADMIN` |
| `userEmail` | Logged-in user's email |
| `userFullName` | Logged-in user's full name |
| `userStatus` | Account status from the backend |

---

## Internationalization

The UI supports three languages, switchable from the language selector on the landing page:

| Code | Language |
|------|----------|
| `en` | English |
| `az` | Azerbaijani |
| `ru` | Russian |

Translation files live in `src/i18n/locales/`. To add a new language, create a new file there and register it in `src/i18n/index.ts`.

---

> © 2026 NutriFlow. All rights reserved.
