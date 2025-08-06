const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(base64Image) {
  const prompt = `
You are an expert marine biologist AI. The user has uploaded an image of a coral reef. Your job is to identify:

- The coral **type**
- The **major geographical location** it is found in
- Key **factors affecting this coral**
- The **ecological and human benefits** of this coral

👉 Please give the answer in **JSON format only**, with the following keys:
- type: Name of the coral species.
- geography: Where this coral is typically found.
- factors: A list of objects, each with a name and description.
- benefits: A list of objects, each with a type and description.

📌 Do **not** include any markdown formatting or triple backticks. Just raw JSON.
  `;

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
    },
  });

  const imagePart = {
    inlineData: {
      data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
      mimeType: "image/jpeg",
    },
  };

  try {
    const result = await model.generateContent([
      { text: prompt },
      imagePart
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error(`Gemini content generation failed: ${error.message}`);
  }
}

module.exports = { getGeminiResponse };
