
```markdown
# 📅 Event Manager API

An Express.js + SQLite backend system that enables authenticated users to view events, register/deregister, and receive registration confirmations via email.

---

## 🚀 Key Features

- 🔐 JWT-based user authentication
- 🗃️ SQLite database with relational schema
- 🔁 Event registration and deregistration endpoints
- 📧 Email confirmation via Nodemailer
- 🧩 Modular architecture (controllers, routes, validators)

---

## 🗂️ Folder Structure

```

├── controller/
│   ├── usercontroller.js
│   └── userEventcontroller.js
├── Email/
│   └── email.js
├── Middlewares/
│   └── Jwttoken.js
├── Model/
│   ├── EventManagement.db
│   └── db.js
├── routes/
│   ├── userroute.js
│   └── userEventroutes.js
├── validator/
│   └── Joi.validator.js
├── app.js
├── package.json
└── .env

```

---

## 🧠 Database Schema

### 📘 Tables Overview

```

+---------------------+            +------------------------+            +----------------------+
\|       user          |            |      registration       |           |       events         |
+---------------------+            +------------------------+            +----------------------+
\| id (PK)             |◄───────────┤ user\_id (FK)           ├───────────►| id (PK)              |
\| name                |            | event\_id (FK)          |            | event\_code (UNIQUE)  |
\| email (UNIQUE)      |            | registration\_time      |            | event\_name           |
\| password            |            | id (PK)                |            | event\_description    |
\| age                 |            +------------------------+            | event\_date           |
\| phone\_num           |                                                 | location             |
+---------------------+                                                 +----------------------+

````

> The `registration` table links users and events, with a unique constraint on `(user_id, event_id)`.

---

## 🔀 API Routes

### 🧑 User Routes

| Method | Endpoint   | Description               |
|--------|------------|---------------------------|
| POST   | `/signup`  | Create a new user         |
| POST   | `/login`   | Authenticate & get JWT    |

---

### 🗓️ Event Routes (Protected)

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/events/`                   | Fetch all available events           |
| GET    | `/events/:id`                | Fetch specific event by event_code   |
| POST   | `/events/:event_code`        | Register user for an event           |
| GET    | `/event/registration`        | View user’s registered events        |
| DELETE | `/events`                    | Deregister from an event (via body)  |

> ⚠️ All event-related routes require a valid JWT in the header.

---

## 🛡️ Authentication

### 🔐 JWT Header Format

```http
Authorization: Bearer <your_token_here>
````

---

## 🧪 Sample Request Payloads

### ✅ Register for Event

```http
POST /events/1024
Headers:
Authorization: Bearer <JWT>

Body:
{}
```

### ❌ Cancel Registration

```http
DELETE /events
Headers:
Authorization: Bearer <JWT>

Body:
{
  "event_code": 1024
}
```

---

## 📧 Email Configuration

* Nodemailer is used for sending emails upon successful registration/deregistration.
* Configuration and credentials are loaded via `.env` file.
* Email logic is defined in `Email/email.js`.

---

## ⚙️ Installation & Setup

### 📦 Clone and Install

```bash
git clone https://github.com/udaykirandhage/Event_Manager
cd Event_Manager
npm install
```

### 🔐 Create `.env` File

```env
SECRET_KEY=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

> Make sure your email service (e.g., Gmail) allows third-party app access or uses an app password.

### 🚀 Run the Server

```bash
node app.js
```

Server will start on the port defined in `.env` or default to `3000`.

---


