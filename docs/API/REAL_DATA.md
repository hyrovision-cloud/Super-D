# Real data API surface

All endpoints are under `/api/v1`, require the existing cookie session unless stated otherwise, and return `{ success, data, message?, meta? }` or `{ success: false, error }`.

## Resources

- `/auth/login`, `/auth/me`, `/auth/logout`
- `/branches`, `/branches/:id`, `/branches/comparison`
- `/patients`, `/patients/:patientId`, `/patients/:patientId/records`, `/patients/:patientId/medical-records`
- `/appointments`
- `/employees`
- `/doctors`
- `/attendance`
- `/leave-requests`
- `/complaints`
- `/revenue`
- `/expenses`
- `/advertisements`
- `/leads`
- `/notifications`
- `/dashboard/finance/summary`
- `/dashboard/owner/summary`
- `/dashboard/owner/branches`

Collection endpoints accept authorized `branchId`, `page`, `limit`, `search`, and applicable status/category/date filters. Pagination metadata is returned in `meta`.

Every protected resource applies authentication, permission checks, and branch scoping. Organization dashboard endpoints additionally require an organization-wide role.
