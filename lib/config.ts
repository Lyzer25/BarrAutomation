/**
 * Configuration
 * Production configuration values for automatic deployment
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
  const config: Config = {
    n8nWebhookUrl: 'https://lyzer25.app.n8n.cloud/webhook/new-lead',
    appUrl: 'https://barrautomations.com',
    webhookBaseUrl: 'https://barrautomations.com/api/webhook',
    webhookSecretKey: 'wh_sec_8f9a2b1c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    isDevelopment: false,
    isProduction: true,
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
