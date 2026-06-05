import { useState, useEffect } from 'react';
import storageService from '../../utils/storageService';
import { ROLE_LABELS } from '../../utils/permissions';
import { Eye, EyeOff, Key, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CredentialsManager() {
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ login: '', nouveauMotDePasse: '' });

  useEffect(() => {
    setUsers(storageService.getAll('utilisateurs'));
  }, []);

  function refreshUsers() {
    setUsers(storageService.getAll('utilisateurs'));
  }

  function togglePassword(id) {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditForm({ login: user.login, nouveauMotDePasse: '' });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ login: '', nouveauMotDePasse: '' });
  }

  function saveEdit(id) {
    if (!editForm.login.trim()) { toast.error('Le login ne peut pas etre vide'); return; }
    const updates = { login: editForm.login.trim() };
    if (editForm.nouveauMotDePasse.trim()) {
      if (editForm.nouveauMotDePasse.length < 4) { toast.error('Le mot de passe doit faire au moins 4 caracteres'); return; }
      updates.motDePasseHash = btoa(editForm.nouveauMotDePasse.trim());
    }
    try {
      storageService.update('utilisateurs', id, updates);
      toast.success('Compte mis a jour');
      setEditingId(null);
      refreshUsers();
    } catch (err) { toast.error(err.message); }
  }

  function resetPassword(id) {
    const newPwd = 'mdp123';
    try {
      storageService.update('utilisateurs', id, { motDePasseHash: btoa(newPwd) });
      toast.success(`Mot de passe reinitialise a "${newPwd}"`);
      refreshUsers();
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des comptes</h3>
          <p className="text-sm text-gray-500">Consultez et modifiez les identifiants de connexion</p>
        </div>
        <button onClick={refreshUsers} className="text-sm text-blue-600 hover:text-blue-700">Actualiser</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Identifiant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom complet</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mot de passe</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                {editingId === user.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input type="text" value={editForm.login}
                        onChange={e => setEditForm(f => ({ ...f, login: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{user.prenom} {user.nom}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ROLE_LABELS[user.role]}</span></td>
                    <td className="px-4 py-3">
                      <input type="text" placeholder="Nouveau mot de passe"
                        value={editForm.nouveauMotDePasse}
                        onChange={e => setEditForm(f => ({ ...f, nouveauMotDePasse: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => saveEdit(user.id)} className="text-green-600 hover:text-green-700 text-xs font-medium mr-2">Sauver</button>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 text-xs">Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <UserIcon size={14} className="text-gray-400" />
                        <span className="font-mono text-sm font-medium text-gray-900">{user.login}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{user.prenom} {user.nom}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ROLE_LABELS[user.role]}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-gray-400" />
                        <span className="font-mono text-sm text-gray-500">
                          {showPasswords[user.id] ? atob(user.motDePasseHash) : '••••••••'}
                        </span>
                        <button onClick={() => togglePassword(user.id)} className="text-gray-400 hover:text-gray-600">
                          {showPasswords[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(user)} className="text-blue-600 hover:text-blue-700 text-xs font-medium mr-3">Modifier</button>
                      <button onClick={() => resetPassword(user.id)} className="text-amber-600 hover:text-amber-700 text-xs">Reset</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Les mots de passe sont stockes sous forme hashee (base64). Le bouton "Reset" reinitialise le mot de passe a "mdp123".
      </p>
    </div>
  );
}
