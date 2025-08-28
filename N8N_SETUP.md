# n8n Contact Form Workflow Setup

## Overview
This document describes how to set up the n8n workflow to handle contact form submissions from the website.

## Workflow Name
**Contact Intake → Gmail + Google Sheets**

## Workflow Structure

### 1. Webhook Node (Production)
- **Method**: POST
- **Path**: `/contact-intake` (or your preferred path)
- **Authentication**: None (public webhook)
- **Expected Headers**: 
  - `x-contact-destination`: Email address to send to (optional, defaults to barrautomations@gmail.com)

### 2. Set/Code Node (Format Data)
Format the incoming data for email and spreadsheet:

```javascript
// Format for email
const emailData = {
  to: $json.headers["x-contact-destination"] || "barrautomations@gmail.com",
  subject: `New Contact from site – ${$json.fullName}`,
  body: `
New Contact Form Submission

Contact Details:
- Name: ${$json.fullName}
- Email: ${$json.email}
- Phone: ${$json.phone || 'Not provided'}
- Company: ${$json.company || 'Not provided'}
- Website: ${$json.website || 'Not provided'}
- Message: ${$json.message}

Discovery Answers:
- Hours Focus: ${$json.hoursFocus || 'Not provided'}
- Follow-up Pain: ${($json.followupPain || []).join(', ') || 'Not provided'}
- Repeated Lookups: ${$json.repeatedLookups || 'Not provided'}
- Single Point Process: ${$json.singlePointProcess || 'Not provided'}
- Morning KPIs: ${$json.morningKPIs || 'Not provided'}
- Integrations: ${($json.integrations || []).join(', ') || 'Not provided'}

Technical Details:
- User Agent: ${$json.userAgent}
- IP Address: ${$json.ip}
- Timestamp: ${new Date().toISOString()}
  `
};

// Format for Google Sheets
const sheetData = {
  timestamp: new Date().toISOString(),
  fullName: $json.fullName,
  email: $json.email,
  phone: $json.phone || '',
  company: $json.company || '',
  website: $json.website || '',
  message: $json.message,
  hoursFocus: $json.hoursFocus || '',
  followupPain: ($json.followupPain || []).join(', '),
  repeatedLookups: $json.repeatedLookups || '',
  singlePointProcess: $json.singlePointProcess || '',
  morningKPIs: $json.morningKPIs || '',
  integrations: ($json.integrations || []).join(', '),
  userAgent: $json.userAgent || '',
  ip: $json.ip || ''
};

return { emailData, sheetData };
```

### 3. Gmail Node
- **To**: `{{$json.emailData.to}}`
- **Subject**: `{{$json.emailData.subject}}`
- **Body**: `{{$json.emailData.body}}`
- **Format**: Plain text

### 4. Google Sheets Node (Append Row)
- **Operation**: Append
- **Sheet**: Your contacts sheet
- **Columns**: 
  - Timestamp
  - Full Name
  - Email
  - Phone
  - Company
  - Website
  - Message
  - Hours Focus
  - Follow-up Pains
  - Repeated Lookups
  - Single-Point Process
  - Morning KPIs
  - Integrations
  - User Agent
  - IP

### 5. Webhook Response Node
- **Response Code**: 200
- **Response Body**: `{ "ok": true }`

## Expected Request JSON
The webhook will receive a POST request with this structure:

```json
{
  "fullName": "John Doe",
  "email": "john@company.com",
  "phone": "+1 (555) 123-4567",
  "company": "Acme Corp",
  "website": "https://company.com",
  "message": "We need help automating our sales process",
  "hoursFocus": "Sales",
  "followupPain": ["Lead response", "Abandoned carts"],
  "repeatedLookups": "Customer pricing tiers",
  "singlePointProcess": "Monthly report generation",
  "morningKPIs": "Daily sales, conversion rates",
  "integrations": ["Slack", "Gmail", "Google Sheets"],
  "page": "contact",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "trap": ""
}
```

## Environment Variables
Set these in your n8n environment:

- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: Gmail app password (not regular password)
- `GOOGLE_SHEETS_ID`: Your Google Sheets document ID
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Service account JSON key for Google Sheets access

## Testing
1. Deploy the workflow
2. Copy the webhook URL
3. Set `N8N_CONTACT_WEBHOOK_URL` in your Vercel environment variables
4. Test the contact form on your website
5. Check Gmail and Google Sheets for new entries

## Troubleshooting
- **Gmail errors**: Ensure you're using an app password, not your regular password
- **Google Sheets errors**: Verify service account has edit permissions on the sheet
- **Webhook not receiving**: Check the webhook URL and ensure it's publicly accessible
- **Rate limiting**: The API includes basic rate limiting (1 request per minute per IP)

## Security Notes
- The webhook is public but includes honeypot protection
- Rate limiting prevents spam
- All sensitive data is handled server-side
- IP addresses are logged for security monitoring
