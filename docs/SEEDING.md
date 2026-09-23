# Development seeding

Use only a development MongoDB database.

```powershell
npm run seed
npm run seed:verify
```

The seed uses upserts keyed by stable identifiers. Re-running it updates the same records and does not duplicate seeded records. It never resets or deletes the database.

Verified deterministic counts on 2026-09-24 were: 4 branches, 23 patients, 18 employees, 23 appointments, 126 attendance records, 4 leave requests, 4 complaints, 32 seeded income records, 16 expenses, 4 advertisements, 12 leads, 23 medical records, and 7 notifications. Counts can be higher if users have created additional records; the seed verifier checks integrity rather than deleting user-created development data.

There is intentionally no automatic `seed:reset`. A destructive reset must be explicitly designed with a development-only guard before it is introduced.
