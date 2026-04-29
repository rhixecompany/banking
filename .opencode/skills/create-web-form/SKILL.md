---
name: create-web-form
description: 'Create robust, accessible web forms with best practices for HTML structure, CSS styling, JavaScript interactivity, form validation, and server-side processing. Use when asked to "create a form", "build a web form", "add a contact form", "make a signup form", or when building any HTML form with data handling. Covers PHP and Python backends, MySQL database integration, REST APIs, XML data exchange, accessibility (ARIA), and progressive web apps.'
lastReviewed: 2026-04-29
applyTo: "web/**/*"
---

## Agent Support

| Agent | Integration | Usage |
|-------|-------------|-------|
| **OpenCode** | Direct skill invocation | `skill("create-web-form")` when building forms |
| **Cursor** | `.cursorrules` reference | Add to project rules for form patterns |
| **Copilot** | `.github/copilot-instructions.md` | Reference for web form creation |

### OpenCode Usage
```
# When creating a web form
Use create-web-form for HTML structure and validation.

# When building accessible forms
Load create-web-form for ARIA patterns and best practices.
```

### Cursor Integration
```json
// .cursorrules - Add form patterns
{
  "forms": {
    "requireLabels": true,
    "requireValidation": true,
    "accessibilityRequired": true
  }
}
```

### Copilot Integration
```markdown
<!-- .github/copilot-instructions.md -->
## Web Form Patterns

When creating forms:
- Progressive enhancement: work without JS
- Defense in depth: validate on client AND server
- Accessibility: labels, ARIA, keyboard navigation
- Security: CSRF protection, rate limiting, sanitization

See skills/create-web-form for full patterns.
```

---

# Create Web Form Skill

## Overview

This skill provides comprehensive reference materials and best practices for creating web forms. It covers HTML syntax, UI/UX design, form validation, server-side processing (PHP and Python), data handling, and network communication.

## When to Use This Skill

Use this skill when:
- User asks to "create a form", "build a web form", "add a contact form"
- Building signup/login forms
- Creating data entry forms
- Implementing search forms
- Building checkout/payment forms
- Any HTML form with data handling

Do NOT use this skill when:
- Creating non-form UI components (use ui-skill instead)
- Building API endpoints (use server-action-skill for Next.js)
- Database operations (use db-skill or dal-skill)

## Purpose

Enable developers to build robust, accessible, and user-friendly web forms by providing:

- HTML form syntax and structure
- CSS styling techniques for form elements
- JavaScript for form interactivity and validation
- Accessibility best practices
- Server-side form processing with PHP and Python
- Database integration methods
- Network data handling and security
- Performance optimization

## Core Principles

### 1. Progressive Enhancement

Forms should work even without JavaScript:

```html
<!-- ✅ Works without JS -->
<form action="/submit" method="POST">
  <input type="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>

<!-- JS enhances the experience but isn't required -->
<script>
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    // Add AJAX submission, validation, etc.
  });
</script>
```

### 2. Defense in Depth

Validate on both client AND server:

```javascript
// Client-side validation (UX - immediate feedback)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Server-side validation (SECURITY - cannot be bypassed)
function validateEmailServer(email) {
  if (typeof email !== "string") return false;
  const sanitized = email.trim().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized);
}
```

### 3. Accessibility First

Every form control must be accessible:

```html
<!-- ❌ BAD: No association, no labels -->
<input type="email" placeholder="Email">

<!-- ✅ GOOD: Proper labels and associations -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" required aria-describedby="email-help">
<span id="email-help">We'll never share your email.</span>
```

## Form Structure

### Basic HTML Form

```html
<form action="/api/submit" method="POST">
  <!-- Text Input -->
  <div class="form-group">
    <label for="name">Full Name</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      minlength="2"
      maxlength="100"
      autocomplete="name"
    >
  </div>

  <!-- Email Input -->
  <div class="form-group">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      autocomplete="email"
    >
  </div>

  <!-- Select Dropdown -->
  <div class="form-group">
    <label for="country">Country</label>
    <select id="country" name="country" required>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
    </select>
  </div>

  <!-- Checkbox -->
  <div class="form-group">
    <label>
      <input type="checkbox" name="newsletter" value="yes">
      Subscribe to newsletter
    </label>
  </div>

  <!-- Submit Button -->
  <button type="submit">Submit</button>
</form>
```

### Form Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `action` | URL to send data to | `/api/submit` |
| `method` | HTTP method | `POST`, `GET` |
| `enctype` | Data encoding type | `multipart/form-data` |
| `novalidate` | Skip browser validation | `novalidate` |

## Validation Strategies

### HTML5 Validation (Built-in)

```html
<input type="email" required pattern="[a-z]+@[a-z]+\.[a-z]+">
<input type="number" min="0" max="100" step="1">
<input type="text" minlength="5" maxlength="50">
<input type="url" required>
```

### JavaScript Validation

```javascript
function validateForm(formData) {
  const errors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Real-time Validation

```javascript
const input = document.getElementById("email");
const error = document.getElementById("email-error");

input.addEventListener("blur", () => {
  if (!isValidEmail(input.value)) {
    input.setAttribute("aria-invalid", "true");
    error.textContent = "Please enter a valid email";
    error.style.display = "block";
  } else {
    input.setAttribute("aria-invalid", "false");
    error.style.display = "none";
  }
});

input.addEventListener("input", () => {
  // Clear error as user types after first blur
  if (input.getAttribute("aria-invalid") === "true") {
    error.style.display = "none";
  }
});
```

## Accessibility Requirements

### ARIA Attributes

```html
<!-- Required fields -->
<label for="email">Email <span aria-hidden="true">*</span></label>
<input id="email" aria-required="true">

<!-- Error states -->
<input aria-invalid="true" aria-describedby="email-error">
<div id="email-error" role="alert">Invalid email</div>

<!-- Disabled state -->
<input disabled aria-disabled="true">

<!-- Help text -->
<input aria-describedby="password-help">
<span id="password-help">Must be 8+ characters</span>
```

### Keyboard Navigation

- All form controls must be focusable
- Logical tab order (use `tabindex` sparingly)
- Enter to submit, Escape to cancel
- Arrow keys for radio/checkbox groups

### Screen Reader Support

```html
<!-- Group related fields -->
<fieldset>
  <legend>Payment Method</legend>
  <label>
    <input type="radio" name="payment" value="card">
    Credit Card
  </label>
  <label>
    <input type="radio" name="payment" value="paypal">
    PayPal
  </label>
</fieldset>
```

## Server-Side Processing

### PHP Form Handling

```php
<?php
// Sanitize input
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

// Validate
$errors = [];
if (empty($name)) {
    $errors[] = "Name is required";
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email address";
}

if (empty($errors)) {
    // Process form - save to database, send email, etc.
    $stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    $stmt->execute([$name, $email]);
    header("Location: /success");
    exit;
}
?>
```

### Python (Flask) Form Handling

```python
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()

    errors = {}
    if not name:
        errors['name'] = 'Name is required'
    if not email or '@' not in email:
        errors['email'] = 'Valid email is required'

    if errors:
        return render_template('form.html', errors=errors)

    # Process form
    save_to_database(name, email)
    return redirect('/success')
```

## Security Considerations

### Input Sanitization

```javascript
// Never trust user input
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')  // Remove angle brackets
    .trim()
    .slice(0, 10000);     // Limit length
}
```

### CSRF Protection

```html
<!-- Include CSRF token -->
<input type="hidden" name="csrf_token" value="{{ csrf_token }}">
```

```javascript
// Verify on server
function verifyCSRF(token, sessionToken) {
  return token === sessionToken && token.length > 20;
}
```

### Rate Limiting

```javascript
// Implement rate limiting for form submissions
const submissionTimes = new Map();

function checkRateLimit(ip, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const times = submissionTimes.get(ip) || [];

  // Remove old entries
  const recentTimes = times.filter(t => now - t < windowMs);

  if (recentTimes.length >= maxRequests) {
    return false; // Rate limited
  }

  recentTimes.push(now);
  submissionTimes.set(ip, recentTimes);
  return true;
}
```

## Reference Files

This skill includes the following reference documentation:

### UI & Styling

- `styling-web-forms.md` - Form styling techniques and best practices
- `css-styling.md` - Comprehensive CSS reference for form styling

### User Experience

- `accessibility.md` - Web accessibility guidelines for forms
- `javascript.md` - JavaScript techniques for form functionality
- `form-controls.md` - Native form controls and their usage
- `progressive-web-app.md` - Progressive web app integration

### HTML Structure

- `form-basics.md` - Fundamental HTML form structure
- `aria-form-role.md` - ARIA roles for accessible forms
- `html-form-elements.md` - Complete HTML form elements reference
- `html-form-example.md` - Practical HTML form examples

### Server-Side Processing

- `form-data-handling.md` - Network form data handling
- `php-forms.md` - PHP form processing
- `php-cookies.md` - Cookie management in PHP
- `php-json.md` - JSON handling in PHP
- `php-mysql-database.md` - Database integration with PHP
- `python-contact-form.md` - Python contact form implementation
- `python-flask.md` - Flask forms tutorial
- `python-flask-app.md` - Building Flask web applications
- `python-as-web-framework.md` - Python web framework basics

### Data & Network

- `xml.md` - XML data format reference
- `hypertext-transfer-protocol.md` - HTTP protocol reference
- `security.md` - Web security best practices
- `web-api.md` - Web API integration
- `web-performance.md` - Performance optimization techniques

## Usage Guide

When creating a web form, consult the appropriate reference files based on your needs:

1. **Planning**: Review `form-basics.md` and `form-controls.md`
2. **Structure**: Use `html-form-elements.md` and `aria-form-role.md`
3. **Styling**: Reference `styling-web-forms.md` and `css-styling.md`
4. **Interactivity**: Apply techniques from `javascript.md`
5. **Accessibility**: Follow guidelines in `accessibility.md`
6. **Server Processing**: Choose between PHP or Python references
7. **Data Storage**: Consult database and data format references
8. **Optimization**: Review `web-performance.md` and `security.md`

## Best Practices Checklist

- [ ] Always validate input on both client and server sides
- [ ] Ensure forms are accessible to all users
- [ ] Use semantic HTML elements
- [ ] Implement proper error handling and user feedback
- [ ] Secure form data transmission with HTTPS
- [ ] Follow progressive enhancement principles
- [ ] Test forms across different browsers and devices
- [ ] Optimize for performance and user experience
- [ ] Include CSRF protection
- [ ] Implement rate limiting
- [ ] Sanitize all user inputs

## Related Skills

- [ui-skill](./ui-skill) - For UI component styling
- [validation-skill](./validation-skill) - For Zod validation patterns
- [security-skill](./security-skill) - For security best practices
- [server-action-skill](./server-action-skill) - For Next.js form handling
