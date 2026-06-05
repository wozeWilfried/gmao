import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import ActivityLogView from '../components/admin/ActivityLogView';
import CredentialsManager from '../components/admin/CredentialsManager';
import { Users, ClipboardList, Settings, Database, Shield, Key } from 'lucide-react';
import { exporterSauvegardeJSON } from '../utils/exportService';
import storageService from '../utils/storageService';
import toast from 'react-hot-toast';
import { logActivity } from '../utils/activityLogger';

const TABS = [
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'credentials', label: 'Comptes', icon: Key },
  { id: 'activity', label: 'Journal', icon: ClipboardList },
  { id: 'settings', label: 'Parametres', icon: Settings },
  { id: 'data', label: 'Donnees', icon: Database },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const { utilisateur } = useAuth();

  if (utilisateur?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Accès restreint</h2>
          <p className="text-gray-500 mt-1">Seuls les administrateurs peuvent accéder à cette section.</p>
        </div>
      </div>
    );
  }

  function handleResetData() {
    if (!window.confirm('⚠️ Réinitialiser TOUTES les données ? Cette action est irréversible.')) return;
    if (!window.confirm('Confirmation : voulez-vous vraiment effacer toutes les données et revenir aux données initiales ?')) return;
    localStorage.clear();
    toast.success('Données réinitialisées. Rechargement...');
    logActivity('DATA_RESET', 'Réinitialisation complète des données', utilisateur.id);
    setTimeout(() => window.location.reload(), 1000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestion du systeme et des utilisateurs</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'credentials' && <CredentialsManager />}

      {activeTab === 'activity' && <ActivityLogView />}

      {activeTab === 'settings' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres système</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sauvegarde des données</p>
                <p className="text-sm text-gray-500">Exporter toutes les données au format JSON</p>
              </div>
              <button onClick={() => { exporterSauvegardeJSON(); logActivity('EXPORT_BACKUP', 'Sauvegarde manuelle des données', utilisateur.id); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Exporter</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-800">Réinitialiser les données</p>
                <p className="text-sm text-red-600">Efface toutes les données et revient aux données initiales (démo)</p>
              </div>
              <button onClick={handleResetData} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Réinitialiser</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des données</h3>
          <div className="space-y-3">
            {['equipements', 'ordres_travail', 'articles', 'mouvements', 'utilisateurs', 'activity_logs', 'notifications'].map(collection => {
              const count = storageService.getAll(collection).length;
              return (
                <div key={collection} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm capitalize">{collection.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{count} enregistrement(s)</p>
                  </div>
                  <button onClick={() => {
                    const data = storageService.getAll(collection);
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${collection}.json`; a.click();
                    URL.revokeObjectURL(url);
                  }} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">Exporter</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
