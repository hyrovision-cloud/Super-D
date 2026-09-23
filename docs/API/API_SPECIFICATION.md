# REST API Specification (v1)
**Hospital Management & Administration Platform (Super D)**
*Base URL: `/api/v1`*

---

## 1. Standard Response Formats

### 1.1 Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully.",
  "meta": {
    "total": 120,
    "page": 1,
    "pageSize": 20,
    "totalPages": 6,
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 1.2 Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      { "field": "phone", "message": "Valid 10-digit phone number is required" }
    ],
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## 2. Core API Endpoints

### 2.1 System Health
- **Endpoint**: `GET /health` (or `GET /api/v1/health`)
- **Authentication**: None (Public)
- **Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "hospital-management-backend",
    "version": "1.0.0",
    "environment": "development",
    "database": { "connected": true, "type": "MongoDB Atlas" },
    "uptime": "1420s",
    "timestamp": "2026-09-23T11:15:00.000Z"
  }
}
```

### 2.2 Authentication & Session
- `POST /api/v1/auth/login`
  - **Payload**: `{ "email": "doctor@superd.demo", "password": "..." }`
  - **Response**: `{ "token": "...", "user": { "_id": "...", "name": "...", "role": "..." } }`
- `POST /api/v1/auth/logout`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: `{ "loggedOut": true }`
- `GET /api/v1/auth/me`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Current authenticated user session with roles, branch scope, and permissions.

### 2.3 Branch Network
- `GET /api/v1/branches`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Array of 4 configured branches (Trichy, Chennai, Madurai, Pudukkottai).
- `GET /api/v1/branches/:id`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Single branch details, department list, bed capacity.

### 2.4 Patient Operations & EMR
- `GET /api/v1/patients`
  - **Headers**: `Authorization: Bearer <token>`, optional `X-Branch-Context: branch-trichy`
  - **Query Params**: `?page=1&pageSize=20&search=John&status=ACTIVE`
  - **Permissions Required**: `patient.view`
  - **Response**: Paginated list of branch-scoped patient profiles.
- `POST /api/v1/patients`
  - **Headers**: `Authorization: Bearer <token>`
  - **Permissions Required**: `patient.create`
  - **Payload**: Name, age, gender, phone, email, bloodGroup, branchId, emergencyContact.
  - **Response**: Newly created patient record with auto-generated UHID (`UHID-TRY-2026-XXXX`).
- `GET /api/v1/patients/:patientId`
  - **Permissions Required**: `patient.view` (Enforces branch scope; prevents IDOR).
  - **Response**: Complete patient profile and clinical history.
- `GET /api/v1/patients/:patientId/records`
  - **Permissions Required**: `medical_record.view`
  - **Response**: Doctor consultation records, prescriptions, diagnosis history.
