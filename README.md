# Barr Automations

> Real-Time AI Automation for Business. Workflows That Execute in Seconds.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

## Overview

Barr Automations transforms raw leads into qualified opportunities in real-time using AI automation. This Next.js application features a complete Smart Lead Machine demo with real-time dashboard updates powered by n8n workflows.

### 🚀 Features

- **Smart Lead Machine**: Interactive demo showing AI-powered lead qualification
- **PixelBlast Background**: Animated WebGL background using Three.js & React Three Fiber
- **Real-time Dashboard**: Live updates via Server-Sent Events (SSE)
- **Discovery Stepper**: Multi-step client needs assessment
- **N8N Integration**: Seamless workflow automation with n8n webhooks
- **Contact Management**: Integrated forms with Resend email delivery
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS 4
- **Component Library**: Complete shadcn/ui + Radix UI implementation
- **Responsive Design**: Mobile-first responsive layout
- **Dark Theme**: Professional dark theme with crimson accents

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1 + shadcn/ui
- **3D Graphics**: Three.js + React Three Fiber + postprocessing
- **Animations**: Framer Motion + GSAP
- **Forms**: React Hook Form + Zod validation
- **Email**: Resend API
- **Automation**: n8n webhooks
- **Deployment**: Vercel

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- n8n workflow setup (optional for full functionality)

### Local Development

1. **Clone the repository**:
\`\`\`bash
git clone https://github.com/Lyzer25/BarrAutomation.git
cd BarrAutomation
\`\`\`

2. **Install dependencies**:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. **Set up environment variables**:
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

4. **Start development server**:
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

5. **Open your browser**: Navigate to `http://localhost:3000`

## ⚙️ Environment Configuration

This application requires environment variables for proper functionality. See `.env.example` for all required variables and [SECURITY.md](./SECURITY.md) for security best practices.

### Critical Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEBHOOK_SECRET_KEY` | Secret key for webhook authentication (min 32 chars) | Yes (Prod) |
| `RESEND_API_KEY` | Resend email service API key | Yes |
| `N8N_WEBHOOK_URL` | n8n automation webhook endpoint | Yes |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application | No (auto-detect) |

### Generating Secure Keys

```bash
# Generate a secure webhook secret key
openssl rand -base64 48
```

## 🔗 N8N Integration

The Smart Lead Machine integrates with n8n workflows for:

1. **Lead Processing**: Receives form submissions via webhook
2. **AI Analysis**: Processes leads through OpenAI/Claude
3. **Status Updates**: Real-time progress updates via webhooks
4. **Dashboard Data**: Final results sent to dashboard display

### Webhook Endpoints

- Status Updates: `/api/webhook/status-update/[leadId]`
- Dashboard Data: `/api/webhook/dashboard-update/[leadId]`
- Proxy to N8N: `/api/proxy-webhook`
- Real-time Events: `/api/events/[leadId]` (SSE)

## 📊 Dashboard Features

The dashboard includes:

- **Lead Scoring**: Animated progress bars with AI-generated scores
- **Processing Metrics**: Response time, conversion probability
- **Integration Display**: Visual representation of connected tools
- **Content Preview**: Email and notification content
- **Real-time Updates**: Live status updates during processing

## 🚀 Deployment

### Vercel Deployment

1. **Set Environment Variables** in Vercel Dashboard
2. **Connect Repository** to Vercel
3. **Deploy**: Automatic deployment on push to main

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Custom Domain Setup

1. Add custom domain in Vercel settings
2. Update environment variables with new domain
3. Update n8n webhook URLs to point to new domain

## 🧪 Testing

### Test the Demo

1. Navigate to `/demos/smart-lead-machine`
2. Click "See Live Demo"
3. Use "Try with Sample Data" for quick testing
4. Monitor browser console for real-time updates

### Test Webhook Endpoints

\`\`\`bash
# Test status endpoint
curl -X POST https://your-domain.com/api/webhook/status-update/test123 \
  -H "Content-Type: application/json" \
  -d '{"step":"test","status":"complete"}'
\`\`\`

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── demos/             # Demo pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── smart-lead-machine/ # Demo-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/               # Static assets
\`\`\`

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Key Components

- **DashboardViewer**: Main dashboard display component
- **WorkflowVisualizer**: Real-time workflow progress
- **DemoModal**: Lead capture form
- **useAutomationProgress**: Hook for managing real-time updates

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for comprehensive security policies and best practices.

**Important:**
- Never commit `.env` files
- Rotate secrets immediately if accidentally exposed
- Keep dependencies updated with `npm audit`
- Use environment-based logging (development only)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following TypeScript and ESLint standards
3. Run tests and linting before submitting
4. Submit a pull request with a clear description

## 📝 License

Proprietary - © 2025 Barr Automations. All rights reserved.

## 🆘 Support

For support inquiries:

- **Email**: barrautomations@gmail.com
- **Website**: https://barrautomations.com
- **Security Issues**: See [SECURITY.md](./SECURITY.md)

---

**Live Website**: [https://barrautomations.com](https://barrautomations.com)
**Demo**: [https://barrautomations.com/demos/smart-lead-machine](https://barrautomations.com/demos/smart-lead-machine)

**Built with ❤️ by Barr Automations**
