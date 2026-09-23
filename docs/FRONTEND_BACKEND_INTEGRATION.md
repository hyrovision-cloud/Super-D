# Frontend-backend integration

The browser uses the centralized client in `frontend/src/services/api/httpClient.ts`. It sends the HttpOnly session cookie with `credentials: include` and handles standard backend errors.

The selected branch stored under `superd_selected_branch` is only a UI preference. It is sent as `X-Branch-Context`; the backend validates it against the authenticated user's assigned branches on every scoped route.

Authentication is `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, and `POST /api/v1/auth/logout`. Identity, roles, permissions, and assigned branches come from the backend session. Client role switching cannot elevate authority.

Migrated frontend sources: authentication provider, branch provider, patient list/registration service, and finance records/summary service. Other views still listed in `REAL_DATA_MIGRATION_REPORT.md` remain on the legacy compatibility store and must not be considered production-complete.

Every newly migrated screen must expose loading, empty, error, and success states and must never show seed arrays as an API failure fallback.
