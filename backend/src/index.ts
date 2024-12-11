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

  });
  
  const prompt = "write code for a todo web app ";
  
  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  process.stdout.write(chunkText);
}
}

main(); 
