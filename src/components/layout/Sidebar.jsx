import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, ClipboardList, Package, FileBarChart, LogOut, ChevronLeft, ChevronRight, Shield, X, Building2, CalendarDays, ClipboardCheck, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../utils/permissions';
import Modal from '../shared/Modal';
import ProfileManager from '../profile/ProfileManager';
import ChatPanel from '../chat/ChatPanel';
import { useState, useEffect } from 'react';
import { getTotalUnreadCount } from '../../utils/messages';

const ALL_NAV_ITEMS = {
  admin: [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
    { to: '/sites', icon: Building2, label: 'Sites' },
    { to: '/equipements', icon: Wrench, label: 'Equipements' },
    { to: '/planning', icon: CalendarDays, label: 'Planning' },
    { to: '/interventions', icon: ClipboardList, label: 'Interventions' },
    { to: '/stocks', icon: Package, label: 'Stocks' },
    { to: '/inventaires', icon: ClipboardCheck, label: 'Inventaires' },
    { to: '/rapports', icon: FileBarChart, label: 'Rapports' },
  ],
  responsable_maintenance: [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
    { to: '/sites', icon: Building2, label: 'Sites' },
    { to: '/equipements', icon: Wrench, label: 'Equipements' },
    { to: '/planning', icon: CalendarDays, label: 'Planning' },
    { to: '/interventions', icon: ClipboardList, label: 'Interventions' },
    { to: '/stocks', icon: Package, label: 'Stocks (lecture)' },
    { to: '/rapports', icon: FileBarChart, label: 'Rapports' },
  ],
  technicien: [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
    { to: '/planning', icon: CalendarDays, label: 'Planning' },
    { to: '/interventions', icon: ClipboardList, label: 'Mes interventions' },
    { to: '/equipements', icon: Wrench, label: 'Equipements' },
    { to: '/sites', icon: Building2, label: 'Sites' },
    { to: '/stocks', icon: Package, label: 'Stocks (lecture)' },
  ],
  responsable_stock: [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
    { to: '/stocks', icon: Package, label: 'Gestion stocks' },
    { to: '/inventaires', icon: ClipboardCheck, label: 'Inventaires' },
    { to: '/sites', icon: Building2, label: 'Sites' },
    { to: '/interventions', icon: ClipboardList, label: 'Interventions' },
    { to: '/equipements', icon: Wrench, label: 'Equipements' },
  ],
  direction: [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
    { to: '/rapports', icon: FileBarChart, label: 'Rapports' },
    { to: '/sites', icon: Building2, label: 'Sites' },
    { to: '/equipements', icon: Wrench, label: 'Equipements' },
    { to: '/interventions', icon: ClipboardList, label: 'Interventions' },
    { to: '/planning', icon: CalendarDays, label: 'Planning' },
    { to: '/stocks', icon: Package, label: 'Stocks (lecture)' },
  ],
};

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { utilisateur, logout } = useAuth();
  const role = utilisateur?.role || 'technicien';
  const navItems = ALL_NAV_ITEMS[role] || ALL_NAV_ITEMS.technicien;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    if (!utilisateur) return;
    function update() { setChatUnread(getTotalUnreadCount(utilisateur.id)); }
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [utilisateur]);

  function handleLogout() {
    logout();
    setShowLogoutModal(false);
  }

  const sidebarContent = (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900 text-white flex flex-col transition-all duration-300 h-full flex-shrink-0`}>
      <div className="p-4 border-b border-slate-700 flex items-center gap-3 h-16">
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg tracking-tight">GMAO</h1>
            <p className="text-xs text-slate-400">Enterprise</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className={`${collapsed ? 'mx-auto' : 'ml-auto'} p-1.5 rounded-lg hover:bg-slate-700 transition-colors hidden lg:block`}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button onClick={() => setMobileOpen?.(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-700 transition-colors ml-auto">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
            }
          >
            <item.icon size={20} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {role === 'admin' && (
          <>
            <div className="border-t border-slate-700/50 my-4 mx-3" />
            <NavLink to="/admin" onClick={() => setMobileOpen?.(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
              }>
              <Shield size={20} />
              {!collapsed && <span className="text-sm font-medium">Administration</span>}
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        {!collapsed && utilisateur && (
          <div className="mb-3">
            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 mb-1 w-full text-left hover:bg-slate-800 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {utilisateur.prenom?.[0]}{utilisateur.nom?.[0]}
              </div>
              <div className="truncate min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{utilisateur.prenom} {utilisateur.nom}</p>
                <p className="text-xs text-slate-500">{ROLE_LABELS[utilisateur.role] || utilisateur.role}</p>
              </div>
            </button>
          </div>
        )}
        <button onClick={() => setShowChat(true)} className="relative flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors w-full text-sm px-2 py-1.5 rounded-lg hover:bg-slate-800 mb-1">
          <MessageCircle size={16} />
          {!collapsed && 'Messagerie'}
          {chatUnread > 0 && (
            <span className={`${collapsed ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'} w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm`}>
              {chatUnread > 9 ? '9+' : chatUnread}
            </span>
          )}
        </button>
        <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors w-full text-sm px-2 py-1.5 rounded-lg hover:bg-slate-800">
          <LogOut size={16} />
          {!collapsed && 'Deconnexion'}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen?.(false)} />
          <div className="relative h-full w-64">
            {sidebarContent}
          </div>
        </div>
      )}

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirmer la deconnexion">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut size={28} className="text-red-500" />
          </div>
          <p className="text-gray-900 font-medium">Voulez-vous vraiment vous deconnecter ?</p>
          <p className="text-gray-500 text-sm mt-1">Vous devrez vous reconnecter pour acceder a l'application.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => setShowLogoutModal(false)} className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button onClick={handleLogout} className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
              Se deconnecter
            </button>
          </div>
        </div>
      </Modal>

      <ProfileManager isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}
