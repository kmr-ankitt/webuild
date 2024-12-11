import { configDotenv } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express, { response } from "express";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import cors from "cors";

configDotenv();
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

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
  try {
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

    const ans = result.response.text().toLowerCase().trim();
    if (ans == "react") {
      res.status(200).json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (ans == "node") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).send("You cant access this.");
    return;
  } catch (error) {
    res.status(400).send("Generation failed");
  }
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  try {
    const result = await model.generateContent({
      contents: messages,
      systemInstruction: getSystemPrompt(),
    });

    res.json({
      messages: result.response.text(),
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).send("Generation failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
