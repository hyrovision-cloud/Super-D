# Responsive UX Fix Report

## Shared components changed

- `TopNav`: replaced mock notification state with authenticated API requests; profile and notification menus are mutually exclusive, close on outside click, Escape and route change, and use viewport-safe menu widths.
- `AppShell` and `MobileNav`: the top mobile menu button now opens the same controlled permission-aware drawer as the bottom navigation. The drawer closes on navigation, backdrop click and Escape, locks/restores body scroll safely, and has dialog semantics.
- `Modal` and `Drawer`: preserve the previous body overflow value, focus their close control on opening, expose dialog semantics and use viewport-based max heights/mobile padding.
- `Settings`: removed demo-data reset behavior and browser mock business configuration. It now has loading, permission-disabled, success and failure states backed by `/config/application`.

## Browser checks performed

| Viewport | Check | Result |
|---|---|---|
| Desktop default | Authenticated dashboard shell and API notification trigger | Passed |
| 390×844 | Profile popover opens and Escape closes it | Passed |
| 390×844 | Mobile navigation opens from top menu control | Passed |
| 390×844 | Selecting Settings closes the drawer after navigation | Passed |
| 390×844 | Settings form fits within the viewport and loads database configuration | Passed |

## Remaining responsive verification

The legacy mock-backed feature screens still need their own full 320–430px and desktop table/chart pass after those data flows are migrated. The audit identifies them individually. No global horizontal-overflow masking rule was introduced.
