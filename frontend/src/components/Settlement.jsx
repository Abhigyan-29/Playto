import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Settlement() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
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
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Playto <span className="text-indigo-500">Settlement</span></span>
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
        <motion.section variants={itemVariants} className="space-y-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Automated <br />
            <span className="text-indigo-500">Liquidity Flow.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our "Just-in-Time" settlement engine optimizes your working capital by moving funds exactly when they are needed.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants} className="space-y-6 p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
            <h3 className="text-2xl font-bold">The Settlement Cycle</h3>
            <div className="space-y-4">
              {[
                { step: 'T-0', desc: 'Real-time fund reservation across regional rails.' },
                { step: 'T-1', desc: 'Automated batching and currency conversion.' },
                { step: 'Final', desc: 'Direct-to-bank delivery via local payment networks.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-indigo-500 font-bold w-12">{item.step}</span>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 p-8 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl">
            <h3 className="text-2xl font-bold">Predictive Funding</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Playto's AI monitors your transaction volume and predicts upcoming payout requirements. We notify you to top up your balance *before* it runs low, ensuring 100% payout success rates.
            </p>
            <div className="pt-4">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Predicted Volume</span>
                <span className="text-indigo-400">+12% next 24h</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-indigo-500"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
