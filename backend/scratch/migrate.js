const db = require('../db');

async function migrate() {
  let client;
  try {
    console.log('Starting migration...');
    client = await db.getClient();
    
    // Add risk_score
    await client.query(`
      ALTER TABLE payouts 
      ADD COLUMN IF NOT EXISTS risk_score DECIMAL(3,2) DEFAULT 0.0
    `);
    console.log('✅ Added risk_score column');

    // Add risk_assessment
    await client.query(`
      ALTER TABLE payouts 
      ADD COLUMN IF NOT EXISTS risk_assessment JSONB DEFAULT '{}'
    `);
    console.log('✅ Added risk_assessment column');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    if (client) client.release();
    process.exit();
  }
}

migrate();
