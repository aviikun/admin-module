# Login Database Schema

This document defines the MySQL schema and server-side validation contract for the Satark Drishti portal login. It is an integration specification only; the application currently uses demo-only local sign-in and is not connected to a database.

## Database

- Engine: MySQL 8.0+
- Storage engine: InnoDB
- Character set: `utf8mb4`
- Store and compare all timestamps in UTC.

## Tables

### `portal_roles`

Defines the roles selectable or assigned to portal users. Store stable role codes in the database and use display names in the UI.

| Column | Type | Rules | Purpose |
| --- | --- | --- | --- |
| `role_id` | `SMALLINT UNSIGNED` | Primary key, auto increment | Internal role identifier |
| `role_code` | `VARCHAR(50)` | Required, unique | Stable application value |
| `display_name` | `VARCHAR(100)` | Required | Human-readable role label |
| `created_at` | `DATETIME(6)` | Required, UTC | Creation time |

Role code and display-name mappings matching the current portal UI:

| `role_code` | `display_name` |
| --- | --- |
| `authority_officer` | `Authority Officer` |
| `auditor` | `Auditor` |
| `administrator` | `Administrator` |

### `portal_users`

Stores login identities and password hashes. Never store plaintext passwords.

| Column | Type | Rules | Purpose |
| --- | --- | --- | --- |
| `user_id` | `BIGINT UNSIGNED` | Primary key, auto increment | User identifier |
| `email` | `VARCHAR(254)` | Required, unique | Normalized login email |
| `password_hash` | `VARCHAR(255)` | Required | Argon2id or bcrypt encoded hash |
| `role_id` | `SMALLINT UNSIGNED` | Required, foreign key to `portal_roles.role_id` | User's assigned role |
| `is_active` | `BOOLEAN` | Required, default `TRUE` | Allows administrators to disable access |
| `created_at` | `DATETIME(6)` | Required, UTC | Account creation time |
| `updated_at` | `DATETIME(6)` | Required, UTC | Last account update time |

Normalize email addresses (at minimum trim whitespace and lowercase) before insert and lookup. Enforce uniqueness in the database as well as in application validation.

### `portal_sessions`

Stores the server-side record for each authenticated browser session. The browser receives a random opaque token; the database stores only its SHA-256 hash.

| Column | Type | Rules | Purpose |
| --- | --- | --- | --- |
| `token_hash` | `CHAR(64)` | Primary key | Lowercase hexadecimal SHA-256 hash of the random session token |
| `user_id` | `BIGINT UNSIGNED` | Required, foreign key to `portal_users.user_id` | Session owner |
| `created_at` | `DATETIME(6)` | Required, UTC | Session creation time |
| `expires_at` | `DATETIME(6)` | Required, UTC | Fixed expiry, five minutes after creation |
| `revoked_at` | `DATETIME(6)` | Nullable, UTC | Set on logout or administrative revocation |

The user's current role is resolved through `portal_users.role_id` and `portal_roles` during validation. Do not trust a role supplied by the browser or persist a client-editable role as authorization state.

## MySQL DDL

```sql
CREATE TABLE portal_roles (
  role_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_code VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (role_id),
  UNIQUE KEY uq_portal_roles_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE portal_users (
  user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  role_id SMALLINT UNSIGNED NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
    ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_portal_users_email (email),
  KEY ix_portal_users_role_id (role_id),
  CONSTRAINT fk_portal_users_role
    FOREIGN KEY (role_id) REFERENCES portal_roles (role_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE portal_sessions (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  expires_at DATETIME(6) NOT NULL,
  revoked_at DATETIME(6) NULL,
  PRIMARY KEY (token_hash),
  KEY ix_portal_sessions_user_id (user_id),
  KEY ix_portal_sessions_expires_at (expires_at),
  CONSTRAINT fk_portal_sessions_user
    FOREIGN KEY (user_id) REFERENCES portal_users (user_id)
    ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO portal_roles (role_code, display_name) VALUES
  ('authority_officer', 'Authority Officer'),
  ('auditor', 'Auditor'),
  ('administrator', 'Administrator');
```

## Login and Session Contract

1. Accept an email and password over HTTPS. Normalize the email before lookup.
2. Find the matching active user and verify the submitted password against `password_hash` using a maintained Argon2id or bcrypt implementation. Return a generic invalid-credentials error for an unknown email, inactive account, or incorrect password.
3. Generate a cryptographically random session token with at least 256 bits of entropy. Insert its SHA-256 hex digest into `portal_sessions` with `expires_at` set to five minutes after creation.
4. Return the raw token only in an `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` cookie with a five-minute `Max-Age`. Never put the token or password in `localStorage`.
5. On every protected page request, hash the cookie token and validate the matching session row: `revoked_at IS NULL`, `expires_at > UTC_TIMESTAMP(6)`, and the associated user is active. Join `portal_users` to `portal_roles` to obtain the authoritative role. Missing or invalid sessions must redirect to `/login`.
6. On logout, set `revoked_at` for the current session and clear the cookie. Expired session rows may be periodically deleted using `expires_at`.

The five-minute lifetime is fixed from login time; refreshing or navigating does not extend it unless the product requirement is explicitly changed.

## Team Integration Checklist

- Configure the application server's MySQL connection string as a deployment secret (for example, `DATABASE_URL`); do not commit credentials.
- Apply the DDL as a versioned database migration and seed the three role rows once.
- Create initial accounts through a trusted administrative provisioning process that hashes passwords before insertion; do not add public self-registration unless separately required.
- Add server-side login, session validation, and logout handlers. The browser must not choose its own effective role.
- Configure HTTPS in deployed environments so the session cookie can use the `Secure` attribute.
