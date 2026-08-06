# 📅 Booking Platform

A full‑stack, multi‑tenant booking SaaS built during the Parallax Labs internship. The project uses a React/Vite frontend, an Express/Mongoose backend, and MongoDB running locally through Docker Compose.

---

## 📊 Current Weekly Progress

### ✅ Week 1 – Foundation

- React/Vite frontend and Express backend initialized.
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
- Basic wildcard subdomain detection implemented.

### ✅ Week 2 – Booking Management

- Tenant‑aware booking CRUD API implemented.
- Booking read/write permissions implemented through RBAC middleware.
- Booking management screen connected to the backend API.
- Booking list grouped by date with detail view, create/update/delete flows, client‑side validation, retry logic, and toast error handling.
- Postman collection includes booking and auth endpoint documentation.

### ✅ Week 3 – Payments & Subscriptions

- Stripe integration implemented on the backend for subscription management.
- Secure webhook handler with signature verification to process Stripe events and handle duplicate webhooks.
- Frontend pricing/plans page built with Stripe Checkout UI flow.
- Billing history page showing past invoices and plan upgrade/downgrade UI.
- Webhook‑driven state changes handled seamlessly on the frontend UI.
- Manage Billing portal integrated for users to update payment methods and cancel subscriptions.
- Subscription status displayed on the billing page.
- Invoice history with download PDF support.

### ⏳ Remaining Hardening

- Configure production DNS and reverse‑proxy support for wildcard subdomains.
- Replace the development JWT secret before deployment.
- Add automated API and tenant‑isolation tests.
- Configure MongoDB authentication/RBAC for production deployment.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router, Vite, Axios, Material UI |
| **Backend** | Node.js, Express, Mongoose, JWT, bcryptjs, Stripe |
| **Database** | MongoDB 6 |
| **Infrastructure** | Docker Compose, MongoDB persistent volume |

---

## 📂 Repository Structure
booking-platform/
├── client/ React/Vite frontend
│ ├── public/
│ └── src/
├── server/ Express/Mongoose backend
│ ├── src/
│ │ ├── middleware/ Authentication, tenant, and RBAC middleware
│ │ ├── migrations/ Database index setup
│ │ ├── models/ Tenant, User, and Booking models
│ │ ├── routes/ Auth, tenant, booking, payment, and webhook routes
│ │ ├── services/ Stripe service
│ │ └── seed.js Development seed data
│ └── .env Local server configuration
├── docker-compose.yml MongoDB container configuration
└── README.md


## 🚀 Local Setup

### 1. Start MongoDB

```bash
docker compose up -d
The MongoDB container is named booking-mongodb and exposes port 27017.

Check that it is running:

bash
docker ps
2. Configure the server
Create or update server/.env:

env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://host.docker.internal:27017/booking_platform
JWT_SECRET=replace-with-a-development-secret
JWT_EXPIRE=7d

# Stripe keys (test mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
⚠️ Do not commit real secrets to GitHub.

3. Create frontend .env
Create client/.env:

env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_BASIC_PRICE_ID=price_...
VITE_STRIPE_PREMIUM_PRICE_ID=price_...

4. Install and seed the database
bash
cd server
npm install
npm run migrate
npm run seed
The seed command creates test tenants:
acme
beta
gamma
Seeded users use the password password123 for local development.

5. Start the backend
bash
cd server
npm run dev
The API runs at http://localhost:5000.

6. Start the frontend
bash
cd client
npm install
npm run dev
The frontend runs at http://localhost:5173.

7. Start Stripe webhook listener
bash
stripe listen --forward-to http://localhost:5000/webhook/stripe
🌐 Main Routes
Frontend
Path	Description
/	Landing page
/login	Login screen
/register	Registration screen
/pricing	Pricing/plans page
/dashboard	Protected dashboard
/dashboard/bookings	Booking management
/dashboard/team	Team page
/dashboard/billing	Billing & subscription
/dashboard/settings	Settings page
Backend API
Method	Path	Description
POST	/api/auth/register	Register tenant and owner
POST	/api/auth/login	Authenticate and issue JWT
GET	/api/auth/me	Return authenticated user
GET	/api/tenants/current	Return current tenant
GET	/api/bookings	List tenant bookings
POST	/api/bookings	Create a booking
PATCH	/api/bookings/:id	Update a booking
DELETE	/api/bookings/:id	Delete a booking
POST	/api/payment/create-checkout	Create Stripe Checkout session
GET	/api/payment/subscription/status	Get subscription status
GET	/api/payment/invoices	List invoices
POST	/api/payment/billing-portal	Open Stripe billing portal
POST	/webhook/stripe	Stripe webhook endpoint
🔐 Multi‑Tenancy & RBAC
Every user belongs to a tenant through tenantId. All queries include the authenticated user's tenant ID, preventing cross‑tenant data access.

Roles:
owner – Full access
admin – Read/write access + staff management
staff – Booking read/write access
viewer – Booking read access

For local subdomain testing, use hosts like:
text
http://acme.localhost:5000/test
http://beta.localhost:5000/test

💳 Stripe Payment Testing
Test card numbers
Card	Use
4242 4242 4242 4242	Successful payment
4000 0000 0000 0002	Requires authentication
4000 0000 0000 9995	Payment declined

Webhook testing
bash
stripe listen --forward-to http://localhost:5000/webhook/stripe
Copy the signing secret to server/.env as STRIPE_WEBHOOK_SECRET.

🧪 Verification Commands
bash
# Backend syntax check
cd server
node --check src/index.js

# Frontend build
cd client
npm run build

# Frontend lint
cd client
npm run lint
📦 Viewing MongoDB Data
Connect MongoDB Compass to:

text
mongodb://host.docker.internal:27017
Main collections:
tenants
users
bookings

📝 Development Notes
Keep this README updated for every weekly submission.
Push all weekly commits to this same GitHub repository.
Never commit .env files or production credentials.
Stop the local database with docker compose down; the persistent volume preserves data.


