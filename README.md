# Task 2 — Backend REST API

An Express.js backend for managing users, projects, tasks, team invitations, and notifications.

This task focuses on building and structuring REST APIs with JWT authentication, request validation, centralized error handling, CRUD operations, and a mock in-memory data layer.

## Features

- User registration and login
- JWT-based authentication using HTTP cookies
- Authenticated user profile
- User search and recent teammates
- CRUD operations for projects
- CRUD operations for tasks
- Dedicated task status update endpoint
- Project team management through invitations
- Send invitations to multiple users
- Accept or reject project invitations
- In-app notifications for invitation events
- Mark individual notifications as read
- Mark all notifications as read
- Delete notifications
- Request validation using `express-validator`
- 404 handling for unknown routes
- Centralized error handling
- Mock, in-memory data for users, projects, tasks, invitations, and notifications
- UUID-based IDs for newly created resources

## Tech Stack

- Node.js
- Express.js 5
- JSON Web Token (`jsonwebtoken`)
- Cookie Parser (`cookie-parser`)
- Dotenv (`dotenv`)
- Express Validator (`express-validator`)

## API Documentation

The server runs at:

`http://localhost:5000`

All protected endpoints require a valid JWT stored in the `Access_Token` HTTP cookie.

---

# Authentication

## `POST /api/auth/register`

Registers a new user and sets an authentication cookie.

**Authentication:** Not required

### Request Body

```json
{
  "fullName": "Alex Morgan",
  "email": "alex@example.com",
  "password": "StrongPass1!",
  "role": "Developer"
}
```

### Validation

- `fullName` is required
- `email` must be valid
- `password` must be 6–20 characters with no whitespace
- Password complexity requirements are applied
- `role` is optional

---

## `POST /api/auth/login`

Authenticates an existing user and sets an `Access_Token` cookie containing a JWT valid for one day.

**Authentication:** Not required

### Request Body

```json
{
  "email": "alex@example.com",
  "password": "StrongPass1!"
}
```

---

## `GET /api/auth/`

Returns the authenticated user's profile without exposing the password.

**Authentication:** Required

**Body:** None

---

# Users

All user endpoints require authentication.

## `GET /api/users`

Searches for users by name, email, or user ID.

**Authentication:** Required

### Query Parameter

```text
?search=alex
```

### Example

```http
GET /api/users?search=alex
```

The authenticated user is excluded from the search results.

---

## `GET /api/users/recent`

Returns recent teammates based on users who share projects with the authenticated user.

**Authentication:** Required

**Body:** None

---

# Projects

All project endpoints require authentication.

## `GET /api/projects`

Returns all projects.

**Authentication:** Required

**Body:** None

---

## `GET /api/projects/:projectId`

Returns a project by its ID.

**Authentication:** Required

**Body:** None

---

## `POST /api/projects`

Creates a new project.

**Authentication:** Required

### Request Body

```json
{
  "title": "Website Redesign",
  "description": "Refresh the company website",
  "status": "inProgress",
  "dueDate": "Dec 15"
}
```

### Fields

- `title` — required
- `description` — optional
- `status` — optional
- `dueDate` — optional

Valid project statuses:

- `toDo`
- `inProgress`
- `completed`

Default status:

```text
inProgress
```

### Project Membership

The creator is automatically added as the first project member.

For example:

```json
{
  "members": ["creator-user-id"]
}
```

Other users are **not added directly during project creation**.

To add teammates, use the invitation API. Selected teammates receive pending invitations and only become project members after accepting the invitation.

---

## `PATCH /api/projects/:projectId`

Updates one or more fields of an existing project.

**Authentication:** Required

### Request Body

```json
{
  "status": "completed",
  "description": "Redesign approved"
}
```

Supported fields:

- `title`
- `description`
- `status`
- `dueDate`
- `members`

The request body must contain at least one field.

> Team members should normally be added through the invitation flow rather than directly modifying the `members` array.

---

## `DELETE /api/projects/:projectId`

Deletes a project.

**Authentication:** Required

**Body:** None

### Success Response

`204 No Content`

---

# Tasks

All task endpoints require authentication.

## `GET /api/tasks`

Returns all tasks.

**Authentication:** Required

**Body:** None

---

## `GET /api/tasks/:taskId`

Returns a task by its ID.

**Authentication:** Required

**Body:** None

---

## `POST /api/tasks`

Creates a new task. Tasks can optionally be associated with a project.

**Authentication:** Required

### Request Body

```json
{
  "title": "Implement Login Form",
  "projectId": "project-uuid",
  "description": "Add client-side login fields",
  "status": "toDo",
  "priority": "high"
}
```

### Fields

- `title` — required
- `projectId` — optional
- `description` — optional
- `status` — optional
- `priority` — optional

Valid statuses:

- `toDo`
- `inProgress`
- `completed`

Valid priorities:

- `low`
- `medium`
- `high`

Defaults:

- Status: `toDo`
- Priority: `medium`

---

## `PATCH /api/tasks/:taskId`

Updates one or more fields of an existing task.

**Authentication:** Required

### Request Body

```json
{
  "priority": "medium",
  "description": "Add validation and error messages"
}
```

Supported fields:

- `title`
- `projectId`
- `description`
- `status`
- `priority`

The request body must contain at least one field.

---

## `PATCH /api/tasks/:taskId/status`

Updates only the status of a task.

**Authentication:** Required

### Request Body

```json
{
  "status": "inProgress"
}
```

Valid statuses:

- `toDo`
- `inProgress`
- `completed`

---

## `DELETE /api/tasks/:taskId`

Deletes a task.

**Authentication:** Required

**Body:** None

### Success Response

`204 No Content`

---

# Invitations

The invitation system is used to add teammates to projects.

A user who creates a project automatically becomes a member. Other users are added only after accepting an invitation.

## Invitation Flow

```text
Create Project
      ↓
Creator automatically becomes a member
      ↓
Invite teammates
      ↓
Invitation status: pending
      ↓
 ┌────┴────┐
 ↓         ↓
Accept   Reject
 ↓         ↓
Member   No change
```

## `POST /api/invitations`

Sends project invitations to one or more users.

**Authentication:** Required

### Request Body

```json
{
  "projectId": "project-uuid",
  "userIds": [
    "user-uuid-1",
    "user-uuid-2"
  ]
}
```

The authenticated user must already be a member of the project.

Users who are already members, do not exist, or already have a pending invitation are skipped.

---

## `GET /api/invitations/received`

Returns invitations received by the authenticated user.

**Authentication:** Required

**Body:** None

---

## `GET /api/invitations/sent`

Returns invitations sent by the authenticated user.

**Authentication:** Required

**Body:** None

---

## `PATCH /api/invitations/:invitationId`

Accepts or rejects a received invitation.

**Authentication:** Required

### Request Body

```json
{
  "status": "accepted"
}
```

Valid statuses:

- `accepted`
- `rejected`

When an invitation is accepted, the receiver is added to the project's `members` array.

When an invitation is rejected, the project membership remains unchanged.

---

# Notifications

Notifications are created for important invitation events.

All notification endpoints require authentication.

## `GET /api/notifications`

Returns notifications belonging to the authenticated user.

**Authentication:** Required

**Body:** None

Notifications are returned with the newest notifications first.

---

## `PATCH /api/notifications/:notificationId/read`

Marks a notification as read.

**Authentication:** Required

**Body:** None

---

## `PATCH /api/notifications/read-all`

Marks all unread notifications belonging to the authenticated user as read.

**Authentication:** Required

**Body:** None

---

## `DELETE /api/notifications/:notificationId`

Deletes a notification belonging to the authenticated user.

**Authentication:** Required

**Body:** None

### Success Response

`204 No Content`

---

# Validation and Error Handling

The API uses `express-validator` to validate incoming request data.

Validation errors return a `400 Bad Request` response.

Example:

```json
{
  "message": "Validation failed",
  "success": false,
  "errors": [
    "title is required and must be a non-empty string"
  ]
}
```

The API also handles:

- `400` — Invalid request data
- `401` — Missing or invalid authentication
- `403` — Authenticated user does not have permission
- `404` — Resource or route not found
- `500` — Unexpected server errors

Unknown routes are handled by centralized 404 middleware, while unexpected errors are handled by centralized error middleware.

Successful responses generally include:

```json
{
  "success": true
}
```

along with an appropriate message and the requested resource or collection.

Passwords are removed from user responses.

---

# Project Structure

```text
.
├── server.js
├── package.json
└── src/
    ├── app.js
    ├── config.js
    ├── mockData.js
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
    ├── routes/
    │   ├── authRoutes.js
    │   ├── invitationRoutes.js
    │   ├── notificationRoutes.js
    │   ├── projectRoutes.js
    │   ├── taskRoutes.js
    │   └── userRoutes.js
    │
    └── utils/
        └── sanitizeUser.js
```

---

# Running Locally

## Prerequisites

- Node.js
- npm

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key
```

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

---

# Environment Variables

The application currently requires the following environment variable:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret used to sign and verify JWT authentication tokens |

## `.env.example`

```env
JWT_SECRET=replace-with-a-long-random-secret
```

Never commit your actual `.env` file or real secrets to GitHub.

---

# Example Authentication Request

Register a user:

```bash
curl -i -c cookies.txt -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alex Morgan","email":"alex@example.com","password":"StrongPass1!","role":"Developer"}'
```

The authentication cookie can then be used for protected requests:

```bash
curl -i -b cookies.txt http://localhost:5000/api/auth/
```

---

# Example Project and Invitation Flow

Create a project:

```bash
curl -i -b cookies.txt -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign",
    "description": "Refresh the company website",
    "status": "inProgress",
    "dueDate": "Dec 15"
  }'
```

The creator is automatically added as a member.

After receiving the newly created `projectId`, teammates can be invited:

```bash
curl -i -b cookies.txt -X POST http://localhost:5000/api/invitations \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project-uuid",
    "userIds": ["user-uuid-1", "user-uuid-2"]
  }'
```

The invited users receive pending invitations and notifications.

---

# Current Data Model

The current implementation uses mock, in-memory arrays from `src/mockData.js` for:

- Users
- Projects
- Tasks
- Invitations
- Notifications

This means:

- Data is stored only while the server is running
- Data is lost when the server restarts
- No external database is currently used

Database integration will be introduced in the next task to make the data persistent.

---

# Task 2 Deliverables

- REST API implementation
- JWT authentication
- Request validation
- Centralized error handling
- Project and task CRUD APIs
- User management APIs
- Team invitation system
- Notification system
- API documentation
- GitHub repository
- Demo video

---

# Demo

Demo Video: **[Add demo video link here]**

---

# Future Improvements

- Integrate a persistent database
- Replace in-memory data with database models
- Add database relationships and references
- Improve authorization across project and task resources
- Add password hashing and stronger authentication security
- Add additional project and team management functionality
- Build the final AI-powered project and task management platform