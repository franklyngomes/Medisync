# 🏥 Medisync - Patient/Clinic Management System

Medisync is a **full-stack Patient & Clinic Management System** built with **MERN + Next.js** that enables smooth management of patients, doctors, appointments, invoices, and lab operations.  
It comes with **role-based access control (RBAC)** for Admin, Doctor, Receptionist, and Lab Staff to ensure security and streamlined workflows.

🚀 Live Demo: [Medisync](https://medisync-frontend-b06k.onrender.com/)

---

## ✨ Features

- **Authentication & Security**
  - JWT authentication
  - Cookie-based sessions
  - Role-based access control (RBAC)

- **Roles & Permissions**
  - **Admin**: Full CRUD access to all modules, view & delete invoices
  - **Doctor**: View/create appointments, update patients & appointments
  - **Receptionist**: Create/update patients & appointments, view invoices
  - **Lab Staff**: Generate invoices only

- **Admin-Only User Management**
  - Only **Admin** can create user accounts
  - New users automatically receive their **login credentials via email**
  - Public sign-up is disabled for security

- **Core Modules**
  - Patient Management (registration, updates)
  - Doctor Management (availability, appointments)
  - Appointment Scheduling (with patient-doctor linkage)
  - Pathology & Radiology Modules
  - Billing & Invoice Generation (custom PDF reports)

- **Frontend**
  - Next.js with App Router
  - **TanStack Query** for API caching & fetching
  - **Zustand + Context API** for global state management
  - **Tailwind CSS** for modern responsive UI

- **Backend**
  - Node.js + Express REST API
  - MongoDB with Mongoose ORM
  - Input validation with **Joi**
  - Invoice generation with custom templates (EJS)
  - Session handling via `cookie-parser` & `express-session`

---

## 🛠️ Tech Stack

**Frontend**  
- [Next.js](https://nextjs.org/)  
- [TanStack Query](https://tanstack.com/query/latest)  
- [Zustand](https://zustand-demo.pmnd.rs/)  
- Context API  
- [Tailwind CSS](https://tailwindcss.com/)  

**Backend**  
- [Node.js](https://nodejs.org/)  
- [Express.js](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/) + Mongoose  
- [EJS](https://ejs.co/) (templates for invoices & reports)  
- [JWT](https://jwt.io/) for authentication  
- `cookie-parser` & `express-session`  
- [Joi](https://joi.dev/) for request validation  

---

## 🔐 Demo Credentials

To explore please login as Admin Operator:

- **Email:** `wenejeippemo-7240@yopmail.com`  
- **Password:** `abcdefgh`

To explore please login as Doctor:
- **Email:** `quokoivecoussoi-1913@yopmail.com`  
- **Password:** `abcdefgh`
  
To check out other roles please create and account with admin access:

---

## 🚦 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

1. **Clone the repository**
```bash
git clone https://github.com/franklyngomes/Medisync.git
cd medisync
```
2. **Setup environment variables**
  Create `.env` in the server folder:

   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   ```
3. **Install dependencies**

   ```bash
   # Client
   cd client
   npm install

   # Server
   cd ../server
   npm install
   ```

4. **Run the project**

   ```bash
   # In client
   npm run dev

   # In server
   npm start
   ```
