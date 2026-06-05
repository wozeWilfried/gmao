import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginIllustration({ className = "w-full max-w-sm" }) {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="220" stroke="url(#lg1)" strokeWidth="2" />
      <circle cx="250" cy="250" r="170" stroke="url(#lg2)" strokeWidth="1.5" />
      <circle cx="250" cy="250" r="120" stroke="url(#lg2)" strokeWidth="1" strokeDasharray="6 6" />
      <g opacity="0.9">
        <rect x="180" y="140" width="140" height="200" rx="16" stroke="url(#lg1)" strokeWidth="2.5" fill="white" fillOpacity="0.04" />
        <circle cx="250" cy="190" r="28" stroke="#3B82F6" strokeWidth="2" fill="white" fillOpacity="0.05" />
        <circle cx="250" cy="190" r="34" stroke="#3B82F6" strokeWidth="0.8" opacity="0.3" />
        <rect x="210" y="235" width="80" height="10" rx="5" fill="#3B82F6" fillOpacity="0.15" />
        <rect x="200" y="260" width="100" height="8" rx="4" fill="#3B82F6" fillOpacity="0.1" />
        <rect x="195" y="285" width="110" height="8" rx="4" fill="#3B82F6" fillOpacity="0.1" />
        <rect x="215" y="310" width="70" height="8" rx="4" fill="#3B82F6" fillOpacity="0.1" />
      </g>
      <g opacity="0.6">
        <path d="M140 250 L180 250 M320 250 L360 250" stroke="#3B82F6" strokeWidth="1.5" opacity="0.2" />
        <path d="M250 100 L250 140 M250 360 L250 400" stroke="#3B82F6" strokeWidth="1.5" opacity="0.2" />
      </g>
      <g opacity="0.3">
        <circle cx="120" cy="380" r="6" fill="#3B82F6" />
        <circle cx="400" cy="150" r="4" fill="#8B5CF6" />
        <circle cx="380" cy="380" r="5" fill="#3B82F6" />
        <circle cx="140" cy="120" r="3" fill="#8B5CF6" />
      </g>
      <g opacity="0.08">
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={150 + i * 45} y={390 + Math.sin(i) * 15} width={35} height={60 + i * 5} rx={4}
            fill={i === 2 ? '#3B82F6' : '#8B5CF6'} />
        ))}
        <path d="M150 445 L330 445" stroke="#3B82F6" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!login.trim() || !motDePasse.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      authLogin(login.trim(), motDePasse);
      toast.success('Connexion reussie');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      </div>

      <div className="w-full max-w-5xl relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="hidden lg:flex flex-1 flex-col items-center">
          <div className="text-blue-200/40">
            <LoginIllustration className="w-72 h-72 xl:w-80 xl:h-80" />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">GMAO Enterprise</h2>
            <p className="text-blue-200/60 mt-2 text-sm max-w-sm">
              Solution complete de gestion de maintenance pour les entreprises industrielles
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="flex flex-col items-center lg:items-start mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4 lg:mb-5">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Connexion</h1>
            <p className="text-blue-200/60 mt-1 text-sm">Accedez a votre espace GMAO</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Identifiant</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={login} onChange={e => setLogin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="Votre identifiant" required autoFocus />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPwd ? 'text' : 'password'} value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="Votre mot de passe" required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : 'Se connecter'}
              </button>
            </form>
          </div>

          <div className="lg:hidden mt-8 text-center">
            <LoginIllustration className="w-48 h-48 mx-auto text-blue-200/20" />
            <h2 className="text-xl font-bold text-white mt-4">GMAO Enterprise</h2>
            <p className="text-blue-200/60 text-sm mt-1">Maintenance industrielle</p>
          </div>

          <p className="text-center text-blue-200/30 text-xs mt-6">
            &copy; {new Date().getFullYear()} GMAO Enterprise
          </p>
        </div>
      </div>
    </div>
  );
}
