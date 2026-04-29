import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useAuth, SignIn, SignOutButton } from '@clerk/clerk-react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ApiDocs from './components/ApiDocs';
import FraudEngine from './components/FraudEngine';
import GlobalPayouts from './components/GlobalPayouts';
import Settlement from './components/Settlement';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { Toaster } from 'sonner';
import AIChatbot from './components/AIChatbot';

function AppContent() {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
 fetch(`${import.meta.env.VITE_API_URL}/api/v1/merchants`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch merchants');
        return res.json();
      })
      .then(data => {
        setMerchants(data);
        if (data.length > 0) setSelectedMerchant(data[0].id);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formatCurrency = (paise) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(paise) / 100);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <Toaster richColors position="top-right" />
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
      </div>

      <Routes>
        {/* Public Landing & Content */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<ApiDocs />} />
        <Route path="/fraud" element={<FraudEngine />} />
        <Route path="/global" element={<GlobalPayouts />} />
        <Route path="/settlement" element={<Settlement />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/hero" element={<Navigate to="/" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={
          <div className="flex justify-center py-20 animate-in fade-in zoom-in duration-500">
            <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
            <SignedOut><SignIn routing="path" path="/login" signUpUrl="/signup" /></SignedOut>
          </div>
        } />

        <Route path="/logout" element={
          <div className="flex flex-col items-center justify-center py-40">
            <h2 className="text-2xl font-bold mb-6 italic">Are you sure you want to logout?</h2>
            <div className="flex gap-4">
              <SignOutButton><button className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-all">Logout</button></SignOutButton>
              <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all">Cancel</button>
            </div>
          </div>
        } />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 bg-red-950/20 p-6 rounded-2xl border border-red-500/20 max-w-md mx-auto text-center">
                  <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                  <p className="text-sm opacity-80 mb-4">{error}</p>
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold">Retry</button>
                </div>
              ) : selectedMerchant ? (
                <Dashboard merchantId={selectedMerchant} />
              ) : (
                <div className="text-center py-20 text-gray-500 glass rounded-[2rem]">No merchants available.</div>
              )}
            </main>
          </ProtectedRoute>
        } />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AIChatbot />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
