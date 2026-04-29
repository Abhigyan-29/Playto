const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seed() {
  try {
    await pool.query(`
      INSERT INTO merchants (name)
      VALUES ('Demo Merchant 1'), ('Demo Merchant 2')
    `);

    console.log("✅ Data inserted successfully");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    await pool.end();
  }
}

seed();
