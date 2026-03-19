const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message, history } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Backend Error:", error);
    res.status(500).json({ error: "AI error" });
  }
});

module.exports = router;
