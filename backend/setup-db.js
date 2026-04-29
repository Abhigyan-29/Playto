require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
  const appClient = new Client({
    connectionString: 'postgresql://playto_db_b1p8_user:1phkWr9YCBUZlr9hlbfafie82aYcO326@dpg-d7odfnjeo5us73bui9pg-a/playto_db_b1p8',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await appClient.connect();
    console.log('Connected to ' + process.env.DB_NAME + ' database.');

    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema...');
    await appClient.query(schemaSql);
    console.log('Schema applied.');

    console.log('Seeding data...');
    const seedRes = await appClient.query(`SELECT COUNT(*) FROM merchants`);
    if (parseInt(seedRes.rows[0].count, 10) === 0) {
      const m1 = await appClient.query(`INSERT INTO merchants (name) VALUES ('Acme Corp') RETURNING id`);
      const m2 = await appClient.query(`INSERT INTO merchants (name) VALUES ('Globex Inc') RETURNING id`);
      
      const m1Id = m1.rows[0].id;
      const m2Id = m2.rows[0].id;

      await appClient.query(`
        INSERT INTO ledger_entries (merchant_id, amount_paise, type)
        VALUES ($1, 1000000, 'CREDIT')
      `, [m1Id]);

      await appClient.query(`
        INSERT INTO ledger_entries (merchant_id, amount_paise, type)
        VALUES ($1, 500000, 'CREDIT')
      `, [m2Id]);

      console.log('Seed data inserted.');
    } else {
      console.log('Data already exists, skipping seed.');
    }

    console.log('Setup complete!');
  } catch (err) {
    console.error('Error setting up schema/seed:', err);
  } finally {
    await appClient.end();
  }
}

setup();
