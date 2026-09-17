# Innovation Hacks — Task 3

## Database Integration — Users, Projects & Tasks API

A RESTful backend API built with **Node.js, Express.js, MongoDB and Mongoose** as part of the Innovation Hacks Full Stack Development Internship.

This project extends the backend developed in Task 2 by replacing in-memory data with a **persistent MongoDB database**, adding Mongoose schemas, relationships, validation, authentication, project management, task management, invitations and notifications.

---

## 🚀 Features

- User registration and login
- JWT-based authentication using HTTP cookies
- Password hashing with bcrypt
- MongoDB database integration using Mongoose
- User search
- Recent teammates system
- Project creation and management
- Project member management
- Task creation and management
- Task status and priority management
- Project invitations
- Accept/reject invitation flow
- In-app notifications
- Request validation using Express Validator
- Mongoose schema validation
- Centralized error handling
- Protected API routes
- Role-based project administration
- Persistent data storage

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript (ES Modules)

### Authentication & Security

- JSON Web Tokens (JWT)
- bcryptjs
- HTTP cookies
- dotenv

### Validation & Utilities

- express-validator
- cookie-parser
- centralized error handling

---

# 📁 Project Structure

```text
Innovation_Hack_Task_03/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
│
└── src/
    ├── app.js
    │
    ├── config/
    │   ├── config.js
    │   └── database.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── invitationController.js
    │   ├── notificationController.js
    │   ├── projectController.js
    │   ├── taskController.js
    │   └── userController.js
    │
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── validateMiddleware.js
    │
    ├── models/
    │   ├── userModel.js
    │   ├── projectModel.js
    │   ├── taskModel.js
    │   ├── invitationsModel.js
    │   ├── notificationModel.js
    │   └── teammatesModel.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── projectRoutes.js
    │   ├── taskRoutes.js
    │   ├── invitationRoutes.js
    │   └── notificationRoutes.js
    │
    └── utils/
        └── sanitizeUser.js
```

---

# 🗄️ Database Integration

Task 2 used in-memory JavaScript arrays for storing application data.

In Task 3, the data layer was migrated to **MongoDB using Mongoose**.

### Architecture

```text
Frontend
   │
   ▼
Express REST API
   │
   ▼
Controllers
   │
   ▼
Mongoose Models
   │
   ▼
MongoDB
```

Data now persists even after the server is restarted.

---

# 📊 Data Models

The application currently uses the following MongoDB collections:

### User

Stores user account information.

```text
User
├── fullName
├── email
├── password
└── role
```

Passwords are hashed using bcrypt before being stored.

---

### Project

```text
Project
├── admin → User
├── title
├── description
├── status
├── members → Users
└── dueDate
```

The user who creates a project is automatically added as a project member and becomes the project admin.

---

### Task

```text
Task
├── assignee → User
├── title
├── description
├── projectId → Project
├── status
└── priority
```

Tasks can either belong to a project or exist as individual tasks.

---

### Invitation

```text
Invitation
├── projectId → Project
├── senderId → User
├── receiverId → User
└── status
```

Invitation status can be:

```text
pending
accepted
rejected
```

---

### Notification

```text
Notification
├── userId → User
├── message
├── isRead
└── timestamps
```

Notifications are generated for invitation-related events.

---

### Recent Teammates

```text
TeamMates
├── userId → User
└── recentTeamMates → Users
```

This allows users who have previously worked together to be suggested when inviting teammates to another project.

---

# 🔐 Authentication

Authentication is implemented using **JWT**.

After successful registration or login, the server generates a JWT and stores it in an HTTP cookie:

```text
Access_Token
```

Protected routes use the authentication middleware to verify the token before allowing access.

---

# 🔑 API Documentation

Base URL:

```text
http://localhost:5000
```

All endpoints requiring authentication expect a valid `Access_Token` cookie.

---

# 👤 Authentication APIs

## `POST /api/auth/register`

Registers a new user.

### Request Body

```json
{
  "fullName": "Alex Morgan",
  "email": "alex@example.com",
  "password": "StrongPass1!",
  "role": "user"
}
```

### Required Fields

- `fullName`
- `email`
- `password`
- `role`

The password is hashed using bcrypt before being stored in MongoDB.

---

## `POST /api/auth/login`

Logs an existing user in.

### Request Body

```json
{
  "email": "alex@example.com",
  "password": "StrongPass1!"
}
```

On successful login, an authentication cookie is created.

---

## `GET /api/auth/`

Returns the currently authenticated user.

**Authentication:** Required

---

# 👥 User APIs

All user endpoints require authentication.

## `GET /api/users?search=`

Searches for users by:

- Full name
- Email
- User ID

The currently authenticated user is excluded from the results.

### Example

```text
GET /api/users?search=alex
```

---

## `GET /api/users/recent`

Returns recent teammates associated with the authenticated user.

**Authentication:** Required

These users can be used as suggestions when inviting teammates to a project.

---

# 📁 Project APIs

All project endpoints require authentication.

## `GET /api/projects`

Returns projects where the authenticated user is a member.

---

## `GET /api/projects/:projectId`

Returns a project by its MongoDB ObjectId.

### Example

```text
GET /api/projects/66a123456789abcdef123456
```

---

## `GET /api/projects/:projectId/task`

Returns tasks associated with a project.

---

## `POST /api/projects`

Creates a new project.

### Request Body

```json
{
  "title": "Website Redesign",
  "description": "Redesign the company website",
  "status": "inProgress",
  "dueDate": "2026-09-15"
}
```

### Project Status

```text
inProgress
completed
```

The creator is automatically added to the project's `members` array.

---

## `PATCH /api/projects/:projectId`

Updates an existing project.

### Example Request Body

```json
{
  "title": "Website Redesign v2",
  "description": "Updated project requirements"
}
```

Supported fields include:

- `title`
- `description`
- `status`
- `members`
- `dueDate`

Only the project admin can update project information.

---

## `PATCH /api/projects/:projectId/status`

Updates the project status.

### Request Body

```json
{
  "status": "completed"
}
```

Valid statuses:

```text
inProgress
completed
```

---

## `DELETE /api/projects/:projectId`

Deletes a project.

Only the project admin can delete the project.

### Response

```text
204 No Content
```

---

# ✅ Task APIs

All task endpoints require authentication.

## `GET /api/tasks`

Returns tasks assigned to the authenticated user.

---

## `GET /api/tasks/:taskId`

Returns a specific task by its MongoDB ObjectId.

---

## `POST /api/tasks`

Creates a new task.

### Request Body

```json
{
  "title": "Implement Login",
  "description": "Create the login API",
  "projectId": "66a123456789abcdef123456",
  "status": "toDo",
  "priority": "high"
}
```

### Fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Task title |
| `description` | No | Task description |
| `projectId` | No | Project associated with the task |
| `status` | No | Current task status |
| `priority` | No | Task priority |
| `assignee` | No | User assigned to the task |

If no assignee is provided, the authenticated user is used.

### Task Status

```text
toDo
inProgress
completed
```

### Task Priority

```text
low
medium
high
```

Defaults:

```text
status   → toDo
priority → medium
```

---

## `PATCH /api/tasks/:taskId`

Updates an existing task.

### Example

```json
{
  "description": "Add validation and error handling",
  "priority": "medium"
}
```

Supported fields:

- `title`
- `description`
- `projectId`
- `status`
- `priority`

---

## `PATCH /api/tasks/:taskId/status`

Updates only the task status.

### Request Body

```json
{
  "status": "inProgress"
}
```

Valid statuses:

```text
toDo
inProgress
completed
```

---

## `DELETE /api/tasks/:taskId`

Deletes a task.

### Response

```text
204 No Content
```

---

# 🤝 Invitation APIs

The invitation system allows users to invite teammates to projects.

### Invitation Flow

```text
Create Project
      │
      ▼
Creator becomes project member
      │
      ▼
Invite teammate
      │
      ▼
Invitation created
      │
      ▼
Notification sent
      │
      ├───────────────┐
      ▼               ▼
   Accept           Reject
      │               │
      ▼               ▼
Added to project   No membership change
```

---

## `POST /api/invitations`

Sends invitations to one or more users.

### Request Body

```json
{
  "projectId": "66a123456789abcdef123456",
  "receiversId": [
    "66b123456789abcdef123456",
    "66c123456789abcdef123456"
  ]
}
```

Only existing project members can send invitations.

The API skips users who:

- Do not exist
- Are already project members
- Are the sender themselves
- Already have a pending invitation

---

## `GET /api/invitations/received`

Returns pending invitations received by the authenticated user.

---

## `GET /api/invitations/sent`

Returns invitations sent by the authenticated user.

---

## `PATCH /api/invitations/:invitationId`

Accepts or rejects an invitation.

### Request Body

```json
{
  "status": "accepted"
}
```

Valid values:

```text
accepted
rejected
```

When accepted:

- The receiver is added to the project
- The sender receives a notification
- The teammate is stored in the sender's recent teammates

When rejected:

- The receiver is not added to the project
- The sender receives a notification

---

# 🔔 Notification APIs

All notification endpoints require authentication.

## `GET /api/notifications`

Returns notifications belonging to the authenticated user.

Notifications are sorted with the newest first.

---

## `PATCH /api/notifications/:notificationId/read`

Marks a notification as read.

---

## `PATCH /api/notifications/read-all`

Marks all notifications belonging to the authenticated user as read.

---

## `DELETE /api/notifications/:notificationId`

Deletes a notification.

### Response

```text
204 No Content
```

Users can only modify or delete their own notifications.

---

# ✅ Validation

The API uses **express-validator** for request-level validation.

Mongoose also provides schema-level validation before data is stored in MongoDB.

Validation covers:

- Required fields
- Email format
- Password requirements
- Enum values
- String values
- Arrays
- Project status
- Task status
- Task priority
- Invitation status
- Date format
- Empty request bodies

Example validation response:

```json
{
  "message": "Validation failed",
  "success": false,
  "errors": [
    "title is required and must be a non-empty string"
  ]
}
```

Invalid request data returns:

```text
400 Bad Request
```

---

# ⚠️ Error Handling

The application uses centralized error handling middleware.

Common HTTP status codes:

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created |
| `204` | Resource deleted successfully |
| `400` | Invalid request or validation error |
| `401` | Authentication required/invalid |
| `403` | User does not have permission |
| `404` | Resource or route not found |
| `500` | Unexpected server error |

Unknown routes are handled by a centralized `404` handler.

---

# 🔒 Security

The application includes several security-related practices:

- Password hashing using bcrypt
- JWT authentication
- Protected API routes
- Environment variables for secrets
- Password exclusion from user queries/responses
- User-specific notification access
- Project admin authorization
- Input validation before database operations

Never commit real credentials or secrets to GitHub.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

### Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `MONGO_URI` | MongoDB connection string |

### Example `.env.example`

```env
JWT_SECRET=replace-with-a-secure-secret
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

---

# 🚀 Running the Project Locally

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

## 2. Navigate into the project

```bash
cd Innovation_Hack_Task_03
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create a `.env` file:

```env
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

## 5. Start the server

```bash
npm run dev
```

The server will start on:

```text
http://localhost:5000
```

---

# 📦 Available Dependencies

Main dependencies used in this project:

- Express
- Mongoose
- bcryptjs
- jsonwebtoken
- express-validator
- cookie-parser
- dotenv

---

# 🧪 API Testing

The API can be tested using tools such as:

- Postman
- Thunder Client
- Insomnia

Recommended testing flow:

```text
Register
   ↓
Login
   ↓
Create Project
   ↓
Create Task
   ↓
Search Users
   ↓
Send Invitation
   ↓
Accept / Reject Invitation
   ↓
Check Notifications
   ↓
Update Project / Task
   ↓
Delete Resources
```

---

# 🔄 Task Progression

This project is part of a full-stack development journey.

```text
Task 1
Developer Productivity Dashboard
        │
        ▼
Task 2
REST API Development
        │
        ▼
Task 3
MongoDB Database Integration
        │
        ▼
Task 4
AI-Powered Full-Stack Platform
```

### Task 3 Focus

The primary goal of this task was to move from temporary in-memory data to a real persistent database.

### Task 3 includes:

- MongoDB integration
- Mongoose models
- Database relationships
- Persistent users
- Persistent projects
- Persistent tasks
- Persistent invitations
- Persistent notifications
- Schema validation
- Database-backed CRUD operations

---

# 🎯 Internship Task

**Program:** Innovation Hacks — Full Stack Development Internship  
**Task:** Task 3 — Database Integration  
**Backend:** Node.js + Express.js  
**Database:** MongoDB + Mongoose

---

# 🎥 Demo

Demo Video: **[Adding soon]**