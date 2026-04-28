CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    amount_paise BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    payout_id UUID, -- Can be null for credits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    amount_paise BIGINT NOT NULL,
    bank_account_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    idempotency_key UUID NOT NULL,
    retry_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    risk_score DECIMAL(3,2) DEFAULT 0.0,
    risk_assessment JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (merchant_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
    key UUID NOT NULL,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    response_body JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (merchant_id, key)
);

-- Index for balance calculations
CREATE INDEX IF NOT EXISTS idx_ledger_entries_merchant_id ON ledger_entries(merchant_id);

-- Index for picking up pending/processing payouts efficiently
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
