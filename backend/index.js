const express = require('express');
const cors = require('cors');
const payoutController = require('./controllers/payoutController');
const aiController = require('./controllers/aiController');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Playto Payout API is running', version: 'v1' });
});

app.post('/api/v1/payouts', payoutController.requestPayout);
app.get('/api/v1/merchants/:merchant_id/dashboard', payoutController.getMerchantDashboard);
app.get('/api/v1/merchants', payoutController.getMerchants);
app.post('/api/v1/ai/chat', aiController.chat);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
