import { useState } from 'react';
import storageService from '../utils/storageService';
import { useEquipements } from '../hooks/useEquipements';
import { useAppData } from '../context/AppContext';
import { validerEquipement } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { usePermissions } from '../components/layout/ProtectedRoute';
import DataTable from '../components/shared/DataTable';
import SearchBar from '../components/shared/SearchBar';
import Modal from '../components/shared/Modal';
import StatusBadge from '../components/shared/StatusBadge';
import ExportButtons from '../components/shared/ExportButtons';
import EquipementForm from '../components/equipements/EquipementForm';
import EquipementDetail from '../components/equipements/EquipementDetail';
import { Plus, Eye, Edit, Trash2, AlertTriangle, MapPin, Wrench } from 'lucide-react';
import { createNotification } from '../utils/notifications';
import { MaintenanceIllustration, EmptyStateIllustration } from '../components/shared/Illustrations';
import toast from 'react-hot-toast';

export default function EquipementsPage() {
  const { equipements, equipementsFiltres, filtres, setFiltres, refresh } = useEquipements();
  const { ordresTravail, mouvements } = useAppData();
  const { utilisateur } = useAuth();
  const { peutCreer, peutModifier, peutSupprimer } = usePermissions('equipements');

  function formatLocalisation(loc) {
    if (!loc || typeof loc !== 'object') return loc || '-';
    return [loc.site, loc.batiment, loc.salle, loc.ligne].filter(Boolean).join(' > ') || '-';
  }
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [formData, setFormData] = useState({
    code: '', designation: '', description: '', categorie: 'mecanique',
    localisation: { site: '', batiment: '', salle: '', ligne: '' }, statut: 'en_service', fournisseur: '', dateMiseEnService: '',
    periodicite: 90, dateFinGarantie: '', coutAcquisition: 0,
  });

  function handleEdit(eq) {
    if (!peutModifier) { toast.error('Action non autorisee'); return; }
    setFormData({ ...eq });
    setEditing(eq.id);
    setShowForm(true);
  }

  function handleNew() {
    if (!peutCreer) { toast.error('Action non autorisee'); return; }
    setFormData({
      code: '', designation: '', description: '', categorie: 'mecanique',
      localisation: { site: '', batiment: '', salle: '', ligne: '' }, statut: 'en_service', fournisseur: '', dateMiseEnService: '',
      periodicite: 90, dateFinGarantie: '', coutAcquisition: 0,
    });
    setEditing(null);
    setShowForm(true);
  }

  function handleSave() {
    const erreurs = validerEquipement(formData);
    if (Object.keys(erreurs).length > 0) { toast.error(Object.values(erreurs)[0]); return; }
    try {
      if (editing) {
        const oldEq = equipements.find(e => e.id === editing);
        storageService.update('equipements', editing, formData);
        logActivity('EQUIPEMENT_UPDATE', `Equipement ${editing} modifie`, utilisateur?.id);
        if (oldEq && oldEq.statut !== formData.statut && ['en_panne', 'hors_service'].includes(formData.statut)) {
          createNotification({
            type: 'danger', title: 'Disponibilite - Equipement indisponible',
            message: `${formData.designation} - Statut: ${formData.statut === 'en_panne' ? 'En panne' : 'Hors service'}`,
            lien: '/equipements',
          });
        }
        toast.success('Equipement modifie');
      } else {
        const created = storageService.create('equipements', formData);
        logActivity('EQUIPEMENT_CREATE', `Equipement ${created.id} cree`, utilisateur?.id);
        toast.success('Equipement cree');
      }
      setShowForm(false);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  function handleDelete(id) {
    if (!peutSupprimer) { toast.error('Action non autorisee'); return; }
    if (window.confirm('Supprimer cet equipement ? Cette action est irreversible.')) {
      try {
        storageService.remove('equipements', id);
        logActivity('EQUIPEMENT_DELETE', `Equipement ${id} supprime`, utilisateur?.id);
        toast.success('Equipement supprime');
        if (detailId === id) setDetailId(null);
        refresh();
      } catch (err) { toast.error(err.message); }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Equipements</h1>
          <p className="text-gray-500 mt-1 text-sm">{equipementsFiltres.length} equipement(s) sur {equipements.length}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <ExportButtons titre="Equipements"
            colonnes={['Code', 'Designation', 'Categorie', 'Localisation', 'Statut', 'Cout']}
            lignes={equipements.map(e => [e.code, e.designation, e.categorie, formatLocalisation(e.localisation), e.statut, e.coutAcquisition])}
            data={equipements} />
          {peutCreer && (
            <button onClick={handleNew} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors whitespace-nowrap">
              <Plus size={18} /> <span className="hidden sm:inline">Nouvel equipement</span><span className="sm:hidden">Ajouter</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
        <SearchBar value={filtres.recherche} onChange={v => setFiltres(f => ({ ...f, recherche: v }))} placeholder="Rechercher..." className="w-full sm:max-w-xs" />
        <select value={filtres.categorie} onChange={e => setFiltres(f => ({ ...f, categorie: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Toutes categories</option>
          <option value="mecanique">Mecanique</option><option value="electrique">Electrique</option>
          <option value="hydraulique">Hydraulique</option><option value="pneumatique">Pneumatique</option>
          <option value="utilitaires">Utilitaires</option>
        </select>
        <select value={filtres.statut} onChange={e => setFiltres(f => ({ ...f, statut: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Tous statuts</option>
          <option value="en_service">En service</option><option value="en_panne">En panne</option>
          <option value="en_maintenance">En maintenance</option><option value="hors_service">Hors service</option>
        </select>
      </div>

      {equipementsFiltres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
          <MaintenanceIllustration className="w-48 h-48 object-cover rounded-xl opacity-30" />
          <h3 className="text-lg font-semibold text-gray-500 mt-4">Aucun equipement trouve</h3>
          <p className="text-sm text-gray-400 mt-1">Modifiez vos filtres ou creez un nouvel equipement</p>
        </div>
      ) : (<DataTable
        columns={[
          { Header: 'Code', accessor: 'code', cell: row => <span className="font-mono text-xs font-semibold text-blue-600">{row.code}</span> },
          { Header: 'Designation', accessor: 'designation', cell: row => <span className="font-medium text-gray-900">{row.designation}</span> },
          { Header: 'Categorie', accessor: 'categorie', cell: row => <StatusBadge status={row.categorie} /> },
          { Header: 'Localisation', accessor: 'localisation',
            cell: row => {
              const loc = row.localisation;
              if (!loc || typeof loc !== 'object') return <span className="text-gray-500">{loc || '-'}</span>;
              return (
                <span className="text-gray-500 flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate" title={`${loc.site || ''} > ${loc.batiment || ''} > ${loc.salle || ''} > ${loc.ligne || ''}`}>
                    {formatLocalisation(loc)}
                  </span>
                </span>
              );
            } },
          { Header: 'Statut', accessor: 'statut', cell: row => <StatusBadge status={row.statut} /> },
        ]}
        data={equipementsFiltres}
        onRowClick={row => setDetailId(row.id)}
        actions={row => (
          <>
            <button onClick={() => setDetailId(row.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Voir details"><Eye size={16} /></button>
            {peutModifier && <button onClick={() => handleEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Modifier"><Edit size={16} /></button>}
            {peutSupprimer && <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Supprimer"><Trash2 size={16} /></button>}
          </>
        )}
        />)}
 
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? "Modifier l'equipement" : 'Nouvel equipement'} size="lg">
        <EquipementForm formData={formData} setFormData={setFormData} equipements={equipements} onSave={handleSave} onCancel={() => setShowForm(false)} isEditing={!!editing} />
      </Modal>

      <Modal isOpen={!!detailId} onClose={() => setDetailId(null)} title="Detail equipement" size="xl">
        <EquipementDetail equipementId={detailId} equipements={equipements} ordresTravail={ordresTravail} mouvements={mouvements} onRefresh={refresh} utilisateur={utilisateur} />
      </Modal>
    </div>
  );
}
