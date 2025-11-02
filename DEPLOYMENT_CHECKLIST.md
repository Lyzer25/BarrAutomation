# 🚀 Production Deployment Checklist

**Quick reference for deploying Barr Automations to production**

---

## Pre-Deployment

### 1. Generate Secure Keys ⏱️ 2 minutes

\`\`\`bash
# Generate webhook secret key
openssl rand -base64 48

# Save this key - you'll need it in the next step
\`\`\`

### 2. Configure Vercel Environment Variables ⏱️ 5 minutes

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `WEBHOOK_SECRET_KEY` | `<generated key from step 1>` | Production, Preview |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | Production, Preview |
| `RESEND_FROM` | `no-reply@barrautomations.com` | Production, Preview |
| `RESEND_DOMAIN` | `barrautomations.com` | Production, Preview |
| `CONTACT_TO_EMAIL` | `barrautomations@gmail.com` | Production, Preview |
| `N8N_WEBHOOK_URL` | `https://lyzer25.app.n8n.cloud/webhook/new-lead` | Production, Preview |
| `N8N_CONTACT_WEBHOOK_URL` | `https://lyzer25.app.n8n.cloud/webhook/contact` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://barrautomations.com` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://preview.barrautomations.com` | Preview |

### 3. Update n8n Webhooks ⏱️ 3 minutes

In your n8n workflow, update webhook URLs to:
- Status updates: `https://barrautomations.com/api/webhook/status-update/[leadId]`
- Dashboard updates: `https://barrautomations.com/api/webhook/dashboard-update/[leadId]`

---

## Deployment

### 4. Deploy to Vercel ⏱️ 1 minute

\`\`\`bash
# Push to main branch (triggers auto-deploy)
git add .
git commit -m "Production deployment ready"
git push origin main
\`\`\`

**Or** click "Deploy" in Vercel Dashboard

---

## Post-Deployment Verification

### 5. Test Core Functionality ⏱️ 5 minutes

#### Test 1: Homepage & PixelBlast
- [ ] Visit `https://barrautomations.com`
- [ ] Verify animated red pixelated background is visible
- [ ] Check for liquid wobble effect on mouse movement
- [ ] Verify no console errors in browser DevTools

#### Test 2: Contact Form
- [ ] Visit `https://barrautomations.com/contact`
- [ ] Fill out and submit contact form
- [ ] Verify success message appears
- [ ] Check email inbox for delivery

#### Test 3: Smart Lead Machine Demo
- [ ] Visit `https://barrautomations.com/demos/smart-lead-machine`
- [ ] Click "See Live Demo" button
- [ ] Try "Sample Data" button
- [ ] Verify real-time updates appear
- [ ] Check dashboard displays correctly

#### Test 4: API Health Check
\`\`\`bash
# Test webhook endpoint
curl https://barrautomations.com/api/webhook/health

# Should return 200 OK
\`\`\`

### 6. Monitor Vercel Logs ⏱️ 2 minutes

- [ ] Open Vercel Dashboard → Your Project → Logs
- [ ] Watch for any errors in real-time
- [ ] Verify no console.log output with sensitive data
- [ ] Check Function execution times are reasonable (<1s)

---

## Security Verification

### 7. Security Checklist ⏱️ 3 minutes

- [ ] No `.env` files committed to git
- [ ] Old webhook secret key has been rotated (it was exposed)
- [ ] All environment variables set in Vercel
- [ ] CORS restricted to production domain
- [ ] Console logging disabled for sensitive data (PII, tokens, etc.)
- [ ] Error messages are generic (no internal details exposed)

---

## Rollback Plan

If something goes wrong:

### Quick Rollback
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the last working deployment
3. Click "..." menu → "Promote to Production"

### Manual Rollback
\`\`\`bash
git revert HEAD
git push origin main
\`\`\`

---

## Common Issues & Solutions

### Issue: PixelBlast not rendering
**Solution**:
- Check browser console for WebGL errors
- Verify `postprocessing` dependency installed
- Clear browser cache and hard refresh

### Issue: Contact form not sending emails
**Solution**:
- Verify `RESEND_API_KEY` is set correctly in Vercel
- Check Resend dashboard for delivery logs
- Verify sender domain is verified in Resend

### Issue: n8n webhooks failing
**Solution**:
- Verify `N8N_WEBHOOK_URL` is correct in Vercel
- Check n8n workflow is active
- Test n8n endpoint manually with curl

### Issue: Console errors about missing environment variables
**Solution**:
- Verify all variables from `.env.example` are set in Vercel
- Redeploy after adding missing variables
- Check variable names match exactly (case-sensitive)

---

## Performance Monitoring

### After 24 Hours

Check Vercel Analytics for:
- [ ] Average response time < 500ms
- [ ] Error rate < 1%
- [ ] No 500 errors in logs
- [ ] Core Web Vitals in "Good" range

---

## Success Criteria

✅ **Deployment is successful when**:
- Homepage loads with PixelBlast background
- Contact form sends emails successfully
- Smart Lead Machine demo works end-to-end
- No errors in Vercel function logs
- All API endpoints return proper responses
- Real-time updates work (SSE)

---

## Next Steps After Deployment

1. **Set up monitoring** (Sentry, LogRocket, etc.)
2. **Enable Vercel Analytics** for performance tracking
3. **Schedule security audit** for 30 days
4. **Document any issues** encountered during deployment
5. **Update team** on new deployment process

---

## Emergency Contacts

- **Technical Issues**: barrautomations@gmail.com
- **Security Issues**: See [SECURITY.md](./SECURITY.md)
- **Vercel Support**: https://vercel.com/support

---

## Estimated Total Time

⏱️ **20-30 minutes** for complete deployment and verification

---

**Last Updated**: October 31, 2025
**Version**: 1.0

---

*For detailed security information, see [SECURITY.md](./SECURITY.md)*
*For comprehensive changes, see [CODEBASE_CLEANUP_SUMMARY.md](./CODEBASE_CLEANUP_SUMMARY.md)*
