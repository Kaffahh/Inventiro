## Summary

Merge `feature/user-management` into `develop`.

This PR includes:
- Full user management CRUD (backend + Inertia React frontend)
- Audit model + migration and audit writes on user actions
- User policy and authorization
- Frontend validation and UX improvements
- Staff page and role-based navigation updates
- CI workflow for tests and frontend build

## Database changes
- Adds `audits` table (see `database/migrations/2026_05_22_000001_create_audits_table.php`). Run migrations before deploying.

## QA / Review checklist
- [ ] Run `composer install` and `npm ci`
- [ ] Run migrations: `php artisan migrate` (or `migrate --seed` for local)
- [ ] Run tests: `php artisan test`
- [ ] Build frontend: `npm run build`
- [ ] Verify `Manajemen User` sidebar navigates to Users page and is visible to `admin` only
- [ ] Verify audit records for create/update/delete (check `audits` table)

## Style & Quality
- Ran `./vendor/bin/pint` and auto-fixed PHP style issues.
- CI added to run migrations, tests and frontend build.

## Notes
- There are deprecation warnings about `PDO::MYSQL_ATTR_SSL_CA` in `config/database.php` (PHP 8.5). Consider updating to `Pdo\Mysql::ATTR_SSL_CA` to silence warnings.

---
Paste this body when creating the PR on GitHub and mark it as draft if you want additional checks.
