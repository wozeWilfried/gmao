import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, X, AlertTriangle, Info, AlertCircle, Package } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ICONS = {
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  stock: Package,
};

const COLORS = {
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  stock: 'bg-purple-50 border-purple-200 text-purple-800',
};

export default function NotificationCenter() {
  const { notifications, unreadCount, lire, toutLire, supprimer, charger } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleClickNotif(notif) {
    lire(notif.id);
    if (notif.lien) navigate(notif.lien);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={toutLire} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1" title="Tout marquer comme lu">
                  <CheckCheck size={14} /> Tout lire
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                Aucune notification
              </div>
            ) : (
              notifications.slice(0, 50).map(notif => {
                const Icon = ICONS[notif.type] || Info;
                return (
                  <div key={notif.id}
                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 group ${!notif.lue ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleClickNotif(notif)}>
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${COLORS[notif.type] || COLORS.info}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); supprimer(notif.id); }}
                            className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                            title="Supprimer">
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
