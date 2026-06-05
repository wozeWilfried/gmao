import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import NotificationCenter from '../shared/NotificationCenter';
import { NotificationProvider } from '../../context/NotificationContext';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

function HeaderBar({ onMenuClick }) {
  const { utilisateur } = useAuth();
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 flex-shrink-0">
          <Menu size={20} />
        </button>
        <p className="text-sm text-gray-500 truncate">
          <span className="hidden sm:inline">Connecte en tant que </span>
          <span className="font-medium text-gray-700">{utilisateur?.prenom} {utilisateur?.nom}</span>
          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize truncate max-w-[100px] inline-block align-middle">
            {utilisateur?.role?.replace(/_/g, ' ')}
          </span>
        </p>
      </div>
      <NotificationCenter />
    </div>
  );
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <HeaderBar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
      </div>
    </NotificationProvider>
  );
}
