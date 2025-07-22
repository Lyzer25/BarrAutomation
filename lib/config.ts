/**
 * Environment Configuration Utility
 * Validates and provides access to environment variables
 */

interface Config {
  n8nWebhookUrl: string
  appUrl: string
  webhookBaseUrl: string
  webhookSecretKey: string
  isDevelopment: boolean
  isProduction: boolean
}

class ConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

function getRequiredEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] || fallback
  if (!value) {
    throw new ConfigError(
      `Missing required environment variable: ${name}. ` +
      `Please add it to your .env.local file or Vercel environment variables.`
    )
  }
  return value
}

function validateUrl(url: string, name: string): string {
  try {
    new URL(url)
    return url
  } catch {
    throw new ConfigError(
      `Invalid URL for ${name}: ${url}. Please provide a valid URL starting with http:// or https://`
    )
  }
}

function createConfig(): Config {
  const nodeEnv = process.env.NODE_ENV || 'development'
  
  try {
    const config: Config = {
      n8nWebhookUrl: validateUrl(
        getRequiredEnvVar('N8N_WEBHOOK_URL'),
        'N8N_WEBHOOK_URL'
      ),
      appUrl: validateUrl(
        getRequiredEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
        'NEXT_PUBLIC_APP_URL'
      ),
      webhookBaseUrl: validateUrl(
        getRequiredEnvVar('WEBHOOK_BASE_URL', 'http://localhost:3000/api/webhook'),
        'WEBHOOK_BASE_URL'
      ),
      webhookSecretKey: getRequiredEnvVar('WEBHOOK_SECRET_KEY'),
      isDevelopment: nodeEnv === 'development',
      isProduction: nodeEnv === 'production',
    }

    // Log configuration in development (without secrets)
    if (config.isDevelopment) {
      console.log('🔧 Configuration loaded:', {
        n8nWebhookUrl: config.n8nWebhookUrl,
        appUrl: config.appUrl,
        webhookBaseUrl: config.webhookBaseUrl,
        webhookSecretKey: config.webhookSecretKey ? '[SET]' : '[MISSING]',
        environment: nodeEnv,
      })
    }

    return config
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error('❌ Configuration Error:', error.message)
      console.error('\n📋 Required Environment Variables:')
      console.error('- N8N_WEBHOOK_URL: Your n8n webhook endpoint')
      console.error('- NEXT_PUBLIC_APP_URL: Your app domain (e.g., https://barrautomations.com)')
      console.error('- WEBHOOK_BASE_URL: Your webhook base URL (e.g., https://barrautomations.com/api/webhook)')
      console.error('- WEBHOOK_SECRET_KEY: A secure random string for webhook authentication')
      console.error('\n💡 Create a .env.local file with these variables for local development.')
      console.error('💡 Set these in your Vercel dashboard for production deployment.')
    }
    throw error
  }
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

// Export validation utilities
export { ConfigError, validateUrl, getRequiredEnvVar }
