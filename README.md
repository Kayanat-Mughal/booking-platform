# Booking Platform

A multi-tenant booking platform built during the internship. The project uses a React/Vite frontend, an Express/Mongoose backend, and MongoDB running locally through Docker Compose.

## Current Weekly Progress

### Completed

- React/Vite frontend initialized.
- Express backend initialized.
- MongoDB 6 configured with Docker Compose and a persistent volume.
- Environment variable validation added for the server.
- Tenant and user data models created.
- Booking model created with tenant ownership and validation.
- Migration script added for tenant and user indexes.
- Seed script added with Acme, Beta, and Gamma tenant test data.
- Registration and login implemented with bcrypt password hashing and JWT tokens.
- Authenticated `/api/auth/me` endpoint implemented.
- Protected dashboard routes implemented in the client.
- Responsive dashboard shell with sidebar navigation implemented.
- Landing, login, and registration screens implemented.
- Tenant-aware booking CRUD API implemented.
- Booking read/write permissions implemented through RBAC middleware.
- Booking management screen connected to the backend API.
- Basic wildcard subdomain detection implemented for hosts such as `acme.localhost` and `acme.example.com`.

### Remaining Hardening

- Configure production DNS and reverse-proxy support for wildcard subdomains.
- Replace the development JWT secret before deployment.
- Add automated API and tenant-isolation tests.
- Configure MongoDB authentication/RBAC for production deployment.

## Technology Stack

### Frontend

- React 19
- React Router
- Vite
- Axios
- Material UI and Emotion dependencies

### Backend

- Node.js
- Express
- Mongoose
- MongoDB 6
- JSON Web Tokens
- bcryptjs
- dotenv

### Infrastructure

- Docker Compose
- MongoDB persistent volume

## Repository Structure

```text
booking-platform/
├── client/                 React/Vite frontend
│   ├── public/
│   └── src/
├── server/                 Express/Mongoose backend
│   ├── src/
│   │   ├── middleware/     Authentication, tenant, and RBAC middleware
│   │   ├── migrations/     Database index setup
│   │   ├── models/         Tenant, User, and Booking models
│   │   ├── routes/         Auth, tenant, and booking routes
│   │   └── seed.js         Development seed data
│   └── .env                Local server configuration
├── docker-compose.yml      MongoDB container configuration
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm
- Docker Desktop with Docker Compose
- MongoDB Compass (optional, for viewing local data)

## Local Setup

### 1. Start MongoDB

From the repository root:

```bash
docker compose up -d
```

The MongoDB container is named `booking-mongodb` and exposes port `27017`.

Check that it is running:

```bash
docker ps
```

### 2. Configure the server

Create or update `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://host.docker.internal:27017/booking_platform
JWT_SECRET=replace-with-a-development-secret
JWT_EXPIRE=7d
```

Do not commit real secrets to GitHub. Use a different strong `JWT_SECRET` for every deployed environment.

### 3. Install backend dependencies and initialize the database

```bash
cd server
npm install
npm run migrate
npm run seed
```

The seed command creates these development tenants:

- `acme`
- `beta`
- `gamma`

Seeded users use the password `password123` for local development. Do not use this password outside the local development environment.

### 4. Start the backend

From `server/`:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### 5. Install and start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

## Main Routes

### Frontend routes

- `/` - Tenant onboarding landing page
- `/login` - Login screen
- `/register` - Registration screen
- `/dashboard` - Protected dashboard
- `/dashboard/bookings` - Tenant booking management
- `/dashboard/team` - Team page
- `/dashboard/settings` - Settings page

### Backend routes

- `POST /api/auth/register` - Register a tenant and owner user
- `POST /api/auth/login` - Authenticate and issue a JWT
- `GET /api/auth/me` - Return the authenticated user
- `GET /api/tenants/current` - Return the current tenant
- `GET /api/tenants/all` - Owner-only tenant listing
- `GET /api/bookings` - List bookings for the authenticated tenant
- `GET /api/bookings/:id` - Get one tenant booking
- `POST /api/bookings` - Create a booking for the authenticated tenant
- `PATCH /api/bookings/:id` - Update one tenant booking
- `DELETE /api/bookings/:id` - Delete one tenant booking

Booking routes require a bearer token in the `Authorization` header:

```text
Authorization: Bearer <jwt-token>
```

## Multi-Tenancy and Security

Every user belongs to a tenant through `tenantId`. Booking queries always include the authenticated user's tenant ID, preventing users from reading or modifying bookings belonging to another tenant through the booking API.

Roles currently include:

- `owner` - Full access
- `admin` - General read/write access and staff management
- `staff` - Booking read/write access
- `viewer` - Booking read access

For local subdomain testing, use hosts such as:

```text
http://acme.localhost:5000/test
http://beta.localhost:5000/test
```

Production wildcard routing requires DNS and a reverse proxy configured for `*.your-domain.com`.

## Verification Commands

Backend syntax checks:

```bash
cd server
node --check src/index.js
node --check src/models/Booking.js
node --check src/routes/booking.routes.js
```

Frontend build:

```bash
cd client
npm run build
```

Frontend lint:

```bash
cd client
npm run lint
```

## Viewing MongoDB Data

Connect MongoDB Compass to:

```text
mongodb://host.docker.internal:27017
```

Open the `booking_platform` database. The main collections are:

- `tenants`
- `users`
- `bookings`

## Development Notes

- Keep this README updated for every weekly submission.
- Continue pushing all weekly commits to this same GitHub repository.
- Never commit `server/.env` or production credentials.
- Stop the local database with `docker compose down`; the named volume preserves data unless it is explicitly removed.
