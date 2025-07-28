import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "You are a helpful assistant.",
        },
        {
          role: "model",
          parts: "Sure! How can I help you?",
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Something went wrong on server." });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
