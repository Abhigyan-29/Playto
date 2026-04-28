const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
  console.log('Testing Gemini 2.5 API...');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello, respond with '2.5 CONNECTED'");
    const response = await result.response;
    console.log('Gemini Response:', response.text());
  } catch (err) {
    console.error('❌ Gemini Error:', err.message);
  }
}

test();
