# Database

MongoDB is the backend source of truth. The frontend must not connect to MongoDB or contain database credentials.

## Canonical relationships

Every branch-scoped collection stores one of these stable branch IDs: `branch-trichy`, `branch-chennai`, `branch-madurai`, or `branch-pudukkottai`. Names are display values, never relationship keys.

Persisted collections currently include branches, roles, users, patients, medical records, appointments, employees, attendance records, leave requests, complaints, income records, expenses, advertisements, leads, notifications, discharge summaries, and audit logs.

Unique deterministic keys include `branchId`, user email, employee number, UHID, appointment number, receipt number, expense number, campaign ID, lead number, leave request number, complaint ticket number, and medical record number.

The seed verifier rejects orphan branch references and requires all four canonical active branches.
