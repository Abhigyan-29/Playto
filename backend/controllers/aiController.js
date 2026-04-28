const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function chat(req, res) {
  const { message, history, merchant_id } = req.body;

  try {
    // 1. Fetch Context (Optional but powerful)
    let context = "";
    if (merchant_id) {
      const balanceRes = await db.query(`
        SELECT COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount_paise ELSE -amount_paise END), 0) as balance
        FROM ledger_entries WHERE merchant_id = $1
      `, [merchant_id]);
      context = `The merchant's current available balance is ₹${Number(balanceRes.rows[0].balance) / 100}.`;
    }

    // 2. Prepare AI Chat
    const chatSession = model.startChat({
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const systemPrompt = `You are the Playto Pay AI Assistant. ${context} 
    Be helpful, professional, and concise. You can answer questions about payouts, fees (0.1%), and status. 
    If the user asks for a specific payout status, tell them to check the dashboard table.`;

    const result = await chatSession.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
    const response = await result.response;
    const text = response.text();

    res.json({ content: text });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: 'AI is currently taking a break. Please try again later.' });
  }
}

module.exports = { chat };
