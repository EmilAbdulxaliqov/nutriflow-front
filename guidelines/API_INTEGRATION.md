# API Integration Guide

This document explains how the NutriFlow frontend communicates with the backend Spring Boot API — from the base HTTP client all the way to using data inside React components.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Axios Client](#axios-client)
3. [Service Layer](#service-layer)
4. [Using Services in Components](#using-services-in-components)
5. [Error Handling](#error-handling)
6. [Adding a New Endpoint (Step-by-Step)](#adding-a-new-endpoint-step-by-step)
7. [Authentication Flow](#authentication-flow)
8. [Pagination Pattern](#pagination-pattern)

---

## Architecture Overview

```
Component (React)
    │
    │  calls
    ▼
Service file  (src/app/services/*.ts)
    │
    │  uses
    ▼
axiosClient   (src/app/api/axiosClient.ts)
    │
    │  HTTP
    ▼
Backend API   (http://localhost:8080/api/v1/...)
```

All HTTP calls go through a **single shared Axios instance** (`axiosClient`). Service files wrap individual endpoints and expose typed functions. Components import those functions — they never call Axios directly.

---

## Axios Client

**File:** `src/app/api/axiosClient.ts`

```ts
const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});
```

### Request Interceptor — Attach JWT

Before every request the interceptor reads `accessToken` from `localStorage` and injects it as a Bearer token:

```
Authorization: Bearer <token>
```

If no token is stored (unauthenticated user) the header is simply omitted.

### Response Interceptor — Handle 401

If the backend returns **401 Unauthorized**, the interceptor:
1. Removes `accessToken` from `localStorage`
2. Redirects the browser to `/login`

This means components never need to handle expired-token redirects manually.

---

## Service Layer

Each domain has its own service file:

| File | Domain | Base path |
|------|--------|-----------|
| `authService.ts` | Registration, login, OTP, password reset | `/api/v1/auth` |
| `userService.ts` | User dashboard, menu, deliveries, profile | `/api/v1/user` |
| `adminService.ts` | Admin panel — users, dietitians, caterers, menus | `/api/v1/admin` |
| `dietitianService.ts` | Dietitian dashboard, patients, menus | `/api/v1/dietitian` |
| `catererService.ts` | Caterer dashboard, today's deliveries | `/api/v1/caterer` |
| `healthProfileService.ts` | Health data submission | `/api/v1/health-profile` |

### Anatomy of a Service File

```ts
import axiosClient from "../api/axiosClient";

const BASE = "/api/v1/user";

// 1. Type definitions for request payload
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  // ... other optional fields
}

// 2. Type definition for the response shape
export interface UserProfile {
  userId: number;
  firstName: string;
  email: string;
  // ...
}

// 3. Exported service function — returns the Axios promise
export const getProfile = () =>
  axiosClient.get<UserProfile>(`${BASE}/profile`);

export const updateProfile = (payload: UpdateProfilePayload) =>
  axiosClient.put(`${BASE}/profile/update`, payload);
```

**Conventions:**
- Every function returns the raw Axios promise — the `.data` unwrapping happens in the component.
- Request/response types are exported so components get full TypeScript inference.
- `GET` → `axiosClient.get`, `POST` → `axiosClient.post`, `PUT` → `axiosClient.put`, `PATCH` → `axiosClient.patch`, `DELETE` → `axiosClient.delete`

---

## Using Services in Components

### Pattern 1 — `useEffect` + `useState` (data fetching on mount)

```tsx
import { useState, useEffect } from "react";
import { getProfile, type UserProfile } from "../../services/userService";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(({ data }) => setProfile(data))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  return <div>{profile?.firstName}</div>;
}
```

### Pattern 2 — async/await inside a handler (form submit / button click)

```tsx
import { useState } from "react";
import { updateProfile } from "../../services/userService";
import { toast } from "sonner";

export default function EditProfile() {
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await updateProfile({ firstName: "Jane" });
      toast.success("Profile updated");
    } catch (err: unknown) {
      // Extract the backend error message if available
      const message =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
      toast.error(message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={submitting}>
      {submitting ? "Saving..." : "Save"}
    </Button>
  );
}
```

### Pattern 3 — Cancellable fetch with `AbortController` (pagination / search)

Used when the user can trigger multiple requests quickly (e.g. searching, changing pages):

```tsx
import { useRef } from "react";

const fetchController = useRef<AbortController | null>(null);

const fetchData = async (page = 0) => {
  // Cancel the previous in-flight request
  fetchController.current?.abort();
  const controller = new AbortController();
  fetchController.current = controller;

  setLoading(true);
  try {
    const { data } = await axiosClient.get("/api/v1/admin/users", {
      params: { page },
      signal: controller.signal,   // pass the signal
    });
    if (!controller.signal.aborted) {
      setUsers(data.content);
    }
  } catch (err) {
    // Ignore AbortError — it's intentional
    if (!(err instanceof DOMException && err.name === "AbortError")) {
      toast.error("Failed to load users");
    }
  } finally {
    if (!controller.signal.aborted) setLoading(false);
  }
};
```

---

## Error Handling

Backend error responses from Spring Boot follow this shape:

```json
{
  "message": "User not found",
  "status": 404
}
```

The standard way to extract that message in a catch block:

```ts
catch (err: unknown) {
  const message =
    (err as { response?: { data?: { message?: string } } })
      ?.response?.data?.message;
  toast.error(message ?? "Fallback error message");
}
```

The `extractErrorMessage` helper in `userService.ts` does this in one line:

```ts
import { extractErrorMessage } from "../../services/userService";

// ...
catch (err) {
  toast.error(extractErrorMessage(err, "Default message"));
}
```

---

## Adding a New Endpoint (Step-by-Step)

**Example:** Add `GET /api/v1/user/notifications`

### Step 1 — Add the type and function to the relevant service file

```ts
// src/app/services/userService.ts

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export const getNotifications = () =>
  axiosClient.get<Notification[]>(`${USER_BASE}/notifications`);

export const markNotificationRead = (id: number) =>
  axiosClient.patch(`${USER_BASE}/notifications/${id}/read`);
```

### Step 2 — Call it from a component

```tsx
import { useState, useEffect } from "react";
import { getNotifications, type Notification } from "../../services/userService";

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    getNotifications()
      .then(({ data }) => setItems(data))
      .catch(() => toast.error("Failed to load notifications"));
  }, []);

  return (
    <ul>
      {items.map((n) => (
        <li key={n.id}>{n.message}</li>
      ))}
    </ul>
  );
}
```

That's all that's needed — no boilerplate stores, no global state setup.

---

## Authentication Flow

```
User submits login form
        │
        ▼
authService.login(payload)
        │  POST /api/v1/auth/login
        ▼
Backend returns { token, refreshToken, role, email, firstName, lastName }
        │
        ▼
authService stores in localStorage:
  ├── accessToken     → used by axiosClient on every request
  ├── refreshToken
  ├── userRole        → used by route guards (useAuth.ts)
  ├── userEmail
  └── userFullName
        │
        ▼
Component reads userRole → navigate to correct dashboard
  ADMIN      → /admin
  DIETITIAN  → /dietitian
  CATERER    → /caterer
  USER       → /user
```

**Reading auth state in a component:**

```ts
import { useAuth } from "../../hooks/useAuth";

const { role, isAuthenticated } = useAuth();
```

**Logging out:**

```ts
localStorage.removeItem("accessToken");
localStorage.removeItem("userRole");
// ... remove other keys
navigate("/login");
```

---

## Pagination Pattern

Most admin list endpoints return a Spring `Page<T>` object:

```json
{
  "content": [ /* array of items */ ],
  "totalElements": 42,
  "totalPages": 5,
  "number": 0,        // current page (0-based)
  "size": 10
}
```

The corresponding TypeScript type in `adminService.ts`:

```ts
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
```

Service functions accept `page` and `size` params:

```ts
export const getUsers = (page = 0, size = 10) =>
  axiosClient.get<Page<AdminUser>>(`${BASE}/users`, {
    params: { page, size, sort: "id,desc" },
  });
```

In components, store `currentPage`, `totalPages`, `totalElements` in state and call `fetchUsers(currentPage ± 1)` from the pagination buttons.
