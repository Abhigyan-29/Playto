async function testIdempotency() {
  const url = 'http://localhost:3000/api/v1/payouts';
  const merchant_id = '68c3a560-a23a-4b87-985f-14df109c8af8';
  const idempotencyKey = '550e8400-e29b-41d4-a716-446655440000'; // Static valid UUID for testing
  
  const payload = {
    merchant_id,
    amount_paise: 1000,
    bank_account_id: 'bank_test_123'
  };

  console.log('Sending first request...');
  const res1 = await fetch(url, {
    method: 'POST',
    headers: { 
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data1 = await res1.json();
  console.log('First response status:', res1.status);
  console.log('First payout ID:', data1.payout.id);

  console.log('\nSending second request with same key...');
  const res2 = await fetch(url, {
    method: 'POST',
    headers: { 
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data2 = await res2.json();
  console.log('Second response status:', res2.status);
  console.log('Second payout ID:', data2.payout.id);

  if (data1.payout.id === data2.payout.id) {
    console.log('\nSUCCESS: Idempotency working (same payout ID returned)');
  } else {
    console.log('\nFAILURE: Idempotency failed (different payout IDs)');
  }
}

testIdempotency().catch(console.error);
