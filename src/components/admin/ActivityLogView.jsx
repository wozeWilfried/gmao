import { useState, useEffect } from 'react';
import storageService from '../../utils/storageService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, ClipboardList } from 'lucide-react';
import { EmptyStateIllustration } from '../shared/Illustrations';

const ACTION_LABELS = {
  USER_CREATE: 'Création utilisateur', USER_UPDATE: 'Modification utilisateur',
  USER_DELETE: 'Suppression utilisateur', USER_TOGGLE: 'Activation/désactivation',
  EQUIPEMENT_CREATE: 'Création équipement', EQUIPEMENT_UPDATE: 'Modification équipement',
  EQUIPEMENT_DELETE: 'Suppression équipement',
  OT_CREATE: 'Création OT', OT_UPDATE: 'Modification OT', OT_TRANSITION: 'Transition OT',
  OT_CLOTURE: 'Clôture OT',
  ARTICLE_CREATE: 'Création article', ARTICLE_UPDATE: 'Modification article',
  MOUVEMENT_STOCK: 'Mouvement de stock',
  EXPORT_PDF: 'Export PDF', EXPORT_EXCEL: 'Export Excel', EXPORT_BACKUP: 'Export backup',
  IMPORT_DATA: 'Import de données',
  LOGIN: 'Connexion', LOGOUT: 'Déconnexion',
};

export default function ActivityLogView() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLogs(storageService.getAll('activity_logs'));
    setUsers(storageService.getAll('utilisateurs'));
  }, []);

  const filtered = logs.filter(log => {
    if (!search) return true;
    const s = search.toLowerCase();
    return log.action?.toLowerCase().includes(s) || log.details?.toLowerCase().includes(s) || log.utilisateurId?.toLowerCase().includes(s);
  });

  function getUserName(userId) {
    const u = users.find(u => u.id === userId);
    return u ? `${u.prenom} ${u.nom}` : userId;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Journal d'activité</h3>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Filtrer les activités..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl max-h-[500px] overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyStateIllustration className="w-32 h-32 object-contain opacity-30" />
            <p className="text-gray-400 text-sm mt-3">Aucune activite enregistree</p>
          </div>
        ) : (
          filtered.slice(0, 200).map(log => (
            <div key={log.id} className="flex items-start gap-3 p-3 border-b border-gray-50 hover:bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 mt-0.5">
                {getUserName(log.utilisateurId).split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-900">{getUserName(log.utilisateurId)}</span>
                  <span className="text-gray-500"> - </span>
                  <span className="text-blue-600 font-medium">{ACTION_LABELS[log.action] || log.action}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
