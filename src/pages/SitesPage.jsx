import { useState } from 'react';
import storageService from '../utils/storageService';
import { useAppData } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import StatusBadge from '../components/shared/StatusBadge';
import { Plus, Edit, Trash2, MapPin, Building2, Phone, Mail, Eye, Activity, Wrench, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SitesPage() {
  const { sites, equipements, ordresTravail, refresh } = useAppData();
  const { utilisateur } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', adresse: '', ville: '', codePostal: '', pays: 'France',
    contactNom: '', contactEmail: '', contactTelephone: '', actif: true,
  });

  function getSiteStats(siteId) {
    const siteNom = siteId ? sites.find(s => s.id === siteId)?.nom : '';
    const eqs = equipements.filter(e => e.localisation?.site === siteNom);
    const eqIds = eqs.map(e => e.id);
    const ots = ordresTravail.filter(ot => eqIds.includes(ot.equipementId));
    return {
      equipements: eqs.length,
      enPanne: eqs.filter(e => e.statut === 'en_panne').length,
      enMaintenance: eqs.filter(e => e.statut === 'en_maintenance').length,
      otActifs: ots.filter(ot => !['cloture', 'annule'].includes(ot.statut)).length,
      otClos: ots.filter(ot => ot.statut === 'cloture').length,
    };
  }

  function handleEdit(site) {
    setFormData({ nom: site.nom, adresse: site.adresse || '', ville: site.ville || '', codePostal: site.codePostal || '', pays: site.pays || 'France', contactNom: site.contactNom || '', contactEmail: site.contactEmail || '', contactTelephone: site.contactTelephone || '', actif: site.actif });
    setEditing(site.id);
    setShowForm(true);
  }

  function handleNew() {
    setFormData({ nom: '', adresse: '', ville: '', codePostal: '', pays: 'France', contactNom: '', contactEmail: '', contactTelephone: '', actif: true });
    setEditing(null);
    setShowForm(true);
  }

  function handleSave() {
    if (!formData.nom.trim()) { toast.error('Le nom du site est requis'); return; }
    try {
      if (editing) {
        storageService.update('sites', editing, formData);
        logActivity('SITE_UPDATE', `Site ${formData.nom} modifie`, utilisateur?.id);
        toast.success('Site modifie');
      } else {
        storageService.create('sites', formData);
        logActivity('SITE_CREATE', `Site ${formData.nom} cree`, utilisateur?.id);
        toast.success('Site cree');
      }
      setShowForm(false);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  function handleDelete(id) {
    const site = sites.find(s => s.id === id);
    const siteNom = site?.nom || '';
    const eqCount = equipements.filter(e => e.localisation?.site === siteNom).length;
    if (eqCount > 0) { toast.error(`Impossible: ${eqCount} equipement(s) lie(s) a ce site`); return; }
    if (!window.confirm(`Supprimer le site ${site?.nom} ?`)) return;
    try {
      storageService.remove('sites', id);
      logActivity('SITE_DELETE', `Site ${site?.nom} supprime`, utilisateur?.id);
      toast.success('Site supprime');
      if (detailId === id) setDetailId(null);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-blue-600 flex-shrink-0" />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Sites</h1>
            <p className="text-gray-500 mt-1 text-sm">{sites.length} site(s) - {equipements.length} equipement(s)</p>
          </div>
        </div>
        <button onClick={handleNew} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0">
          <Plus size={18} /> <span className="hidden sm:inline">Nouveau site</span><span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map(site => {
          const stats = getSiteStats(site.id);
          return (
            <div key={site.id} className={`bg-white border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer ${!site.actif ? 'opacity-60' : ''}`}
              onClick={() => setDetailId(site.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  <h3 className="font-semibold text-gray-900">{site.nom}</h3>
                </div>
                {!site.actif && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Inactif</span>}
              </div>
              <p className="text-xs text-gray-500 mb-3">{site.ville}{site.codePostal ? ` (${site.codePostal})` : ''}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-blue-700">{stats.equipements}</p>
                  <p className="text-blue-600">Equipements</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-amber-700">{stats.otActifs}</p>
                  <p className="text-amber-600">OT actifs</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-red-700">{stats.enPanne}</p>
                  <p className="text-red-600">En panne</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-green-700">{stats.otClos}</p>
                  <p className="text-green-600">OT clos</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Modifier le site' : 'Nouveau site'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Nom du site *</label>
            <input type="text" value={formData.nom} onChange={e => setFormData(f => ({ ...f, nom: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
            <input type="text" value={formData.adresse} onChange={e => setFormData(f => ({ ...f, adresse: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
            <input type="text" value={formData.ville} onChange={e => setFormData(f => ({ ...f, ville: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Code postal</label>
            <input type="text" value={formData.codePostal} onChange={e => setFormData(f => ({ ...f, codePostal: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Pays</label>
            <input type="text" value={formData.pays} onChange={e => setFormData(f => ({ ...f, pays: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Actif</label>
            <select value={formData.actif} onChange={e => setFormData(f => ({ ...f, actif: e.target.checked }))} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value={true}>Oui</option><option value={false}>Non</option>
            </select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Contact nom</label>
            <input type="text" value={formData.contactNom} onChange={e => setFormData(f => ({ ...f, contactNom: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Contact email</label>
            <input type="email" value={formData.contactEmail} onChange={e => setFormData(f => ({ ...f, contactEmail: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Contact telephone</label>
            <input type="tel" value={formData.contactTelephone} onChange={e => setFormData(f => ({ ...f, contactTelephone: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Modifier' : 'Creer'}</button>
        </div>
      </Modal>

      <Modal isOpen={!!detailId} onClose={() => setDetailId(null)} title="Detail du site" size="xl">
        {(() => {
          const site = sites.find(s => s.id === detailId);
          if (!site) return null;
          const stats = getSiteStats(site.id);
          const siteNom = site.nom;
          const siteEquipements = equipements.filter(e => e.localisation?.site === siteNom);
          const siteOT = ordresTravail.filter(ot => siteEquipements.map(e => e.id).includes(ot.equipementId));
          return (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><Building2 size={24} className="text-blue-600" /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{site.nom}</h2>
                  <p className="text-xs text-gray-400 font-mono">{site.id}</p>
                  <p className="text-sm text-gray-500">{site.ville}{site.codePostal ? ` ${site.codePostal}` : ''} - {site.pays}</p>
                  {site.adresse && <p className="text-xs text-gray-400 mt-0.5">{site.adresse}</p>}
                </div>
              </div>
              {(site.contactNom || site.contactEmail || site.contactTelephone) && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Contact</p>
                  {site.contactNom && <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {site.contactNom}</p>}
                  {site.contactEmail && <p className="text-sm flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {site.contactEmail}</p>}
                  {site.contactTelephone && <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {site.contactTelephone}</p>}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-blue-700">{stats.equipements}</p><p className="text-xs text-blue-600">Equipements</p></div>
                <div className="bg-red-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-red-700">{stats.enPanne}</p><p className="text-xs text-red-600">En panne</p></div>
                <div className="bg-amber-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-amber-700">{stats.otActifs}</p><p className="text-xs text-amber-600">OT actifs</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-700">{stats.otClos}</p><p className="text-xs text-green-600">OT clos</p></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Equipements du site ({siteEquipements.length})</h4>
                <div className="space-y-1.5 max-h-48 overflow-auto">
                  {siteEquipements.map(eq => (
                    <div key={eq.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-900">{eq.designation}</span>
                      <StatusBadge status={eq.statut} />
                    </div>
                  ))}
                  {siteEquipements.length === 0 && <p className="text-gray-400 text-sm">Aucun equipement sur ce site</p>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Activites recentes ({siteOT.length})</h4>
                <div className="space-y-1.5 max-h-48 overflow-auto">
                  {siteOT.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)).slice(0, 10).map(ot => (
                    <div key={ot.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="text-gray-700 truncate mr-2">{ot.description}</span>
                      <StatusBadge status={ot.statut} />
                    </div>
                  ))}
                  {siteOT.length === 0 && <p className="text-gray-400 text-sm">Aucune intervention</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button onClick={() => handleEdit(site)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"><Edit size={14} /> Modifier</button>
                <button onClick={() => handleDelete(site.id)} className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1"><Trash2 size={14} /> Supprimer</button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
