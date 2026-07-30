# Backend API Documentation

---

# Module: Authentication

**Base URL**

```
/api/v1/auth
```

Authentication is implemented using **JWT Access Tokens** and **Refresh Tokens**.

- Access Token → Returned in the JSON response.
- Refresh Token → Stored in an HTTP-only cookie.
- Access Token is sent in the `Authorization` header for protected routes.
- Refresh Token is used only for generating a new Access Token.

---

## Authentication Flow

```
Register/Login
      │
      ▼
Generate Access Token + Refresh Token
      │
      ├──────────────► Access Token (JSON Response)
      │
      └──────────────► Refresh Token (HTTP-only Cookie)
                              │
                              ▼
                    POST /auth/refresh
                              │
                              ▼
               New Access Token + New Refresh Token
```

---

# 1. Register User

## Endpoint

```
POST /api/v1/auth/register
```

## Authentication Required

❌ No

## Rate Limit

- Maximum: **5 requests**
- Limiter: `registerLimiter`

## Headers

```
Content-Type: application/json
```

## Request Body

```json
{
  "name": "Priyanshu Sharma",
  "email": "priyanshu@example.com",
  "password": "Password123"
}
```

> Exact validation rules are defined in `registerSchema`.

## Controller

```
authController.register()
```

## Service

```
authService.register()
```

## Internal Flow

1. Validate request body.
2. Check if email already exists.
3. Hash password using bcrypt.
4. Create user.
5. Generate Access Token.
6. Generate Refresh Token.
7. Store hashed Refresh Token in MongoDB.
8. Log audit event (`USER_REGISTER`).
9. Set Refresh Token cookie.
10. Return Access Token and User.

## Success Response

**201 Created**

```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "...",
      "avatarUrl": "...",
      "createdAt": "..."
    },
    "accessToken": "JWT_ACCESS_TOKEN"
  }
}
```

## Cookie Set

```
refreshToken
```

Properties

- HttpOnly
- SameSite=Strict
- Secure (Production)
- Max Age: 7 Days
- Path: `/api/v1/auth`

## Possible Errors

| Status | Reason |
|---------|--------|
|400|Validation Failed|
|409|Email already exists|
|500|Internal Server Error|

## Database Operations

- Find User by Email
- Create User
- Store Refresh Token Hash

## Side Effects

- Audit Log Created
- Refresh Token Cookie Set

---

# 2. Login

## Endpoint

```
POST /api/v1/auth/login
```

## Authentication Required

❌ No

## Rate Limit

- Maximum: **5 requests**
- Limiter: `loginLimiter`

## Headers

```
Content-Type: application/json
```

## Request Body

```json
{
  "email": "priyanshu@example.com",
  "password": "Password123"
}
```

> Exact validation rules are defined in `loginSchema`.

## Controller

```
authController.login()
```

## Service

```
authService.login()
```

## Internal Flow

1. Validate request.
2. Find user by email.
3. Verify account is active.
4. Compare password using bcrypt.
5. Generate Access Token.
6. Generate Refresh Token.
7. Store hashed Refresh Token.
8. Log audit event (`USER_LOGIN`).
9. Set Refresh Token cookie.
10. Return Access Token and User.

## Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "...",
      "avatarUrl": "...",
      "createdAt": "..."
    },
    "accessToken": "JWT_ACCESS_TOKEN"
  }
}
```

## Cookie Set

```
refreshToken
```

## Possible Errors

| Status | Reason |
|---------|--------|
|400|Validation Failed|
|401|Invalid email or password|
|500|Internal Server Error|

## Database Operations

- Find User
- Update Refresh Token Hash

## Side Effects

- Audit Log Created
- Refresh Token Cookie Set

---

# 3. Refresh Access Token

## Endpoint

```
POST /api/v1/auth/refresh
```

## Authentication Required

❌ No

Authentication is performed using the **Refresh Token Cookie**, not the Access Token.

## Headers

No Authorization header required.

Cookie must contain:

```
refreshToken
```

## Controller

```
authController.refresh()
```

## Service

```
authService.refreshTokens()
```

## Internal Flow

1. Read Refresh Token from cookie.
2. Verify JWT.
3. Find user.
4. Compare hashed Refresh Token.
5. Detect replay attacks.
6. Generate new Access Token.
7. Generate new Refresh Token.
8. Replace stored Refresh Token hash.
9. Replace Refresh Token cookie.

## Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN"
  }
}
```

## Cookie Updated

```
refreshToken
```

## Possible Errors

| Status | Reason |
|---------|--------|
|401|Refresh Token Missing|
|401|Invalid or Expired Refresh Token|
|401|Session Expired|
|401|Refresh Token Reuse Detected|

## Database Operations

- Find User
- Compare Refresh Token Hash
- Update Refresh Token Hash

## Side Effects

- Refresh Token Rotation
- Replay Attack Detection

---

# 4. Logout

## Endpoint

```
POST /api/v1/auth/logout
```

## Authentication Required

✅ Yes

## Headers

```
Authorization: Bearer <Access Token>
```

## Controller

```
authController.logout()
```

## Service

```
authService.logout()
```

## Internal Flow

1. Verify Access Token.
2. Read `req.user`.
3. Remove stored Refresh Token hash.
4. Create audit log.
5. Clear Refresh Token cookie.

## Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Logged out"
}
```

## Cookie Cleared

```
refreshToken
```

## Possible Errors

| Status | Reason |
|---------|--------|
|401|Access Token Missing|
|401|Invalid or Expired Access Token|

## Database Operations

- Clear Refresh Token Hash

## Side Effects

- Audit Log Created
- Refresh Token Cookie Removed

---

# 5. Get Current User

## Endpoint

```
GET /api/v1/auth/me
```

## Authentication Required

✅ Yes

## Headers

```
Authorization: Bearer <Access Token>
```

## Controller

```
authController.getCurrentUser()
```

## Service

No service call.

Returns `req.user` populated by the authentication middleware.

## Internal Flow

1. Verify Access Token.
2. Decode JWT.
3. Populate `req.user`.
4. Return authenticated user.

## Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Current user",
  "data": {
    "user": {
      "id": "...",
      "role": "..."
    }
  }
}
```

## Possible Errors

| Status | Reason |
|---------|--------|
|401|Access Token Missing|
|401|Invalid or Expired Access Token|

## Database Operations

None

## Side Effects

None

---

# Security Features

- JWT Authentication
- Access Token + Refresh Token Architecture
- HTTP-only Refresh Token Cookie
- Refresh Token Rotation
- Refresh Token Hashing
- Password Hashing (bcrypt)
- Replay Attack Protection
- Audit Logging
- Generic Login Error (Prevents Email Enumeration)
- Thin Controllers
- Layered Architecture (Route → Controller → Service → Repository) 



# User Module

## Overview

The User module is responsible for authenticated user account management and administrative user management.

It provides functionality for:

- Viewing the authenticated user's profile.
- Updating profile information.
- Changing account password.
- Listing all users (Admin only).
- Viewing any user's profile (Admin only).
- Updating user roles (Admin only).
- Activating and deactivating user accounts (Admin only).

The module is protected using JWT authentication and Role-Based Access Control (RBAC).

---

## Route Structure

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/users/me` | Authenticated User |
| PATCH | `/users/me` | Authenticated User |
| PATCH | `/users/me/password` | Authenticated User |
| GET | `/users` | Admin |
| GET | `/users/:id` | Admin |
| PATCH | `/users/:id/role` | Admin |
| PATCH | `/users/:id/deactivate` | Admin |
| PATCH | `/users/:id/activate` | Admin |

---

## Authentication

All User module routes require a valid JWT access token.

Protected routes use the `authenticate` middleware, which:

- Extracts the Bearer token from the Authorization header.
- Verifies the JWT.
- Loads the authenticated user.
- Attaches the user object to `req.user`.

Example:

Authorization: Bearer <access_token>

---

## Authorization

Administrative routes additionally use the `authorize()` middleware.

Only users with the **ADMIN** role can:

- List all users
- View any user by ID
- Update user roles
- Activate users
- Deactivate users

Regular authenticated users can only manage their own account.

---

## Validation

Incoming requests are validated using Zod schemas through the global validation middleware.

Validation is applied before controller execution.

Current validation schemas:

- `updateProfileSchema`
- `changePasswordSchema`
- `updateRoleSchema`
- `listUsersQuerySchema`

If validation fails, the request is rejected with a validation error before reaching the controller.

---

## Middleware Flow

### Self-Service Routes

Request

↓

authenticate

↓

validate (if required)

↓

controller

↓

response

---

### Admin Routes

Request

↓

authenticate

↓

authorize(ADMIN)

↓

validate (if required)

↓

controller

↓

response

---

## Security Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Request Validation using Zod
- Protected Self-Service Endpoints
- Protected Administrative Operations
- Separation of User and Admin Responsibilities

---

## Route Responsibilities

### Self-Service

Authenticated users can:

- View their own profile.
- Update profile information.
- Change their password.

These endpoints never allow modification of another user's account.

---

### Administrative Operations

Administrators can:

- Retrieve all users.
- Retrieve any individual user.
- Promote or demote user roles.
- Activate accounts.
- Deactivate accounts.

These operations are restricted to users with the ADMIN role.





# Document Module

## Overview

The Document module is responsible for managing the complete lifecycle of documents in the application. It handles uploading files, storing document metadata, managing permissions, generating secure download links, sharing documents, listing collaborators, and deleting documents. Unlike the User module, a document exists in multiple systems simultaneously—MongoDB stores its metadata while MinIO stores the actual file.

---

## Architecture

```
                   Client
                      │
                      ▼
             HTTP Request
                      │
                      ▼
             Document Routes
                      │
      ┌───────────────┼────────────────┐
      │               │                │
Authenticate     Validation      Upload Middleware
      │                                │
      ▼                                ▼
            document.controller.js
                      │
                      ▼
             document.service.js
                      │
      ┌───────────────┼─────────────────────────────────────┐
      │               │                │          │         │
      ▼               ▼                ▼          ▼         ▼
 MongoDB          MinIO Storage   Permission   Audit    Notification
                                    Module     Module     Module
      │
      ▼
 Queue (Background Processing)
      │
      ▼
 WebSocket Events
```

The controller acts only as a bridge between the HTTP layer and the service layer. All business logic resides inside the service.

---

# Layer Responsibilities

## Routes

The route defines:

- Authentication requirements
- Permission requirements
- Validation middleware
- Upload middleware
- Controller to execute

Example:

```
POST /documents
        │
authenticate
        │
uploadSingleFile
        │
controller.upload
```

---

## Controller

The controller is intentionally thin.

Its responsibility is only to:

- Receive request data
- Call the appropriate service
- Return a standardized API response

It does **not**:

- Upload files
- Access MongoDB
- Generate storage keys
- Manage permissions
- Write audit logs

Those responsibilities belong to the service layer.

---

## Service

The service contains all business logic.

It is responsible for:

- Uploading files to MinIO
- Creating MongoDB records
- Creating owner permissions
- Generating presigned download URLs
- Sharing documents
- Writing audit logs
- Sending notifications
- Triggering background jobs
- Emitting WebSocket events

---

# Document Upload Flow

Uploading a document involves several systems working together.

```
Client uploads file
        │
        ▼
Multer validates file
        │
        ▼
File stored temporarily in memory
        │
        ▼
Generate unique storage key
        │
        ▼
Upload file to MinIO
        │
        ▼
Create document metadata in MongoDB
        │
        ▼
Create OWNER permission
        │
        ▼
Create audit log
        │
        ▼
Enqueue background processing job
        │
        ▼
Emit WebSocket activity
        │
        ▼
Return response to client
```

---

# Why MinIO?

The application does **not** store uploaded files inside MongoDB.

Instead:

- MinIO stores the actual file.
- MongoDB stores only metadata.

For example:

### Stored in MinIO

- PDF
- DOCX
- PNG
- CSV

### Stored in MongoDB

- Owner
- Original filename
- Display name
- MIME type
- File size
- Storage key
- Status
- Version
- Tags
- Created date
- Updated date

This keeps the database lightweight while allowing efficient file storage.

---

# Why Multer Memory Storage?

The upload middleware uses:

```javascript
multer.memoryStorage()
```

Flow:

```
Client
   │
   ▼
RAM Buffer
   │
   ▼
MinIO
```

The uploaded file is never written to the server's local filesystem.

Advantages:

- Faster uploads
- No temporary files
- No cleanup required
- Ideal for object storage systems like MinIO

---

# Storage Key

The filename uploaded by the user is **not** used directly as the storage path.

Example:

User uploads:

```
invoice.pdf
```

Internally MinIO may store:

```
documents/42/9af73e0d.pdf
```

The generated storage key:

- is unique
- prevents filename collisions
- is never exposed to clients

Clients only receive:

- originalName
- displayName

---

# Document Metadata

Every uploaded document has metadata stored in MongoDB.

Metadata includes:

- Owner ID
- Original filename
- Display name
- MIME type
- File size
- Document status
- Version
- Tags
- Timestamps

The actual file contents remain inside MinIO.

---

# Document Status

Immediately after upload the document status is:

```
PROCESSING
```

It is **not** immediately marked as READY.

Reason:

After upload, a background worker may perform additional operations such as:

- Text extraction
- Thumbnail generation
- Virus scanning
- AI processing
- Indexing
- Metadata extraction

Only after processing finishes should the status become READY.

---

# Permission Model

Every uploaded document automatically receives an OWNER permission.

```
Owner
   │
   ▼
Permission Collection
```

The owner can later share the document with other users.

Allowed access levels:

- OWNER
- EDITOR
- VIEWER

However, only one OWNER exists.

The Share API allows granting only:

- EDITOR
- VIEWER

OWNER permissions cannot be granted through the API.

---

# Why a Separate Permission Collection?

Instead of storing collaborators inside the document itself, permissions are stored in a separate collection.

Advantages:

- Supports many collaborators
- Easier permission management
- Better scalability
- Faster permission queries
- Cleaner document schema

---

# Secure Downloads

The server does not directly send file contents.

Instead:

```
Client
   │
GET /documents/:id/download
   │
   ▼
Generate Presigned URL
   │
   ▼
Return URL
   │
   ▼
Client downloads directly from MinIO
```

Benefits:

- Lower server load
- Better scalability
- Temporary access only
- Improved security

---

# Soft Delete

Deleting a document does not immediately remove it permanently.

Instead, the service performs a soft delete.

Benefits:

- Recovery is possible
- Audit history is preserved
- Background cleanup jobs can remove files later
- Prevents accidental permanent deletion

---

# Audit Logging

Every important document action creates an audit record.

Examples:

- Upload
- Rename
- Download
- Delete

Audit logs help with:

- Security investigations
- Compliance
- User activity tracking
- Debugging

---

# Notifications

When a document is shared, the recipient receives a notification.

Flow:

```
Owner
   │
Share Document
   │
   ▼
Notification Module
   │
   ▼
Recipient
```

---

# WebSocket Events

Some document actions also generate real-time events.

Examples:

- Document uploaded
- Document shared

These events allow connected clients to update their UI instantly without refreshing the page.

---

# Responsibilities of the Document Module

The Document module is responsible for:

- Uploading documents
- Storing files in MinIO
- Managing document metadata
- Managing permissions
- Generating secure download links
- Sharing documents
- Listing collaborators
- Soft deleting documents
- Writing audit logs
- Sending notifications
- Triggering background processing jobs
- Emitting real-time WebSocket events