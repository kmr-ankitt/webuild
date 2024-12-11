import { configDotenv } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express, { response } from "express";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";

configDotenv();
const PORT = 3000;
const app = express();
app.use(express.json());

const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;
  if (!req.body.prompt) {
    res.status(400).send("Prompt is required");
    return;
  }

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    systemInstruction:
      "If it is a react project, reply with 'react'. If it is a node project, reply with 'node'. No extra information is needed. If it has not specified the type of project, then think of yourself which node or react will be better for that title.",
    generationConfig: {
      maxOutputTokens: 200,
    },
  });
  const prompt = "write code for a todo web app ";
  
  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  process.stdout.write(chunkText);
}
}

main(); 
