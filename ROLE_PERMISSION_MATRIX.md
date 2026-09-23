# Role Permission Matrix

Generated from the seeded MongoDB role definitions on 2026-09-24. Permission names use the existing singular `module.action` convention. A dash means the permission is not assigned.

| Role | Module | View | Create | Update | Delete / close | Approve / special actions | Branch scope |
|---|---|---:|---:|---:|---:|---|---|
| Hospital Owner | Organization dashboard | yes | - | - | - | `dashboard.owner.view`, `organization.view` | Organization |
| Hospital Owner | Patients and clinical | yes | yes | yes | yes | medical records, discharge | Organization |
| Hospital Owner | Appointments | yes | yes | yes | cancel | - | Organization |
| Hospital Owner | Workforce and leave | yes | yes | yes | employee delete | attendance manage, leave approve/reject | Organization |
| Hospital Owner | Complaints | yes | yes | yes | close | assign, resolve, confidential | Organization |
| Hospital Owner | Finance | yes | yes | yes | expense delete | reports | Organization |
| Hospital Owner | Marketing and leads | yes | yes | yes | - | advertisements and leads | Organization |
| Hospital Owner | Users and roles | yes | yes | yes | user delete | role assign | Organization |
| Super Admin | All seeded modules | yes | yes | yes | permitted where defined | owner dashboard, organization, role assignment | Organization |
| Global Admin | Clinical and operations | yes | yes | yes | appointment cancel | medical, attendance, leave, complaints | Organization |
| Global Admin | Users and roles | yes | yes | yes | - | role assignment | Organization |
| Global Admin | Owner finance/marketing dashboard | no | no | no | no | explicitly excluded | Organization metadata only |
| Branch Manager | Patients and appointments | yes | no | no | no | discharge | Assigned branches |
| Branch Manager | Employees, attendance, leave | yes | no | no | no | leave approve/reject | Assigned branches |
| Branch Manager | Revenue and expenses | yes | no | no | no | income reports | Assigned branches |
| Doctor / Branch Doctor | Patients and medical records | yes | medical record | no | no | discharge | Assigned branches |
| Doctor / Branch Doctor | Appointments | yes | no | no | no | - | Assigned branches / assigned workflows |
| Doctor / Branch Doctor | Self service | attendance mark, leave view | leave request | no | no | - | Own/assigned branch |
| HR / HR Manager | Employees and attendance | yes | employee create | attendance manage | no | - | Assigned branches |
| HR / HR Manager | Leave and grievances | yes | leave request | no | no | leave approve/reject | Assigned branches |
| Finance Manager | Revenue and expenses | yes | yes | yes | no | reports and income | Assigned branches |
| Finance Manager | Clinical | no | no | no | no | discharge only | Assigned branches |
| Marketing Manager | Marketing, advertisements, leads | yes | ads/leads | ads/leads | no | reports | Assigned branches |
| Complaints and Query Manager | Complaints and grievances | yes | complaint | complaint | close | assign and resolve | Assigned branches |
| Receptionist | Patients and appointments | yes | appointment | no | no | discharge | Assigned branches |
| Staff | Appointments, patients, ads | yes | no | no | no | discharge | Assigned branches |
| Staff | Revenue and expenses | yes | yes | yes | no | - | Assigned branches |
| Employee | Self service | leave | leave request | no | no | attendance mark, grievance submit | Own/assigned branch |

All roles also receive `dashboard.view`, `notification.view`, `settings.view`, and scoped `branch.view` for normal application navigation. Those permissions do not grant branch administration; `/branches` requires `branch.manage`.
