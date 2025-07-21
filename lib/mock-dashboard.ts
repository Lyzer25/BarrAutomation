export const mockDashboardData = {
  leadId: "demo_web_fallback_123",
  status: "complete",
  dashboard: {
    processingTime: "45",
    leadScore: 85,
    category: "Hot Lead",
    integrations: ["Gmail", "Sheets", "Discord"],
    metrics: {
      responseTime: "30 seconds",
      conversionProbability: "85%",
    },
    leadData: {
      name: "Alex Morgan (Sample)",
      email: "alex.morgan@example.com",
      phone: "(555) 876-5432",
      budget: "$1M - $2M",
      propertyType: "Luxury Home",
      bedrooms: "4",
      location: "Miami Beach, FL",
      timeline: "ASAP",
      inquiryType: "Ready to buy",
      preApproved: "Cash buyer",
      currentSituation: "Own and keeping",
      message:
        "I'm a cash buyer looking for a waterfront property with at least 4 bedrooms in Miami Beach. I'm ready to make an offer immediately for the right place. A modern design is a must.",
    },
    emailContent: {
      subject: "Your Luxury Home Search in Miami Beach",
      body: "<html><body><p>Dear Alex,</p><p>Thank you for your interest! Based on your criteria for a <strong>waterfront, 4-bedroom luxury home</strong> in Miami Beach, we've already identified several potential matches. Our system has flagged you as a high-priority client due to your readiness to purchase.</p><p>An agent will be in touch within the next hour to discuss next steps.</p><p>Best,</p><p>The Barri.ai Real Estate Team</p></body></html>",
    },
    discordMessage: {
      title: "🔥 Hot Lead Alert: Alex Morgan (Sample)",
      description: "New high-value lead processed and qualified by the Smart Lead Machine.",
      fields: [
        { name: "Score", value: "85/100" },
        { name: "Budget", value: "$1M - $2M" },
        { name: "Timeline", value: "ASAP" },
        { name: "Action", value: "Contact Immediately" },
      ],
    },
  },
}
