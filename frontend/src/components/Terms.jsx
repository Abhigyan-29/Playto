import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <nav className="p-8 max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Playto <span className="text-gray-500">Terms</span></span>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Close</button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12 relative z-10">
        <section className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter">Terms of Service</h1>
          <p className="text-gray-500">Last updated: April 2026</p>
        </section>

        <section className="space-y-8 text-gray-400 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Service Acceptance</h2>
            <p>By accessing or using Playto AI, you agree to be bound by these Terms of Service. If you do not agree, you may not use our infrastructure for payout processing.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. All activities under your account, including payout requests initiated via API or Dashboard, are your responsibility.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Payout Processing</h2>
            <p>Payouts are subject to AI risk analysis. We reserve the right to delay or block transactions that our system identifies as high-risk or suspicious. Settlement times are estimates and may be affected by banking holidays or network delays.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Fees and Charges</h2>
            <p>A flat processing fee of 0.1% applies to all completed payouts. These fees are non-refundable once the transaction is finalized on the ledger.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Termination</h2>
            <p>We may suspend or terminate your access to Playto AI at any time for violation of these terms or for activity that threatens the security of our network.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
