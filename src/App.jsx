import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EquipementsPage from './pages/EquipementsPage';
import InterventionsPage from './pages/InterventionsPage';
import StocksPage from './pages/StocksPage';
import RapportsPage from './pages/RapportsPage';
import AdminPage from './pages/AdminPage';
import SitesPage from './pages/SitesPage';
import InventairesPage from './pages/InventairesPage';
import PlanningPage from './pages/PlanningPage';
import { LoadingSpinner } from './components/shared/Illustrations';

function ProtectedRoute({ children }) {
  const { estConnecte, chargement } = useAuth();
  if (chargement) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="text-center">
        <div className="text-blue-300/30 mb-4 flex justify-center">
          <LoadingSpinner className="w-16 h-16" />
        </div>
        <p className="text-blue-200/60 text-sm font-medium">Chargement de votre session...</p>
      </div>
    </div>
  );
  if (!estConnecte) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="/equipements" element={<EquipementsPage />} />
        <Route path="/interventions" element={<InterventionsPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/rapports" element={<RapportsPage />} />
        <Route path="/sites" element={<SitesPage />} />
        <Route path="/inventaires" element={<InventairesPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
