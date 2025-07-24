export const integrationData: Record<string, { name: string; description: string; domain: string; category: string }> = {
  // Most Common
  gmail: { name: "Gmail", description: "Email service by Google", domain: "gmail.com", category: "Most Common" },
  googlecalendar: { name: "Google Calendar", description: "Time-management and scheduling", domain: "calendar.google.com", category: "Most Common" },
  googlesheets: { name: "Google Sheets", description: "Online spreadsheet application", domain: "sheets.google.com", category: "Most Common" },
  slack: { name: "Slack", description: "Collaboration hub", domain: "slack.com", category: "Most Common" },
  zoom: { name: "Zoom", description: "Video conferencing service", domain: "zoom.us", category: "Most Common" },
  hubspot: { name: "HubSpot", description: "CRM, marketing, sales, and service software", domain: "hubspot.com", category: "Most Common" },
  stripe: { name: "Stripe", description: "Online payment processing", domain: "stripe.com", category: "Most Common" },
  notion: { name: "Notion", description: "All-in-one workspace", domain: "notion.so", category: "Most Common" },
  airtable: { name: "Airtable", description: "Spreadsheet-database hybrid", domain: "airtable.com", category: "Most Common" },
  trello: { name: "Trello", description: "Collaboration tool", domain: "trello.com", category: "Most Common" },
  
  // AI / LLM
  openai: { name: "OpenAI (ChatGPT)", description: "AI research and deployment company", domain: "openai.com", category: "AI / LLM" },
  anthropic: { name: "Anthropic (Claude)", description: "AI safety and research", domain: "anthropic.com", category: "AI / LLM" },
  googlegemini: { name: "Google Gemini", description: "Multimodal AI model", domain: "google.com", category: "AI / LLM" },
  deepseek: { name: "DeepSeek", description: "AI research and development", domain: "deepseek.com", category: "AI / LLM" },
  perplexity: { name: "Perplexity", description: "AI-powered search engine", domain: "perplexity.ai", category: "AI / LLM" },
  azureopenai: { name: "Azure OpenAI", description: "AI models for various applications", domain: "azure.microsoft.com", category: "AI / LLM" },
  v03: { name: "V03", description: "Fictional LLM for demonstration", domain: "v03.ai", category: "AI / LLM" },

  // CRM & Sales
  agilecrm: { name: "Agile CRM", description: "All-in-one CRM for small businesses", domain: "agilecrm.com", category: "CRM & Sales" },
  pipedrive: { name: "Pipedrive", description: "Sales CRM and pipeline management", domain: "pipedrive.com", category: "CRM & Sales" },
  zohocrm: { name: "Zoho CRM", description: "Customer relationship management", domain: "zoho.com", category: "CRM & Sales" },
  
  // Email Marketing
  activecampaign: { name: "ActiveCampaign", description: "Email marketing and automation", domain: "activecampaign.com", category: "Email Marketing" },
  mailchimp: { name: "Mailchimp", description: "Email marketing and automation", domain: "mailchimp.com", category: "Email Marketing" },
  convertkit: { name: "ConvertKit", description: "Email marketing for creators", domain: "convertkit.com", category: "Email Marketing" },
  
  // Project Management
  asana: { name: "Asana", description: "Work management platform", domain: "asana.com", category: "Project Management" },
  mondaycom: { name: "Monday.com", description: "Work operating system", domain: "monday.com", category: "Project Management" },
  clickup: { name: "ClickUp", description: "All-in-one productivity platform", domain: "clickup.com", category: "Project Management" },
  
  // Other
  advbox: { name: "ADVBOX", description: "Legal software for lawyers", domain: "advbox.com.br", category: "Other" },
  actionnetwork: { name: "Action Network", description: "Digital organizing tools", domain: "actionnetwork.org", category: "Other" },
  adalo: { name: "Adalo", description: "No-code app builder", domain: "adalo.com", category: "Other" },
  affinity: { name: "Affinity", description: "Relationship intelligence platform", domain: "affinity.co", category: "Other" },
  airbyte: { name: "Airbyte", description: "Open-source data integration", domain: "airbyte.com", category: "Other" },
  airtop: { name: "Airtop", description: "AI-powered business management", domain: "airtop.ai", category: "Other" },
  amqpsender: { name: "AMQP Sender", description: "Message queuing protocol", domain: "amqp.org", category: "Other" },
  apitemplateio: { name: "APITemplate.io", description: "Automated PDF and image generation", domain: "apitemplate.io", category: "Other" },
  appflowy: { name: "AppFlowy", description: "Open-source Notion alternative", domain: "appflowy.io", category: "Other" },
  asaas: { name: "Asaas", description: "Financial management platform", domain: "asaas.com", category: "Other" },
  awscognito: { name: "AWS Cognito", description: "Identity and access management", domain: "aws.amazon.com", category: "Other" },
  awscomprehend: { name: "AWS Comprehend", description: "Natural language processing", domain: "aws.amazon.com", category: "Other" },
  awsdynamodb: { name: "AWS DynamoDB", description: "NoSQL database service", domain: "aws.amazon.com", category: "Other" },
  awselasticloadbalancing: { name: "AWS Elastic Load Balancing", description: "Distribute incoming application traffic", domain: "aws.amazon.com", category: "Other" },
  awslambda: { name: "AWS Lambda", description: "Serverless compute service", domain: "aws.amazon.com", category: "Other" },
  awsrekognition: { name: "AWS Rekognition", description: "Image and video analysis", domain: "aws.amazon.com", category: "Other" },
  awss3: { name: "AWS S3", description: "Object storage service", domain: "aws.amazon.com", category: "Other" },
  awsses: { name: "AWS SES", description: "Email sending and receiving service", domain: "aws.amazon.com", category: "Other" },
  awssns: { name: "AWS SNS", description: "Pub/sub messaging service", domain: "aws.amazon.com", category: "Other" },
  awssqs: { name: "AWS SQS", description: "Message queuing service", domain: "aws.amazon.com", category: "Other" },
  awstextract: { name: "AWS Textract", description: "Extract text and data from documents", domain: "aws.amazon.com", category: "Other" },
  awstranscribe: { name: "AWS Transcribe", description: "Automatic speech recognition", domain: "aws.amazon.com", category: "Other" },
  azurecosmosdb: { name: "Azure Cosmos DB", description: "NoSQL and relational database", domain: "azure.microsoft.com", category: "Other" },
  azurestorage: { name: "Azure Storage", description: "Cloud storage for modern applications", domain: "azure.microsoft.com", category: "Other" },
  bamboohr: { name: "BambooHR", description: "HR software for small and medium businesses", domain: "bamboohr.com", category: "Other" },
};

export const integrationCategories: Record<string, { label: string; integrations: string[] }> = {
  "most-common": {
    label: "🚀 Most Common",
    integrations: ["gmail", "googlecalendar", "googlesheets", "slack", "zoom", "hubspot", "stripe", "notion", "airtable", "trello"],
  },
  "ai-llm": {
    label: "🤖 AI / LLM",
    integrations: ["openai", "anthropic", "googlegemini", "deepseek", "perplexity", "azureopenai", "v03"],
  },
  "crm-sales": {
    label: "💼 CRM & Sales",
    integrations: ["agilecrm", "pipedrive", "zohocrm", "hubspot"],
  },
  "email-marketing": {
    label: "📈 Email Marketing",
    integrations: ["activecampaign", "mailchimp", "convertkit"],
  },
  "project-management": {
    label: "📝 Project Management",
    integrations: ["asana", "mondaycom", "clickup", "trello", "notion"],
  },
  other: {
    label: "⚙️ Other",
    integrations: ["advbox", "actionnetwork", "adalo", "affinity", "airbyte", "airtop", "amqpsender", "apitemplateio", "appflowy", "asaas", "awscognito", "awscomprehend", "awsdynamodb", "awselasticloadbalancing", "awslambda", "awsrekognition", "awss3", "awsses", "awssns", "awssqs", "awstextract", "awstranscribe", "azurecosmosdb", "azurestorage", "bamboohr"],
  },
};
