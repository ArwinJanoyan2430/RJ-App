# Authentication notes 🔐

## Overview
The project uses Clerk for authentication (admin UI and Clerk backend). The backend uses `@clerk/express` middleware and Inngest functions to sync users created/deleted in Clerk into the MongoDB `User` collection.

## New auth middleware & routes
- Middleware: `src/middleware/requireAuth.js` — uses `req.auth.userId` set by `clerkMiddleware()` to protect routes.
- Routes: `src/routes/auth.routes.js`
  - GET `/api/auth/me` — returns the current authenticated user (by Clerk ID)
  - PUT `/api/auth/me` — updates the authenticated user document

## CORS
A minimal CORS middleware was added to `src/server.js`. Set `CORS_ORIGIN` in `.env` for your dev front-end origin (default `http://localhost:5173`). Ensure the front-end sends credentials on fetch requests:

Example fetch:

fetch("/api/auth/me", {
  method: "GET",
  credentials: "include"
});

## Admin / Frontend
- Admin is already configured with `@clerk/clerk-react` and `VITE_CLERK_PUBLISHABLE_KEY` in `admin/.env`.
- Use the `UserButton`, `SignedIn` and `SignedOut` components in admin UI.

## Mobile
- Mobile currently has no Clerk integration. If you want auth in mobile, I can add Clerk React Native (or other solution) and wire endpoints.

---
If you'd like, I can also:
- Add address / wishlist protected endpoints
- Add admin-only role checks
- Integrate Clerk on mobile (Expo)
