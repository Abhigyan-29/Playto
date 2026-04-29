const db = require('../db');
const { analyzePayoutRisk } = require('../services/riskEngine');

async function requestPayout(req, res) {
  const idempotencyKey = req.headers['idempotency-key'];
  const { merchant_id, amount_paise, bank_account_id } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header is required' });
  }

  if (!merchant_id || !amount_paise || !bank_account_id || amount_paise <= 0) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const merchantRes = await client.query(
      'SELECT id FROM merchants WHERE id = $1 FOR UPDATE',
      [merchant_id]
    );

    if (merchantRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const idKeyRes = await client.query(
      'SELECT response_body FROM idempotency_keys WHERE merchant_id = $1 AND key = $2 AND expires_at > NOW()',
      [merchant_id, idempotencyKey]
    );

    if (idKeyRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(200).json(idKeyRes.rows[0].response_body);
    }

    const riskResult = await analyzePayoutRisk(merchant_id, amount_paise);
    if (riskResult.risk_score > 0.85) {
      await client.query('ROLLBACK');
      return res.status(403).json({ 
        error: 'Payout blocked by security engine',
        risk_score: riskResult.risk_score,
        reason: 'Suspicious activity detected'
      });
    }

    const riskScore = riskResult.risk_score;
    const riskAssessment = JSON.stringify(riskResult);

    const balanceRes = await client.query(`
      SELECT COALESCE(
        SUM(CASE WHEN type = 'CREDIT' THEN amount_paise ELSE -amount_paise END), 0
      ) as available_balance
      FROM ledger_entries
      WHERE merchant_id = $1
    `, [merchant_id]);

    const availableBalance = BigInt(balanceRes.rows[0].available_balance);
    const requestedAmount = BigInt(amount_paise);

    if (availableBalance < requestedAmount) {
      const errorResp = { error: 'Insufficient funds' };
      
      await client.query(`
        INSERT INTO idempotency_keys (key, merchant_id, response_body, expires_at)
        VALUES ($1, $2, $3, NOW() + INTERVAL '24 hours')
      `, [idempotencyKey, merchant_id, errorResp]);
      
      await client.query('COMMIT');
      return res.status(400).json(errorResp);
    }

    const payoutRes = await client.query(`
      INSERT INTO payouts (merchant_id, amount_paise, bank_account_id, status, idempotency_key, risk_score, risk_assessment)
      VALUES ($1, $2, $3, 'PENDING', $4, $5, $6)
      RETURNING id, status, amount_paise, bank_account_id, created_at, risk_score, risk_assessment
    `, [merchant_id, amount_paise, bank_account_id, idempotencyKey, riskScore, riskAssessment]);

    const payout = payoutRes.rows[0];

    await client.query(`
      INSERT INTO ledger_entries (merchant_id, amount_paise, type, payout_id)
      VALUES ($1, $2, 'DEBIT', $3)
    `, [merchant_id, amount_paise, payout.id]);

    const responseBody = {
      message: 'Payout requested successfully',
      payout: {
        ...payout,
        amount_paise: payout.amount_paise.toString()
      }
    };

    await client.query(`
      INSERT INTO idempotency_keys (key, merchant_id, response_body, expires_at)
      VALUES ($1, $2, $3, NOW() + INTERVAL '24 hours')
    `, [idempotencyKey, merchant_id, responseBody]);

    await client.query('COMMIT');
    res.status(201).json(responseBody);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing payout:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Concurrent idempotency key usage detected' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

async function getMerchantDashboard(req, res) {
  const { merchant_id } = req.params;
  
  try {
    const balanceRes = await db.query(`
      SELECT COALESCE(
        SUM(CASE WHEN type = 'CREDIT' THEN amount_paise ELSE -amount_paise END), 0
      ) as available_balance
      FROM ledger_entries
      WHERE merchant_id = $1
    `, [merchant_id]);

    const heldRes = await db.query(`
      SELECT COALESCE(SUM(amount_paise), 0) as held_balance
      FROM payouts
      WHERE merchant_id = $1 AND status IN ('PENDING', 'PROCESSING')
    `, [merchant_id]);

    const recentPayoutsRes = await db.query(`
      SELECT id, amount_paise, bank_account_id, status, created_at, risk_score, risk_assessment
      FROM payouts
      WHERE merchant_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [merchant_id]);

    res.json({
      available_balance: balanceRes.rows[0].available_balance.toString(),
      held_balance: heldRes.rows[0].held_balance.toString(),
      recent_payouts: recentPayoutsRes.rows.map(r => ({...r, amount_paise: r.amount_paise.toString()}))
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMerchants(req, res) {
  try {
    const merchants = await db.query('SELECT id, name FROM merchants');
    res.json(merchants.rows);
  } catch (error) {
    console.error('Error fetching merchants:', error); // ← fix
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  requestPayout,
  getMerchantDashboard,
  getMerchants
};
