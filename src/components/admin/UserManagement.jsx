import { useState } from 'react';
import storageService from '../../utils/storageService';
import { logActivity } from '../../utils/activityLogger';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../shared/Modal';

const ROLE_LABELS = {
  admin: 'Administrateur', responsable_maintenance: 'Responsable Maintenance',
  technicien: 'Technicien', responsable_stock: 'Responsable Stock', direction: 'Direction',
};

export default function UserManagement() {
  const { utilisateur: currentUser } = useAuth();
  const [users, setUsers] = useState(() => storageService.getAll('utilisateurs'));
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ nom: '', prenom: '', login: '', motDePasse: '', role: 'technicien', email: '', actif: true });

  function refresh() {
    setUsers(storageService.getAll('utilisateurs'));
  }

  function handleEdit(user) {
    setFormData({ nom: user.nom, prenom: user.prenom, login: user.login, motDePasse: '', role: user.role, email: user.email || '', actif: user.actif });
    setEditing(user.id);
    setShowForm(true);
  }

  function handleNew() {
    setFormData({ nom: '', prenom: '', login: '', motDePasse: '', role: 'technicien', email: '', actif: true });
    setEditing(null);
    setShowForm(true);
  }

  function handleSave() {
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.login.trim()) {
      toast.error('Nom, prénom et identifiant sont requis');
      return;
    }
    if (!editing && !formData.motDePasse.trim()) {
      toast.error('Le mot de passe est requis pour un nouvel utilisateur');
      return;
    }
    try {
      if (editing) {
        const updateData = { nom: formData.nom, prenom: formData.prenom, login: formData.login, role: formData.role, email: formData.email, actif: formData.actif };
        if (formData.motDePasse.trim()) updateData.motDePasseHash = btoa(formData.motDePasse);
        storageService.update('utilisateurs', editing, updateData);
        logActivity('USER_UPDATE', `Utilisateur ${formData.prenom} ${formData.nom} modifié`, currentUser?.id);
        toast.success('Utilisateur modifié');
      } else {
        const existing = storageService.getAll('utilisateurs').find(u => u.login === formData.login);
        if (existing) { toast.error('Cet identifiant existe déjà'); return; }
        storageService.create('utilisateurs', {
          nom: formData.nom, prenom: formData.prenom, login: formData.login,
          motDePasseHash: btoa(formData.motDePasse), role: formData.role,
          email: formData.email, actif: formData.actif,
        });
        logActivity('USER_CREATE', `Utilisateur ${formData.prenom} ${formData.nom} créé`, currentUser?.id);
        toast.success('Utilisateur créé');
      }
      setShowForm(false);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  function handleToggleActive(user) {
    storageService.update('utilisateurs', user.id, { actif: !user.actif });
    logActivity('USER_TOGGLE', `Utilisateur ${user.prenom} ${user.nom} ${user.actif ? 'désactivé' : 'activé'}`, currentUser?.id);
    toast.success(`Utilisateur ${user.actif ? 'désactivé' : 'activé'}`);
    refresh();
  }

  function handleDelete(user) {
    if (user.id === currentUser?.id) { toast.error('Vous ne pouvez pas vous supprimer'); return; }
    if (!window.confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    storageService.delete('utilisateurs', user.id);
    logActivity('USER_DELETE', `Utilisateur ${user.prenom} ${user.nom} supprimé`, currentUser?.id);
    toast.success('Utilisateur supprimé');
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h3>
          <p className="text-sm text-gray-500">{users.length} utilisateur(s)</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={18} /> Nouvel utilisateur
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Identifiant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {u.prenom?.[0]}{u.nom?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{u.prenom} {u.nom}</p>
                      <p className="text-xs text-gray-400">{u.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.login}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    <Shield size={12} /> {ROLE_LABELS[u.role] || u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.email || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.actif ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {u.actif ? <UserCheck size={12} /> : <UserX size={12} />}
                    {u.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleEdit(u)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleToggleActive(u)} className={`p-1.5 rounded ${u.actif ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                      {u.actif ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    {u.id !== currentUser?.id && (
                      <button onClick={() => handleDelete(u)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Modifier un utilisateur' : 'Nouvel utilisateur'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input type="text" value={formData.prenom} onChange={e => setFormData(f => ({ ...f, prenom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input type="text" value={formData.nom} onChange={e => setFormData(f => ({ ...f, nom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Identifiant *</label>
              <input type="text" value={formData.login} onChange={e => setFormData(f => ({ ...f, login: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{editing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'}</label>
              <input type="password" value={formData.motDePasse} onChange={e => setFormData(f => ({ ...f, motDePasse: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select value={formData.role} onChange={e => setFormData(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="actif" checked={formData.actif} onChange={e => setFormData(f => ({ ...f, actif: e.target.checked }))} className="rounded" />
            <label htmlFor="actif" className="text-sm text-gray-700">Compte actif</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Modifier' : 'Créer'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
