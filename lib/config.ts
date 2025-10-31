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

function createConfig(): Config {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const isDev = nodeEnv === 'development'
  const isProd = nodeEnv === 'production'

  const config: Config = {
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'https://lyzer25.app.n8n.cloud/webhook/new-lead',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || (isProd ? 'https://barrautomations.com' : 'http://localhost:3000'),
    webhookBaseUrl: process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL || (isProd ? 'https://barrautomations.com/api/webhook' : 'http://localhost:3000/api/webhook'),
    webhookSecretKey: process.env.WEBHOOK_SECRET_KEY || '',
    isDevelopment: isDev,
    isProduction: isProd,
  }

  // Validate critical environment variables in production
  if (isProd && !process.env.WEBHOOK_SECRET_KEY) {
    throw new Error('WEBHOOK_SECRET_KEY environment variable is required in production')
  }

  return config
}

// Create and export the configuration
export const config = createConfig()

// Export individual values for convenience
export const {
  n8nWebhookUrl,
  appUrl,
  webhookBaseUrl,
  webhookSecretKey,
  isDevelopment,
  isProduction,
} = config
