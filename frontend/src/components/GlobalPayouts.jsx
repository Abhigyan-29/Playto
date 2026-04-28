import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function GlobalPayouts() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
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
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Playto <span className="text-indigo-500">Global</span></span>
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
            Money Without <br />
            <span className="text-indigo-500">Borders.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Move funds to 100+ countries in local currencies. Faster than SWIFT, cheaper than traditional banks.
          </p>
        </motion.section>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <h4 className="text-4xl font-black text-white mb-2">100+</h4>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Countries</p>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <h4 className="text-4xl font-black text-white mb-2">40+</h4>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Currencies</p>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <h4 className="text-4xl font-black text-white mb-2">&lt; 2s</h4>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Settlement</p>
          </motion.div>
        </motion.div>

        <motion.section variants={itemVariants} className="space-y-12">
          <h2 className="text-3xl font-bold">Supported Regions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['North America', 'European Union', 'United Kingdom', 'India (UPI)', 'Southeast Asia', 'Latin America', 'Africa', 'Middle East'].map(region => (
              <motion.div key={region} whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }} className="px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium text-gray-300">
                {region}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-8 p-10 bg-indigo-900/10 border border-indigo-500/20 rounded-[2.5rem]">
          <h2 className="text-3xl font-bold">Compliance & Licensing</h2>
          <p className="text-gray-400 leading-relaxed">
            We operate as a licensed **Merchant of Record** across multiple jurisdictions. This means we handle the tax collection, regional compliance, and banking relationships so you can focus on your product.
          </p>
          <div className="flex flex-wrap gap-4 opacity-50">
            {['PCI-DSS Level 1', 'SOC2 Type II', 'GDPR Compliant', 'RBI Licensed'].map(badge => (
              <span key={badge} className="px-4 py-2 border border-white/20 rounded-full text-xs font-bold">{badge}</span>
            ))}
          </div>
        </motion.section>
      </motion.main>

      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-900 rounded-full blur-[150px]"
        ></motion.div>
      </div>
    </div>
  );
}
