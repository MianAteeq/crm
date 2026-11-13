# Users, roles, and permissions

- **Super Admin → System Users** (`/admin/users`): add/edit accounts, assign a workspace and role, reset passwords, block or delete accounts, and search/filter users.
- **Super Admin → Roles & Permissions** (`/admin/roles`): create custom roles and choose View/Manage permissions per module. Changes apply to everyone assigned that role. Roles are shared across workspaces and editable only by Super Admins.
- **Workspace → Users & Access** (`/settings/users`): manage teammates within the signed-in user's workspace. A manager can only assign roles and edit users whose permissions are within their own access.

Each user has one role. Manage includes View. The Super Admin and Administrator roles are protected; Agent and User permissions can be edited. Built-in roles cannot be deleted, and custom roles must be unassigned before deletion. Workspace owners and the current account cannot be deleted, blocked, moved, or demoted through user management.

Default roles:

| Role | Access |
| --- | --- |
| Super Admin | Full platform and workspace access |
| Administrator | Full access within their workspace |
| Agent | Dashboard, contacts, conversations, and WhatsApp template viewing |
| User | Dashboard and contact viewing |

Passwords require at least eight characters. Blocking a user or resetting their password revokes their API tokens. User forms do not send invitation emails; share initial credentials securely.

## Backend setup

From `zappify-backend/zappify-backend`, run:

```sh
php artisan migrate --path=database/migrations/2026_11_13_000000_create_roles_table.php
```

This migration has already been applied to the local database. Deploy both frontend and backend together. Restart running queue workers on deployment: realtime events now use private `tenant.{id}.inbox` and `tenant.{id}.campaigns` channels, with workspace and permission checks at subscription time.

API requests check current permissions on every request. The frontend refreshes role permissions when the window gains focus and every minute. Navigation and direct page access respect these permissions. Notifications and search omit modules the user cannot view.

## Verification

```sh
# Backend: isolated in-memory SQLite; does not alter the application database
php vendor/bin/phpunit tests/Feature/AccessManagementTest.php

# Frontend
npm run build
npm run lint
```

The access test suite covers authentication, user creation, validation, role management, tenant isolation, privilege escalation, account protection, token revocation, realtime channel access, and registration permissions. The production build passes. The full TypeScript check currently reports existing errors in contacts, email campaigns/templates, sending domains, and the scraper.
