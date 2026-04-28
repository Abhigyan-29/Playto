import { useNavigate } from 'react-router-dom';

export default function ApiDocs() {
  const navigate = useNavigate();

  const endpoints = [
    {
      id: 'payouts-post',
      method: 'POST',
      path: '/api/v1/payouts',
      desc: 'Create a new AI-scored payout request.',
      payload: {
        merchant_id: 'string',
        amount_paise: 'number',
        bank_account_id: 'string'
      },
      headers: {
        'Idempotency-Key': 'UUID'
      }
    },
    {
      id: 'dashboard-get',
      method: 'GET',
      path: '/api/v1/merchants/:id/dashboard',
      desc: 'Fetch real-time balance and AI security insights.',
      params: { id: 'string' }
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 p-6 backdrop-blur-xl sticky top-0 z-50 bg-black/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight font-sans">Playto <span className="text-indigo-500 text-xs">DOCS</span></span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:grid lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-32 h-fit">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Introduction</h3>
            <ul className="space-y-3 text-sm">
              <li onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-indigo-400 font-bold cursor-pointer hover:text-indigo-300">Getting Started</li>
              <li className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Authentication</li>
              <li className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Errors</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Endpoints</h3>
            <ul className="space-y-3 text-sm">
              {endpoints.map(e => (
                <li key={e.path} onClick={() => scrollToSection(e.id)} className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors truncate">
                  <span className={`text-[10px] mr-2 ${e.method === 'POST' ? 'text-green-500' : 'text-blue-500'}`}>{e.method}</span>
                  {e.path}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-16">
          <section>
            <h1 className="text-4xl font-bold font-sans mb-6">API Documentation</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Welcome to the Playto AI API. Our infrastructure is designed to be developer-first, secure by default, and powered by Gemini 2.5 intelligence.
            </p>
          </section>

          {endpoints.map((e, i) => (
            <section key={i} className="space-y-6 scroll-mt-32" id={e.id}>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded text-xs font-black ${e.method === 'POST' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                  {e.method}
                </span>
                <code className="text-xl font-bold">{e.path}</code>
              </div>
              <p className="text-gray-500">{e.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parameters</h4>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <pre className="text-sm text-indigo-300 overflow-x-auto">
                      {JSON.stringify(e.payload || e.params, null, 2)}
                    </pre>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Request Example</h4>
                  <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10 shadow-2xl">
                    <pre className="text-sm text-gray-400 overflow-x-auto">
                      {`curl -X ${e.method} https://api.playto.ai${e.path.replace(':id', 'mer_123')} \\
  -H "Idempotency-Key: \${UUID}" \\
  -d '${JSON.stringify(e.payload || {}, null, 2)}'`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
