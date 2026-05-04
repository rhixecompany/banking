---
name: httpie
description: >
  Use this skill whenever the user wants to make HTTP requests, test APIs, call REST endpoints, debug web services, or interact with any HTTP/HTTPS API using the HTTPie CLI tool (`http` command). Trigger this skill for any request involving: sending GET/POST/PUT/PATCH/DELETE requests, testing API endpoints, sending JSON or form data, working with authentication (Bearer token, Basic auth), uploading files, downloading responses, managing sessions, inspecting request/response headers, or piping HTTP calls in shell scripts. Use this skill for debugging API authentication failures, testing integration endpoints, automating API calls in CI/CD pipelines, or inspecting HTTP headers. Use this skill even when the user just says "call the API", "send a request", "hit this endpoint", "test with httpie", or "debug my 401 error". Don't wait for explicit httpie mention.
---

# HTTPie CLI Skill

HTTPie is a modern, human-friendly HTTP client for the command line. The main command is `http` (or `https` for HTTPS-only).

## Installation

```bash
# pip (recommended)
pip install httpie

# brew (macOS)
brew install httpie

# apt (Debian/Ubuntu)
sudo apt install httpie
```

Verify: `http --version`

---

## Critical Mistakes to Avoid

These are learned-in-the-field patterns that prevent common failures:

### Request Body & Input Conflicts

**NEVER mix stdin body and key=value fields together:**

```bash
http POST url < body.json key=value  ❌ Fails: "body from stdin and key=value cannot be mixed"
http POST url < body.json             ✓ Correct
```

Why: HTTPie detects this conflict and raises an error. Use one or the other.

**NEVER forget `--ignore-stdin` in scripts (causes blocking):**

```bash
cat script.sh | http POST url name=test       ❌ Waits indefinitely for stdin input
http --ignore-stdin POST url name=test        ✓ Correct in CI/scripts
```

Why: Non-TTY stdin makes HTTPie wait indefinitely. Essential for pipelines and CI/CD.

### File Uploads & Form Data

**NEVER omit `-f` for file uploads (multipart is not implicit):**

```bash
http POST url file@photo.jpg              ❌ Interprets @ incorrectly
http -f POST url file@photo.jpg           ✓ Correct (triggers multipart/form-data)
```

Why: Without `-f`, separators are ambiguous. The `-f` flag enables form/multipart handling.

**NEVER forget Content-Type header for raw POST bodies:**

```bash
cat payload.json | http POST url          ❌ Missing content type
cat payload.json | http POST url Content-Type:application/json  ✓ Correct
```

Why: Servers may fail to parse without explicit content type header.

### Authentication & Security

**NEVER include API keys or tokens in URL query parameters:**

```bash
http GET "url?api_key=sk-abc123..."           ❌ Exposed in logs/history
http -A bearer -a "sk-abc123..." url          ✓ Use headers (private)
```

Why: Query params appear in shell history, browser history, logs, and proxy records. Headers stay private.

**NEVER use `--verify=no` in production (skips SSL verification):**

```bash
http --verify=no https://api.example.com      ❌ Man-in-the-middle vulnerability
http https://api.example.com                  ✓ Verify by default (or use --cert for client certs)
```

Why: Disables certificate validation. Only for local dev/testing.

### Shell & Scripting

**NEVER pipe unquoted shell variables (causes expansion issues):**

```bash
TOKEN="secret"; http POST url auth=$TOKEN          ❌ Breaks with special chars
TOKEN="secret"; http POST url auth="$TOKEN"        ✓ Quoted expansion
```

Why: Unquoted expansion fails with spaces, special characters, or quotes in the value.

**NEVER use `--offline` as final validation (doesn't catch all errors):**

```bash
http --offline POST url complex=data ...       ❌ Shows request but not actual HTTP behavior
http --offline --print=HhBb POST url ...       ✓ Inspect request and response separately
```

Why: Offline mode builds the request but doesn't reveal server response logic or actual parsing.

---

## Before You Send a Request

Ask yourself these questions (expert decision framework):

**1. What's the real goal?**

- **Testing an endpoint?** → Use `--offline` first to verify request shape
- **Debugging auth failure?** → Add `-v` to inspect request/response headers
- **Automating for CI?** → Add `--ignore-stdin`, `--check-status`, and `--pretty=none`

**2. Is authentication required?**

- **Basic auth (username/password)?** → `http -a username:password url`
- **Bearer token?** → `http -A bearer -a TOKEN url` or custom header `Authorization:Bearer TOKEN`
- **Custom header?** → `http url "Authorization:Custom ..."`
- **Multiple auth methods?** → Use sessions (`--session=myapi`)

**3. Could this fail and need debugging?**

- Add `-v` (verbose) during development to see full exchange
- Add `-h` first to inspect response headers before examining body
- Use `--check-status` to fail on 4xx/5xx instead of silently proceeding

**4. Is this running in CI/headless/non-TTY environment?**

- **Must use:** `--ignore-stdin` (prevents stdin blocking)
- **Should use:** `--check-status` (exit non-zero on errors)
- **Should use:** `--pretty=none` (remove ANSI colors)
- **Capture exit codes** for proper error handling in scripts

---

## Request Syntax

```
http [METHOD] URL [REQUEST_ITEMS...]
```

- **METHOD** is optional: defaults to `GET` when no data, `POST` when data is present
- **URL**: scheme defaults to `http://`; use `:3000` as shorthand for `localhost:3000`

---

## Request Items — Key Separators

| Separator | Type | Example |
| --- | --- | --- |
| `=` | JSON string field (or form field with `-f`) | `name=Jean` |
| `:=` | Raw JSON value (non-string) | `active:=true`, `count:=42`, `tags:='["a","b"]'` |
| `==` | URL query parameter | `search==httpie` |
| `:` | HTTP header | `Authorization:Bearer TOKEN` |
| `@` | File upload (form/multipart) | `file@./report.pdf` |
| `=@` | File content as string field | `body=@./message.txt` |
| `:=@` | File content as raw JSON | `config:=@./config.json` |

---

## Common Examples

### GET requests

```bash
# Simple GET
http GET https://api.example.com/users

# With query params (== for URL params)
http GET https://api.example.com/users search==alice limit==10
```

### POST with JSON (default)

```bash
# String fields (=) and non-string fields (:=)
http POST https://api.example.com/users \
  name="Jean-Jacques" \
  email="jj@example.com" \
  active:=true \
  roles:='["admin","user"]'
```

### Form data (`-f` flag required)

```bash
http -f POST https://api.example.com/login username=admin password=secret
```

### File upload (multipart, requires `-f`)

```bash
http -f POST https://api.example.com/upload file@./document.pdf title="My Doc"
```

---

## Authentication

```bash
# Basic auth
http -a username:password https://api.example.com/secure

# Bearer token
http -A bearer -a TOKEN https://api.example.com/secure

# Custom Authorization header
http https://api.example.com/secure "Authorization:Bearer $(cat token.txt)"
```

---

## Output Control

```bash
# Show full exchange (request + response)
http -v GET https://api.example.com/users

# Only response headers
http -h GET https://api.example.com/users

# Only response body
http -b GET https://api.example.com/users

# Check HTTP status (exit non-zero on 4xx/5xx)
http --check-status GET https://api.example.com/users
```

---

## Sessions (Persist cookies & auth)

```bash
# Create/use named session (stored in ~/.config/httpie/sessions/)
http --session=myapi POST https://api.example.com/login username=admin password=secret
http --session=myapi GET https://api.example.com/profile
```

---

## Useful Flags

```bash
--offline          # Build and print request without sending it (dry-run)
--follow           # Follow redirects
--timeout=10       # Set timeout in seconds (default: 0 = no timeout)
--check-status     # Exit non-zero on 4xx/5xx responses
--pretty=none      # Remove colors (for scripts/CI)
--ignore-stdin     # Don't wait for stdin (critical for scripts/pipelines)
--print=HhBb       # Print: H=request headers, B=request body, h=response headers, b=response body
```

---

## HTTPie vs curl vs Postman

**Use HTTPie when:**

- Quick interactive API testing (human-readable output)
- Testing auth workflows (clean syntax for headers/tokens)
- Debugging API responses (pretty-printed JSON by default)
- Working with sessions and cookies (persistent storage)

**Use curl when:**

- Shipping in production scripts (universal, lightweight)
- CI/CD with minimal dependencies
- Already in established shell scripts
- Need binary protocol support (HTTPie is HTTP-only)

**Use Postman when:**

- Team collaboration needed (shared collections)
- Building test suites (test runners, assertions)
- Monitoring endpoints (scheduled checks)
- Documenting APIs (collections as specs)

---

## Quick Tips

- **Always quote values with spaces**: `description='hello world'`
- **GCP/Cloud APIs**: `http -A bearer -a "$(gcloud auth print-access-token)" ...`
- **Pipe to jq for JSON manipulation**: `http GET url | jq '.users[0]'`
- **Debug with offline first**: `http --offline POST url ... | less` to verify request before sending
