# Deployment Guide

## Environment Variables Configuration

This application requires several environment variables to function properly. Follow these steps to configure them for different environments.

### 🔧 Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_WEBHOOK_URL` | Your n8n webhook endpoint | `https://lyzer25.app.n8n.cloud/webhook/new-lead` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://barrautomations.com` |
| `WEBHOOK_BASE_URL` | Base URL for webhook endpoints | `https://barrautomations.com/api/webhook` |
| `WEBHOOK_SECRET_KEY` | Secret key for webhook authentication | `wh_sec_[random-string]` |

### 🏠 Local Development Setup

1. **Create `.env.local` file** in the project root:
```env
# N8N Integration
N8N_WEBHOOK_URL=https://lyzer25.app.n8n.cloud/webhook/new-lead

# Domain Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
WEBHOOK_BASE_URL=http://localhost:3000/api/webhook

# Security
WEBHOOK_SECRET_KEY=wh_sec_8f9a2b1c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

2. **Start development server**:
```bash
npm run dev
# or
pnpm dev
```

3. **Verify configuration**: Check the console for configuration logs when the server starts.

### ☁️ Vercel Production Deployment

#### Step 1: Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:

**N8N_WEBHOOK_URL**
- Name: `N8N_WEBHOOK_URL`
- Value: `https://lyzer25.app.n8n.cloud/webhook/new-lead`
- Environment: Production, Preview, Development

**NEXT_PUBLIC_APP_URL**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://barrautomations.com` (or your custom domain)
- Environment: Production, Preview, Development

**WEBHOOK_BASE_URL**
- Name: `WEBHOOK_BASE_URL`
- Value: `https://barrautomations.com/api/webhook`
- Environment: Production, Preview, Development

**WEBHOOK_SECRET_KEY**
- Name: `WEBHOOK_SECRET_KEY`
- Value: Generate a secure random string (see below)
- Environment: Production, Preview, Development

#### Step 2: Generate Secure Webhook Secret

Use one of these methods to generate a secure secret:

```bash
# Using Node.js
node -e "console.log('wh_sec_' + require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32 | sed 's/^/wh_sec_/'

# Online generator (use a reputable one)
# Or manually create: wh_sec_[64-character-hex-string]
```

#### Step 3: Deploy

After setting environment variables:
1. Trigger a new deployment (push to main branch or redeploy in Vercel)
2. Check deployment logs for configuration validation
3. Test the webhook endpoints

### 🔗 N8N Webhook Configuration

Update your n8n workflow to call these endpoints:

**Status Updates:**
```
https://barrautomations.com/api/webhook/status-update/{leadId}
```

**Dashboard Data:**
```
https://barrautomations.com/api/webhook/dashboard-update/{leadId}
```

### 🧪 Testing Configuration

#### Test Environment Variables Loading
```bash
# Check if config loads without errors
npm run build
```

#### Test Webhook Endpoints
```bash
# Test status update endpoint
curl -X POST https://barrautomations.com/api/webhook/status-update/test123 \
  -H "Content-Type: application/json" \
  -d '{"step":"test","status":"complete"}'

# Test dashboard update endpoint  
curl -X POST https://barrautomations.com/api/webhook/dashboard-update/test123 \
  -H "Content-Type: application/json" \
  -d '{"leadScore":85,"leadData":{"name":"Test","email":"test@test.com","phone":"","message":""}}'
```

#### Test N8N Integration
1. Go to `/demos/smart-lead-machine`
2. Click "See Live Demo"
3. Use "Try with Sample Data"
4. Monitor browser console and network tab
5. Check Vercel function logs

### 🚨 Troubleshooting

#### Configuration Errors
If you see configuration errors in the logs:
1. Verify all environment variables are set in Vercel
2. Check for typos in variable names
3. Ensure URLs are valid and include protocol (https://)
4. Redeploy after making changes

#### N8N Integration Issues
1. **Webhook not received**: Check n8n workflow HTTP request nodes
2. **Wrong URLs**: Verify n8n is calling the correct webhook endpoints
3. **CORS errors**: Check browser console for CORS issues
4. **Timeout**: Check n8n workflow execution time

#### Common Issues
- **Environment variables not loading**: Redeploy after setting variables
- **TypeScript errors**: Run `npm run build` to check for build issues
- **Webhook failures**: Check Vercel function logs for detailed errors

### 📊 Monitoring

#### Vercel Function Logs
- Go to Vercel Dashboard → Functions
- Check logs for webhook calls and errors
- Monitor response times and success rates

#### Browser Console
- Check for configuration logs in development
- Monitor network requests to webhook endpoints
- Look for SSE connection status

### 🔒 Security Considerations

1. **Webhook Secret**: Use a strong, unique secret key
2. **CORS**: Consider restricting CORS origins in production
3. **Rate Limiting**: Consider adding rate limiting for webhook endpoints
4. **Authentication**: Consider adding webhook signature verification

### 📝 Environment Variable Checklist

Before deploying, ensure:
- [ ] All 4 environment variables are set in Vercel
- [ ] URLs use HTTPS in production
- [ ] Webhook secret is secure and unique
- [ ] N8N workflow points to correct webhook URLs
- [ ] Test endpoints respond correctly
- [ ] Configuration logs show all variables loaded
