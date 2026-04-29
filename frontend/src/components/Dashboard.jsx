import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from './Particles';
import { useTheme } from '../context/ThemeContext';
import { useAuth, useUser, UserButton, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard({ merchantId: initialMerchantId }) {
  const { isDark } = useTheme();
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState(initialMerchantId);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all merchants for the switcher
    fetch('https://playto-3-0se5.onrender.com')
      .then(res => res.json())
      .then(data => setMerchants(data))
      .catch(err => console.error('Error fetching merchants:', err));
  }, []);
  useEffect(() => {
  if (window.location.search.includes("__clerk_handshake")) {
    window.history.replaceState({}, document.title, "/dashboard");
  }
}, []);

  const fetchDashboard = async () => {
    if (!selectedMerchantId) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/merchants/${merchantId}/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDashboard();
    
    // Poll for live status updates every 2 seconds
    const interval = setInterval(fetchDashboard, 2000);
    return () => clearInterval(interval);
  }, [selectedMerchantId]);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setPayoutError(null);

    const amountPaise = parseFloat(payoutAmount) * 100; // Convert to paise
    if (isNaN(amountPaise) || amountPaise <= 0) {
      setPayoutError('Invalid amount');
      setSubmitting(false);
      return;
    }

    const idempotencyKey = crypto.randomUUID();

    try {
      const response = await fetch('http://localhost:3000/api/v1/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          merchant_id: selectedMerchantId,
          amount_paise: amountPaise,
          bank_account_id: bankAccountId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request payout');
      }

      toast.success("Payout Request Submitted", {
        description: `Your payout of ${formatCurrency(amountPaise)} is now PENDING.`,
      });

      if (data.payout && Number(data.payout.risk_score) > 0.4) {
        toast.warning("Security Review Flagged", {
          description: "Our AI engine flagged this payout for manual verification due to unusual activity.",
        });
      }

      setPayoutAmount('');
      setBankAccountId('');
      fetchDashboard();
    } catch (err) {
      setPayoutError(err.message);
      toast.error("Payout Declined", {
        description: err.message,
        action: {
          label: "Retry",
          onClick: () => handleRequestPayout(e),
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !dashboardData) {
    return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 p-8 rounded-3xl glass border border-red-500/20 max-w-md mx-auto text-center mt-20">
      <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
      <p className="opacity-70 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold">Retry</button>
    </div>;
  }

  const formatCurrency = (paiseStr) => {
    const rupees = parseFloat(paiseStr) / 100;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rupees);
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
      FAILED: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getRiskColor = (score) => {
    if (score > 0.7) return 'text-red-400';
    if (score > 0.4) return 'text-amber-400';
    return 'text-green-400';
  };

  const lifetimePayouts = dashboardData?.recent_payouts
    ? dashboardData.recent_payouts
        .filter(p => p.status === 'COMPLETED')
        .reduce((acc, p) => acc + BigInt(p.amount_paise), BigInt(0))
    : BigInt(0);

  const averageRisk = dashboardData?.recent_payouts?.length > 0
    ? dashboardData.recent_payouts.reduce((acc, p) => acc + Number(p.risk_score), 0) / dashboardData.recent_payouts.length
    : 0;

  return (
    <div className="space-y-10 pb-20 relative">
      <Particles
        className="fixed inset-0 z-0"
        quantity={100}
        staticity={50}
        ease={50}
        size={0.4}
        color={isDark ? "#ffffff" : "#4f46e5"}
      />
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h2>
            <p className="text-gray-500">Welcome back, {user?.firstName || 'Merchant'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3">Merchant</span>
            <select
              className="bg-transparent text-sm font-bold focus:outline-none pr-8 cursor-pointer"
              value={selectedMerchantId || ''}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
            >
              {merchants.map(m => (
                <option key={m.id} value={m.id} className="bg-neutral-900 text-white">{m.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all font-bold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
          
          <div className="pl-2">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 rounded-xl",
                  userButtonTrigger: "focus:shadow-none focus:outline-none"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Bar Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 glass p-8 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3">Available</h3>
          <p className="text-4xl font-bold tracking-tight text-white">{formatCurrency(dashboardData.available_balance)}</p>
        </div>
        <div className="lg:col-span-1 glass p-8 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-3">Held</h3>
          <p className="text-4xl font-bold tracking-tight text-white">{formatCurrency(dashboardData.held_balance)}</p>
        </div>
        <div className="lg:col-span-1 glass p-8 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-3">Account Integrity</h3>
          <div className="flex items-center gap-2">
            <p className="text-4xl font-bold tracking-tight text-white">{Math.round((1 - averageRisk) * 100)}%</p>
            <div className={`w-3 h-3 rounded-full ${averageRisk < 0.3 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`}></div>
          </div>
        </div>
        <div className="lg:col-span-1 glass p-8 rounded-3xl overflow-hidden relative group flex flex-col justify-center">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">Lifetime Payouts</h3>
          <p className="text-3xl font-bold tracking-tight text-white">{formatCurrency(lifetimePayouts.toString())}</p>
        </div>
      </div>

      {/* AI Insights & Alerts */}
      {dashboardData?.recent_payouts?.some(p => Number(p.risk_score) > 0.4) && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex items-start gap-4 animate-pulse">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <h4 className="text-amber-400 font-bold mb-1">AI Security Recommendation</h4>
            <p className="text-sm text-gray-400">Our engine detected unusual withdrawal patterns in your recent payouts. We recommend verifying your latest bank account additions for maximum security.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Payout Form */}
        <div className="lg:col-span-1 glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            Request Payout
          </h3>
          <form onSubmit={handleRequestPayout} className="space-y-6">
            {payoutError && (
              <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-2xl border border-red-500/20">
                {payoutError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Amount (INR)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="pl-8 block w-full rounded-2xl bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all p-4 border"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Bank Account ID</label>
              <input
                type="text"
                required
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="block w-full rounded-2xl bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all p-4 border"
                placeholder="e.g. acct_123456"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Payout History Table */}
        <div className="lg:col-span-2 glass rounded-[2rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Recent Payouts</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-white/[0.02]">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Security</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {!dashboardData?.recent_payouts || dashboardData.recent_payouts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center text-gray-500 text-sm">No recent payouts found.</td>
                  </tr>
                ) : (
                  dashboardData.recent_payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-400 group-hover:text-gray-300">
                        {new Date(payout.created_at).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-white">
                        {formatCurrency(payout.amount_paise)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${getRiskColor(Number(payout.risk_score))}`}>
                            {Math.round((1 - Number(payout.risk_score)) * 100)}% safe
                          </span>
                          {Number(payout.risk_score) > 0.4 && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {getStatusBadge(payout.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
