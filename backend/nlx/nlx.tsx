import { createConversation } from "@nlxai/chat-core";
const { getPatientData } = require('./dbQuery'); // Import the database function

// Create some configuration for NLX
const config = {
  botUrl: "NLX_BOT_URL", // Obtain from NLX deployments page
  headers: {
    "nlx-api-key": "NLX_API_KEY", // Obtain from NLX deployments page
  },
  userId: "", // Optional property to identify the user
  conversationId: "", // Optional: Start with a specific conversation ID
  languageCode: "en-US",
};

// Start the conversation
const convo = createConversation(config);

// Subscribe to the conversation responses
convo.subscribe((responses, newResponse) => {
  if (newResponse) {
    // Log or process the new response received from the bot
    console.log("Bot Response:", newResponse);
    // You could use this response to display in a chat UI or process further as needed
  }
});

// Send a welcome message
convo.sendIntent("");
convo.sendText("Welcome! You can ask for patient info by typing 'patient info <patient_id>'.");
