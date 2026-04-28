import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function FraudEngine() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <nav className="p-8 max-w-7xl mx-auto flex justify-between items-center relative z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Playto <span className="text-indigo-500">Security</span></span>
        </motion.div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Close</button>
        </div>
      </nav>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 py-20 space-y-24 relative z-10"
      >
        <motion.section variants={itemVariants} className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            The New Era of <br />
            <span className="text-indigo-500">AI Fraud Prevention.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Legacy systems look for yesterday's patterns. Playto AI predicts tomorrow's threats using Gemini 2.5 behavioral intelligence.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants} className="space-y-6 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5">
            <h3 className="text-2xl font-bold text-red-400">The Modern AI Threat</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">01.</span>
                <p><strong className="text-white">Synthetic Identities:</strong> AI-generated profiles that mimic perfect customer behavior for months before "busting out".</p>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">02.</span>
                <p><strong className="text-white">Velocity Attacks:</strong> Scripted botnets that perform thousands of micro-payouts to drain balances incrementally.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">03.</span>
                <p><strong className="text-white">Account Takeover (ATO):</strong> Sophisticated credential stuffing powered by LLMs to bypass traditional 2FA signals.</p>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5">
            <h3 className="text-2xl font-bold text-green-400">How Playto Prevents It</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p><strong className="text-white">Behavioral Fingerprinting:</strong> We analyze the "rhythm" of transactions, not just the data points.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p><strong className="text-white">Gemini 2.5 Scoring:</strong> Real-time LLM inference for every payout request to detect subtle semantic anomalies.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <p><strong className="text-white">Instant Blocking:</strong> High-risk transactions are halted in &lt; 200ms, protecting your liquidity instantly.</p>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.section 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-indigo-600/10 border border-indigo-500/20 p-12 rounded-[3rem] text-center shadow-[0_0_50px_rgba(79,70,229,0.1)]"
        >
          <h2 className="text-3xl font-bold mb-6">99.9% Fraud Detection Accuracy</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">Our AI engine learns from every transaction across our global network, becoming smarter with every payout you make.</p>
          <button onClick={() => navigate('/login')} className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Secure Your Payouts</button>
        </motion.section>
      </motion.main>

      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[20%] left-[-10%] w-96 h-96 bg-red-600 rounded-full blur-[120px]"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-green-600 rounded-full blur-[120px]"
        ></motion.div>
      </div>
    </div>
  );
}
