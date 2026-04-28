const crypto = require('crypto');

async function testConcurrency() {
  const merchantId = process.argv[2];
  if (!merchantId) {
    console.error('Please provide a merchant ID');
    process.exit(1);
  }

  console.log(`Testing concurrency for merchant ${merchantId}`);
  
  // Create 5 simultaneous requests for 60 rupees
  const requests = Array.from({ length: 5 }).map((_, i) => {
    return fetch('http://localhost:3000/api/v1/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID() // Different keys to simulate different legitimate requests
      },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount_paise: 6000, // 60 rupees
        bank_account_id: 'test_acct_' + i
      })
    });
  });

  const responses = await Promise.all(requests);
  const results = await Promise.all(responses.map(async r => {
    return {
      status: r.status,
      body: await r.json()
    };
  }));

  console.log('Results:');
  const successes = results.filter(r => r.status === 201).length;
  const failures = results.filter(r => r.status === 400).length;
  console.log(`${successes} succeeded, ${failures} failed for insufficient funds`);
  
  if (successes > 1) {
    console.error('ERROR: Concurrency test failed! Multiple requests succeeded when they shouldn\'t have.');
  } else {
    console.log('SUCCESS: Concurrency test passed!');
  }
}

testConcurrency();
