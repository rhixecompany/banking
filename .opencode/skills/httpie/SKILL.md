---
name: httpie
description: "CLI HTTP client for APIs. Use for REST requests, debugging services, testing endpoints, auth (Bearer/Basic), file uploads. Keywords: REST, API, curl, bearer, POST, GET, DELETE, multipart, JSON, debug, test, debug-401, debug-429, SSL-error, timeout."
---

# HTTPie CLI — Expert Patterns

**NEVER** ignore these mistakes that cause silent failures:

### RequestConflicts

```bash
# NEVER mix stdin + fields
http POST url < body.json key=value  ❌
http POST url < body.json         ✓

# NEVER skip --ignore-stdin in scripts
cat s.sh | http POST url n=test ❌
http --ignore-stdin POST url n=test ✓
```

### FileUploads

```bash
# NEVER forget -f flag
http POST url file@x.jpg            ❌
http -f POST url file@x.jpg         ✓

# NEVER skip Content-Type
cat j.json | http POST url           ❌
cat j.json | http POST url Content-Type:application/json ✓
```

### Security

```bash
# NEVER put API keys in URL
http GET "url?key=sk-abc"         ❌ (exposed in logs)
http -A bearer -a "sk-abc" url   ✓

# NEVER --verify=no in prod
http --verify=no url              ❌ (MITM risk)
```

---

## Error Decision Tree

| If... | Then... |
| --- | --- |
| **401 Unauthorized** | Check `-A bearer` syntax; verify token not expired; try `Authorization:` header directly |
| **429 Too Many Requests** | Add `--retry 3 --retry-delay 5` or server-side rate limit |
| **SSL verification failed** | Dev only: `--verify=no`; Prod: Install cert with `--cert` |
| **Connection timeout** | Add `--timeout=30`; check firewall/network |
| **Empty response** | Use `-v` to see full exchange; check `Content-Type` header |

---

## Decision Framework

**Before request:**

1. **Goal?**
   - Test → `--offline` first to verify shape
   - Debug → `-v` for full exchange
   - CI → `--ignore-stdin --check-status --pretty=none`

2. **Auth?**
   - Basic: `-a user:pass`
   - Bearer: `-A bearer -a TOKEN`
   - Session: `--session=name`

3. **Environment?**
   - CI/headless: MUST use `--ignore-stdin`
   - Capture exit codes

---

## Quick Reference

```bash
# Separators
name=value        # JSON field
name:=true        # JSON boolean/number
name==query       # URL param
Authorization:Header  # HTTP header

# Common
http GET url
http POST url key=value
http -f POST url file@x.jpg title=Doc
http -A bearer -a TOKEN url

# Flags
--ignore-stdin   # Script/Must use in CI
--check-status   # Exit on 4xx/5xx
--offline        # Dry-run, verify first
-v               # Verbose debug
-h               # Headers only
-b               # Body only
--timeout=10     # Timeout
```

---

## Common Examples

```bash
# GET with query
http GET api.com/users q==alice limit==10

# POST JSON
http POST api.com/users name=Jean active:=true

# Form upload
http -f POST api.com/upload file@doc.pdf

# Bearer auth
http -A bearer -a "$(cat token.txt)" api.com/me

# Debug first
http -v --offline POST api.com/data key=value | less
```

---

## HTTPie vs curl vs Postman

| Tool        | Best For                                         |
| ----------- | ------------------------------------------------ |
| **HTTPie**  | Interactive testing, auth debugging, pretty JSON |
| **curl**    | Scripts, minimal deps, production                |
| **Postman** | Team collaboration, collections                  |

---

## Anti-Patterns

- **NEVER** omit `-f` for file uploads
- **NEVER** skip `--ignore-stdin` in CI scripts
- **NEVER** use `--verify=no` in production
- **NEVER** include tokens in query params
- **NEVER** use `--offline` as final validation
