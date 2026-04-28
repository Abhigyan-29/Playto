import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <nav className="p-8 max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Playto <span className="text-gray-500">Privacy</span></span>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Close</button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12 relative z-10">
        <section className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: April 2026</p>
        </section>

        <section className="space-y-8 text-gray-400 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <p>To provide our AI-powered payout services, we collect information that identifies you, your business, and your financial transactions. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and business contact details.</li>
              <li>Financial information, including bank account details and transaction history.</li>
              <li>Device and usage data, including IP address and browser type for fraud prevention.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Data</h2>
            <p>Our AI engine processes your data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitate payouts and manage your account.</li>
              <li>Analyze behavioral patterns for fraud detection and security.</li>
              <li>Comply with legal obligations (KYC/AML).</li>
              <li>Improve our AI models and service performance.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Security Measures</h2>
            <p>We implement industry-standard security protocols, including AES-256 encryption at rest and TLS 1.3 for all data in transit. Access to financial data is strictly limited to authorized systems and personnel.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Your Rights</h2>
            <p>You have the right to access, correct, or request the deletion of your personal data. To exercise these rights, please contact our support team at privacy@playto.ai.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
