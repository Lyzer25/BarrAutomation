/**
 * Configuration
 * Uses environment variables for secure configuration
 */

interface Config {
  n8nWebhookUrl: string
  appUrl: string
  webhookBaseUrl: string
  webhookSecretKey: string
  isDevelopment: boolean
  isProduction: boolean
}

const nodeEnv = process.env.NODE_ENV || 'development'
const isDev = nodeEnv === 'development'
const isProd = nodeEnv === 'production'

// Direct exports of configuration values
// No validation during build to avoid errors
export const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://lyzer25.app.n8n.cloud/webhook/new-lead'
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || (isProd ? 'https://barrautomations.com' : 'http://localhost:3000')
export const webhookBaseUrl = process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL || (isProd ? 'https://barrautomations.com/api/webhook' : 'http://localhost:3000/api/webhook')
export const webhookSecretKey = process.env.WEBHOOK_SECRET_KEY || ''
export const isDevelopment = isDev
export const isProduction = isProd

// Export config object
export const config: Config = {
  n8nWebhookUrl,
  appUrl,
  webhookBaseUrl,
  webhookSecretKey,
  isDevelopment,
  isProduction,
}
