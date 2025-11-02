# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing **barrautomations@gmail.com**.

**Please do NOT open a public issue for security vulnerabilities.**

We take all security reports seriously and will respond promptly to confirmed vulnerabilities.

---

## Security Best Practices

This project implements several security measures:

### 1. Environment Variables
- All sensitive configuration (API keys, secrets, webhook URLs) must be stored in environment variables
- Never commit `.env` files to version control
- Use `.env.example` as a template for required variables
- Rotate secrets immediately if accidentally exposed

### 2. API Security
- Rate limiting is implemented on all public endpoints
- Honeypot fields protect contact forms from spam
- Input validation using Zod schemas
- CORS policies restrict cross-origin requests to allowed domains
- Generic error messages prevent information disclosure

### 3. Data Protection
- Console logging is disabled in production for sensitive data
- PII (Personally Identifiable Information) is not logged
- Email addresses and contact information are transmitted securely

### 4. Dependencies
- Regular security audits with `npm audit`
- Dependencies are kept up to date
- Use specific version numbers for critical packages

---

## Required Environment Variables

See `.env.example` for a complete list. Critical variables include:

- `WEBHOOK_SECRET_KEY` - Must be a strong random string (minimum 32 characters)
- `RESEND_API_KEY` - Email service API key (keep private)
- `N8N_WEBHOOK_URL` - Internal automation endpoint (do not expose)

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Generate and set a strong `WEBHOOK_SECRET_KEY`
- [ ] Configure all required environment variables in your hosting platform
- [ ] Verify CORS allowed origins match your production domain
- [ ] Enable rate limiting on all API endpoints
- [ ] Review and test error handling
- [ ] Ensure no console.log statements contain sensitive data
- [ ] Run `npm audit` to check for vulnerable dependencies

---

## Secure Configuration

### Generating Secure Keys

\`\`\`bash
# Generate a secure webhook secret key
openssl rand -base64 48

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
\`\`\`

### Vercel Environment Variables

In your Vercel project settings:

1. Navigate to **Settings → Environment Variables**
2. Add all variables from `.env.example`
3. Mark sensitive variables as "Secret"
4. Deploy or redeploy for changes to take effect

---

## Known Security Considerations

### Rate Limiting
- Current rate limiting uses in-memory storage
- For multi-instance deployments, consider Redis-based rate limiting
- Rate limits: 5 requests per 10 seconds per IP (configurable)

### CORS Policy
- Default allowed origins: production domain + localhost
- Modify `ALLOWED_ORIGINS` in API routes if needed
- Do not use wildcard `*` in production

### HTML Sanitization
- Use `isomorphic-dompurify` when rendering user-generated HTML
- Never use `dangerouslySetInnerHTML` without sanitization

---

## Incident Response

If a security incident occurs:

1. **Immediately rotate** all potentially compromised secrets
2. Review recent logs for suspicious activity
3. Contact the security team at barrautomations@gmail.com
4. Document the incident and response actions taken

---

## Security Updates

This project follows security best practices as of October 2025. Security policies and implementations are reviewed quarterly.

**Last Updated:** October 31, 2025
