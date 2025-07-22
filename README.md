# Barri.ai - Real-Time AI Automation Platform

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/6xxx3l1t35n1p3rxxx9-gmailcoms-projects/v0-barri)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Ud2AfMMa4wx)

## Overview

Barri.ai transforms raw leads into qualified opportunities in real-time using AI automation. This Next.js application features a complete Smart Lead Machine demo with real-time dashboard updates powered by n8n workflows.

### 🚀 Features

- **Smart Lead Machine Demo**: Interactive demo showing AI-powered lead qualification
- **Real-time Dashboard**: Live updates via Server-Sent Events (SSE)
- **N8N Integration**: Seamless workflow automation with n8n
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Component Library**: Complete shadcn/ui implementation
- **Responsive Design**: Mobile-first responsive layout
- **Dark Theme**: Professional dark theme with electric blue accents

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Automation**: n8n integration

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- n8n workflow setup (optional for full functionality)

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/Lyzer25/BarrAutomation.git
cd BarrAutomation
```

2. **Install dependencies**:
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**:
```bash
npm run dev
# or
pnpm dev
```

5. **Open your browser**: Navigate to `http://localhost:3000`

## ⚙️ Environment Configuration

This application requires environment variables for proper functionality. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### Required Variables

- `N8N_WEBHOOK_URL`: Your n8n webhook endpoint
- `NEXT_PUBLIC_APP_URL`: Your app's public URL
- `WEBHOOK_BASE_URL`: Base URL for webhook endpoints  
- `WEBHOOK_SECRET_KEY`: Secret key for webhook authentication

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

```bash
# Test status endpoint
curl -X POST https://your-domain.com/api/webhook/status-update/test123 \
  -H "Content-Type: application/json" \
  -d '{"step":"test","status":"complete"}'
```

## 📁 Project Structure

```
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
```

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

## 🤝 Contributing

This repository is automatically synced with v0.dev. To contribute:

1. Make changes via [v0.dev interface](https://v0.dev/chat/projects/Ud2AfMMa4wx)
2. Changes are automatically pushed to this repository
3. Vercel deploys the latest version automatically

## 📝 License

This project is private and proprietary to Barri.ai.

## 🆘 Support

For issues or questions:

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for configuration help
2. Review Vercel function logs for debugging
3. Test webhook endpoints manually
4. Verify n8n workflow configuration

---

**Live Demo**: [https://barrautomations.com/demos/smart-lead-machine](https://barrautomations.com/demos/smart-lead-machine)
