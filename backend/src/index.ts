import {GoogleGenerativeAI} from "@google/generative-ai";

import { configDotenv } from "dotenv";
configDotenv();

async function main(){
  const GEMINI_API_KEY : string = process.env.GEMINI_API_KEY || "";
  
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", 
    generationConfig: { 
      maxOutputTokens: 1024,
      temperature: 0,
     } 
  });
  
  const prompt = "write code for a todo web app ";
  
  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  process.stdout.write(chunkText);
}
}

main(); 
