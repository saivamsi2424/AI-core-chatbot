const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize the Google Generative AI with your Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Using the 2026 stable model
    });

    /**
     * CONVERSATIONAL MIND LOGIC:
     * We map your frontend message roles to Google's expected roles.
     * Frontend 'ai' becomes Google 'model'.
     */
    const formattedHistory = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Start a chat session with the previous history
    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 2000, // Limits long-winded replies
      },
    });

    // Send the new message within the context of the history
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const reply = response.text();

    // Send only the reply back to the frontend
    res.json({ reply });
  } catch (error) {
    console.error("Gemini Backend Error:", error);

    // Specific error handling for API Key issues or Model limits
    res.status(500).json({
      reply: "I'm having trouble thinking right now. Please try again.",
      error: error.message,
    });
  }
});

module.exports = router;
