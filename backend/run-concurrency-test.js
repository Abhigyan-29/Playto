const db = require('./db');
const { execSync } = require('child_process');

async function setupAndTest() {
  const client = await db.getClient();
  try {
    const res = await client.query('SELECT id FROM merchants LIMIT 1');
    const merchantId = res.rows[0].id;
    
    // Clear ledger and set balance to exactly 100 rupees (10000 paise)
    await client.query('DELETE FROM payouts WHERE merchant_id = $1', [merchantId]);
    await client.query('DELETE FROM ledger_entries WHERE merchant_id = $1', [merchantId]);
    await client.query(`
      INSERT INTO ledger_entries (merchant_id, amount_paise, type)
      VALUES ($1, 10000, 'CREDIT')
    `, [merchantId]);

    console.log(`Balance set to 100 rupees for ${merchantId}`);
    
    // Run the test
    execSync(`node test-concurrency.js ${merchantId}`, { stdio: 'inherit' });
  } finally {
    client.release();
    process.exit(0);
  }
}

setupAndTest();
