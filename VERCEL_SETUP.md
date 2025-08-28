# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel project settings (Project Settings → Environment Variables):

### 1. N8N_CONTACT_WEBHOOK_URL (Required)
- **Value**: Your n8n webhook URL (e.g., `https://your-n8n-instance.com/webhook/contact-intake`)
- **Environment**: Production, Preview, Development
- **Description**: The webhook URL that will receive contact form submissions

### 2. CONTACT_TO_EMAIL (Optional)
- **Value**: `barrautomations@gmail.com` (or your preferred email)
- **Environment**: Production, Preview, Development
- **Description**: Default email address for contact notifications (can be overridden by webhook header)

## How to Set Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter the variable name and value
6. Select the environments where it should be available
7. Click **Save**

## Testing

After setting the environment variables:

1. **Deploy your changes** to Vercel
2. **Test the contact form** on your live site
3. **Check the n8n workflow** to ensure it receives the webhook
4. **Verify email delivery** to barrautomations@gmail.com
5. **Check Google Sheets** for new contact entries

## Troubleshooting

- **Environment variables not working**: Ensure you've deployed after setting them
- **Webhook not receiving**: Check the URL is correct and publicly accessible
- **Email not sending**: Verify Gmail credentials in n8n
- **Sheets not updating**: Check Google service account permissions

## Security Notes

- All environment variables are encrypted at rest
- Variables are only accessible server-side (never exposed to client)
- The honeypot field and rate limiting provide additional spam protection
- IP addresses are logged for security monitoring
