const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  console.log('Fetching available models...');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY.trim()}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ API Error:', data.error);
      return;
    }

    console.log('Available Models:');
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(`- ${m.name} (Supported)`);
      }
    });
  } catch (err) {
    console.error('❌ Network Error:', err.message);
  }
}

listModels();
