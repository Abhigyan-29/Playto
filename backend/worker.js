const db = require('./db');

async function processPendingPayouts() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    
    const res = await client.query(`
      SELECT id, merchant_id, amount_paise 
      FROM payouts 
      WHERE status = 'PENDING' 
      ORDER BY created_at ASC 
      LIMIT 1 
      FOR UPDATE SKIP LOCKED
    `);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return;
    }

    const payout = res.rows[0];

    await client.query(`
      UPDATE payouts 
      SET status = 'PROCESSING', updated_at = NOW(), last_attempt_at = NOW() 
      WHERE id = $1
    `, [payout.id]);

    await client.query('COMMIT');

    const rand = Math.random();
    let finalStatus = 'PROCESSING'; 

    if (rand < 0.7) {
      finalStatus = 'COMPLETED'; 
    } else if (rand < 0.9) {
      finalStatus = 'FAILED'; 
    }

    if (finalStatus !== 'PROCESSING') {
      await client.query('BEGIN');
      
      await client.query(`
        UPDATE payouts 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2
      `, [finalStatus, payout.id]);

      if (finalStatus === 'FAILED') {
        await client.query(`
          INSERT INTO ledger_entries (merchant_id, amount_paise, type, payout_id)
          VALUES ($1, $2, 'CREDIT', $3)
        `, [payout.merchant_id, payout.amount_paise, payout.id]);
      }

      await client.query('COMMIT');
      console.log(`Payout ${payout.id} processed: ${finalStatus}`);
    } else {
      console.log(`Payout ${payout.id} hung in PROCESSING`);
    }

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing pending payouts:', error);
  } finally {
    client.release();
  }
}

async function processStuckPayouts() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const res = await client.query(`
      SELECT id, merchant_id, amount_paise, retry_count 
      FROM payouts 
      WHERE status = 'PROCESSING' 
        AND updated_at < NOW() - INTERVAL '30 seconds'
      ORDER BY updated_at ASC 
      LIMIT 1 
      FOR UPDATE SKIP LOCKED
    `);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return;
    }

    const payout = res.rows[0];

    if (payout.retry_count >= 3) {
      await client.query(`
        UPDATE payouts 
        SET status = 'FAILED', updated_at = NOW() 
        WHERE id = $1
      `, [payout.id]);

      await client.query(`
        INSERT INTO ledger_entries (merchant_id, amount_paise, type, payout_id)
        VALUES ($1, $2, 'CREDIT', $3)
      `, [payout.merchant_id, payout.amount_paise, payout.id]);
      
      console.log(`Payout ${payout.id} failed after max retries`);
    } else {
      await client.query(`
        UPDATE payouts 
        SET retry_count = retry_count + 1, updated_at = NOW(), last_attempt_at = NOW() 
        WHERE id = $1
      `, [payout.id]);
      console.log(`Payout ${payout.id} retried (attempt ${payout.retry_count + 1})`);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing stuck payouts:', error);
  } finally {
    client.release();
  }
}

async function startWorker() {
  console.log('Worker started. Polling for payouts...');
  setInterval(() => {
    processPendingPayouts();
  }, 2000);

  setInterval(() => {
    processStuckPayouts();
  }, 5000);
}

startWorker();
