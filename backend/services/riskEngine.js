const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function analyzePayoutRisk(merchantId, amountPaise) {
  try {
    // 1. Fetch Contextual Data
    const historyRes = await pool.query(`
      SELECT amount_paise, status, created_at 
      FROM payouts 
      WHERE merchant_id = $1 
      ORDER BY created_at DESC 
      LIMIT 20
    `, [merchantId]);

    const merchantRes = await pool.query('SELECT name FROM merchants WHERE id = $1', [merchantId]);
    const merchantName = merchantRes.rows[0]?.name || 'Unknown';

    const history = historyRes.rows.map(r => ({
      amount: Number(r.amount_paise) / 100,
      status: r.status,
      date: r.created_at
    }));

    // 2. Prepare AI Prompt
    const prompt = `
      You are an AI Fraud Detection Engine for a payout platform called Playto Pay.
      Analyze the following payout request and return a JSON object.
      
      MERCHANT: ${merchantName}
      REQUESTED AMOUNT: ₹${amountPaise / 100}
      
      RECENT HISTORY:
      ${JSON.stringify(history)}
      
      TASK:
      1. Calculate a risk_score between 0.0 (safe) and 1.0 (highly suspicious).
      2. Provide a list of reasoning strings.
      
      Rules for your analysis:
      - Score > 0.8 if the amount is drastically higher than the merchant's usual payouts (anomaly).
      - Score > 0.5 if there's a sudden spike in frequency.
      - Normal behavior should be < 0.2.
      
      OUTPUT FORMAT (Strict JSON):
      {
        "risk_score": number,
        "reasons": ["string"],
        "recommendation": "allow" | "flag" | "block"
      }
    `;

    // 3. Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from markdown if present
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const aiResult = JSON.parse(jsonStr);

    return {
      risk_score: aiResult.risk_score || 0.1,
      reasons: aiResult.reasons || [],
      ai_raw: aiResult
    };

  } catch (error) {
    console.error('Gemini Risk Engine Error:', error);
    // Fallback to basic rule if AI fails
    return { 
      risk_score: amountPaise > 1000000 ? 0.4 : 0.1, 
      reasons: ['AI Analysis Unavailable - Fallback check'] 
    };
  }
}

module.exports = { analyzePayoutRisk };
