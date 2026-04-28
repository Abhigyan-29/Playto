import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Particles from './Particles';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Dynamic AI Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[140px] animate-pulse [animation-delay:2s]"></div>
      </div>
      <Particles
        className="fixed inset-0 z-0"
        quantity={150}
        staticity={30}
        ease={50}
        size={0.6}
        color={isDark ? "#ffffff" : "#4f46e5"}
      />

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Play<span className="text-indigo-500">to</span> <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-1 align-top border border-indigo-500/30 uppercase tracking-tighter font-black">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <div className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-full select-none cursor-default">
                Hello, {user?.firstName || user?.username || 'User'}
              </div>
              <button 
                onClick={() => navigate('/logout')}
                className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-full hover:bg-red-500/20 transition-all active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-sm font-bold text-indigo-400 tracking-wide uppercase">Now Powered by Gemini 2.5 AI</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Global Payouts.<br />
          <span className="bg-gradient-to-r from-indigo-500 via-violet-400 to-indigo-500 bg-clip-text text-transparent animate-gradient">Reimagined by AI.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          The world's first payout engine that thinks. Automated fraud detection, predictive settlement, and a smart assistant that understands your business.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <button 
            onClick={handleCTA}
            className="group px-10 py-5 bg-indigo-600 text-white text-lg font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 flex items-center gap-3 active:scale-[0.98]"
          >
            Start Paying with AI
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <button 
            onClick={() => navigate('/docs')}
            className="px-10 py-5 bg-white/5 border border-white/10 text-white text-lg font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            View API Docs
          </button>
        </div>

        {/* Logo Cloud - AI Integration Partners */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em] mb-10 text-center">Trusted by Global Innovators</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10">
            {[
              { name: 'Visa', slug: 'visa', color: '375BD2' },
              { name: 'Mastercard', slug: 'mastercard', color: 'EB001B' },
              { name: 'Stripe', slug: 'stripe', color: '008CDD' },
              { name: 'Google Pay', slug: 'googlepay', color: '4285F4' },
              { name: 'Apple Pay', slug: 'applepay', color: '000000', white: true },
              { name: 'PayPal', slug: 'paypal', color: '003087' },
              
            ].map((p) => (
              <div key={p.name} className="h-6 md:h-8 flex items-center group">
                <img 
                  src={p.slug ? `https://cdn.simpleicons.org/${p.slug}/${isDark && p.white ? 'ffffff' : p.color}` : p.logo} 
                  alt={p.name} 
                  className="h-full w-auto opacity-80 hover:opacity-100 transition-all duration-300"
                  style={{ 
                    maxWidth: '140px',
                    filter: (isDark && p.white && !p.slug) ? 'brightness(0) invert(1)' : 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Feature Grid - AI Focus */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-10 rounded-[2.5rem] group hover:bg-white/[0.03] transition-all border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 015.25-2.906z" /></svg>
            </div>
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/10">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Gemini 2.5 Security</h3>
            <p className="text-gray-400 leading-relaxed">Every payout is analyzed by Google's most advanced AI. Detect fraud, behavioral anomalies, and high-risk patterns before they happen.</p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] group hover:bg-white/[0.03] transition-all border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-3a1 1 0 00-.832.445l-2 3a1 1 0 101.664 1.11L10 9.555l1.168 1.75a1 1 0 101.664-1.11l-2-3A1 1 0 0010 7z" clipRule="evenodd" /></svg>
            </div>
            <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-violet-500/10">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Smart Assistant</h3>
            <p className="text-gray-400 leading-relaxed">24/7 intelligent chat support built directly into your dashboard. Ask questions about balances, fees, or status in plain English.</p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] group hover:bg-white/[0.03] transition-all border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
            </div>
            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/10">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Predictive Insights</h3>
            <p className="text-gray-400 leading-relaxed">Stop guessing your cash flow. Our AI analyzes your historical data to predict future payout volumes and optimize your settlement timing.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-xl font-bold tracking-tight">Playto <span className="text-indigo-500">AI</span></span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                The leading AI-powered payout infrastructure for the modern internet. Secure, fast, and intelligent.
              </p>
              <div className="flex space-x-4">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-all"></div>)}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link to="/fraud" className="hover:text-indigo-400 transition-colors">AI Fraud Engine</Link></li>
                <li><Link to="/global" className="hover:text-indigo-400 transition-colors">Global Payouts</Link></li>
                <li><Link to="/docs" className="hover:text-indigo-400 transition-colors">Developer API</Link></li>
                <li><Link to="/settlement" className="hover:text-indigo-400 transition-colors">Settlement</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Stay Smart</h4>
              <p className="text-sm text-gray-500 mb-4">Get AI updates directly.</p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 w-full transition-all"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
            <p>© 2026 Playto Inc. Built with intelligence for creators worldwide.</p>
            <div className="flex space-x-8">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
