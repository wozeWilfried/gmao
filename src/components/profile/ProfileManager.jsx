import { useState, useEffect } from 'react';
import storageService from '../../utils/storageService';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLogger';
import { X, Save, Edit2, Shield, Phone, Mail, User, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_LABELS = {
  admin: 'Administrateur', responsable_maintenance: 'Responsable Maintenance',
  technicien: 'Technicien', responsable_stock: 'Responsable Stock', direction: 'Direction',
};

const GRADIENTS = [
  'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600', 'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600', 'from-lime-500 to-green-600',
];

function getGradient(id) {
  const num = parseInt(id?.replace(/\D/g, '') || '0', 10);
  return GRADIENTS[num % GRADIENTS.length];
}

export default function ProfileManager({ isOpen, onClose }) {
  const { utilisateur: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen]);

  function refresh() {
    const all = storageService.getAll('utilisateurs');
    setUsers(all);
  }

  function startEdit(user) {
    setEditingId(user.id);
    setFormData({
      nom: user.nom, prenom: user.prenom, email: user.email || '',
      telephone: user.telephone || '', motDePasse: '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({});
  }

  function handleChange(field, value) {
    setFormData(f => ({ ...f, [field]: value }));
  }

  function handleSave(user) {
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      toast.error('Le nom et le prenom sont requis');
      return;
    }
    try {
      const updateData = {
        nom: formData.nom, prenom: formData.prenom,
        email: formData.email, telephone: formData.telephone,
      };
      if (formData.motDePasse.trim()) {
        updateData.motDePasseHash = btoa(formData.motDePasse);
      }
      storageService.update('utilisateurs', user.id, updateData);
      logActivity('PROFILE_UPDATE', `Profil de ${formData.prenom} ${formData.nom} modifie`, currentUser?.id);
      toast.success('Profil mis a jour');
      setEditingId(null);
      setFormData({});
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-slide-up z-10 mx-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white text-lg font-bold">Gestion des profils</h2>
            <p className="text-blue-200 text-sm">{users.length} utilisateur(s) - {isAdmin ? 'Tous les profils' : 'Votre profil'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {users.map((user, idx) => {
            const isEditing = editingId === user.id;
            const isCurrentUser = user.id === currentUser?.id;
            if (!isAdmin && !isCurrentUser) return null;

            return (
              <div key={user.id} className={`border rounded-xl transition-all ${isEditing ? 'border-blue-300 ring-2 ring-blue-100 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradient(user.id)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {user.prenom?.[0]}{user.nom?.[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.prenom} {user.nom}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                              <Shield size={11} /> {ROLE_LABELS[user.role] || user.role}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs text-blue-500 font-medium">(Vous)</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => isEditing ? cancelEdit() : startEdit(user)}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isEditing ? 'bg-gray-100 text-gray-500' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Mail size={14} className="flex-shrink-0" />
                          <span className="truncate">{user.email || 'Non renseigne'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Phone size={14} className="flex-shrink-0" />
                          <span>{user.telephone || 'Non renseigne'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Prenom *</label>
                          <div className="relative">
                            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={formData.prenom} onChange={e => handleChange('prenom', e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
                          <div className="relative">
                            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={formData.nom} onChange={e => handleChange('nom', e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Telephone</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="tel" value={formData.telephone} onChange={e => handleChange('telephone', e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Nouveau mot de passe (optionnel)</label>
                          <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" value={formData.motDePasse} onChange={e => handleChange('motDePasse', e.target.value)}
                              placeholder="Laisser vide pour conserver l'actuel"
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          Annuler
                        </button>
                        <button onClick={() => handleSave(user)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                          <Save size={16} /> Enregistrer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
