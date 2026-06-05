import { useState, useMemo } from 'react';
import storageService from '../utils/storageService';
import { useOrdresTravail } from '../hooks/useEquipements';
import { useAppData } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { usePermissions } from '../components/layout/ProtectedRoute';
import { validerOT } from '../utils/validators';
import { createNotification } from '../utils/notifications';
import DataTable from '../components/shared/DataTable';
import SearchBar from '../components/shared/SearchBar';
import Modal from '../components/shared/Modal';
import StatusBadge from '../components/shared/StatusBadge';
import OTForm from '../components/interventions/OTForm';
import OTDetail from '../components/interventions/OTDetail';
import { Plus, Eye, Edit, ArrowRight, ClipboardList, UserCheck, AlertTriangle, Wrench } from 'lucide-react';
import { MaintenanceIllustration } from '../components/shared/Illustrations';
import toast from 'react-hot-toast';

export default function InterventionsPage() {
  const { ordresTravail, ordresFiltres, filtres, setFiltres, refresh, peutTransitioner } = useOrdresTravail();
  const { equipements, articles, mouvements, utilisateurs } = useAppData();
  const { utilisateur } = useAuth();
  const { peutCreer, peutModifier, peutCloturer, peutPartiel, role } = usePermissions('interventions');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'preventif_systematique', statut: 'demande', equipementId: '', priorite: 'normale',
    description: '', technicienIds: [], responsableId: utilisateur?.id || '',
    dateCreation: new Date().toISOString().split('T')[0], datePlanifiee: '',
    dureeEstimee: 60, dateLimite: '', articlesNecessaires: [],
    instructionsSecurite: '', coutEstime: 0, rapportCloture: null,
  });

  const mesOT = useMemo(() =>
    role === 'technicien' ? ordresTravail.filter(ot => ot.technicienIds?.includes(utilisateur?.id)) : null,
    [ordresTravail, utilisateur, role]
  );
  const dataSource = mesOT !== null ? mesOT : ordresFiltres;
  const titre = role === 'technicien' ? 'Mes interventions' : 'Interventions';

  const peutCreerOT = peutCreer || (role === 'technicien' && peutPartiel);

  function handleEdit(ot) {
    if (!peutModifier) { toast.error('Action non autorisee'); return; }
    setFormData({ ...ot, dateCreation: ot.dateCreation?.split('T')[0] || '', datePlanifiee: ot.datePlanifiee?.split('T')[0] || '', dateLimite: ot.dateLimite?.split('T')[0] || '' });
    setEditing(ot.id);
    setShowForm(true);
  }

  function handleNew() {
    if (!peutCreerOT) { toast.error('Action non autorisee'); return; }
    setFormData({
      type: 'preventif_systematique', statut: 'demande',
      equipementId: '', priorite: 'normale', description: '',
      technicienIds: role === 'technicien' ? [utilisateur?.id] : [],
      responsableId: utilisateur?.id || '',
      dateCreation: new Date().toISOString().split('T')[0], datePlanifiee: '',
      dureeEstimee: 60, dateLimite: '', articlesNecessaires: [],
      instructionsSecurite: '', coutEstime: 0, rapportCloture: null,
    });
    setEditing(null);
    setShowForm(true);
  }

  function handleSave() {
    const erreurs = validerOT(formData);
    if (Object.keys(erreurs).length > 0) { toast.error(Object.values(erreurs)[0]); return; }
    try {
      if (editing) {
        const oldOT = ordresTravail.find(o => o.id === editing);
        storageService.update('ordres_travail', editing, formData);
        logActivity('OT_UPDATE', `OT ${editing} modifie`, utilisateur?.id);
        const newTechs = formData.technicienIds || [];
        const oldTechs = oldOT?.technicienIds || [];
        const added = newTechs.filter(t => !oldTechs.includes(t));
        added.forEach(tId => {
          const tech = utilisateurs.find(u => u.id === tId);
          createNotification({
            type: 'info', title: 'Nouvelle intervention assignee',
            message: `${formData.description?.substring(0, 60)} - ${tech?.prenom || ''} ${tech?.nom || ''}`,
            destinataireId: tId, lien: '/interventions',
          });
        });
        toast.success('OT modifie');
      } else {
        const otWithDate = { ...formData, dateCreation: new Date().toISOString() };
        const created = storageService.create('ordres_travail', otWithDate);
        logActivity('OT_CREATE', `OT ${created.id} cree`, utilisateur?.id);
        (formData.technicienIds || []).forEach(tId => {
          const tech = utilisateurs.find(u => u.id === tId);
          createNotification({
            type: 'info', title: 'Nouvelle intervention assignee',
            message: `${formData.description?.substring(0, 60)} - ${tech?.prenom || ''} ${tech?.nom || ''}`,
            destinataireId: tId, lien: '/interventions',
          });
        });
        toast.success('OT cree');
      }
      setShowForm(false);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  function handleTransition(otId, newStatut) {
    const ot = ordresTravail.find(o => o.id === otId);
    if (!ot) return;
    if (newStatut === 'cloture' && !peutCloturer && role !== 'technicien') {
      toast.error('Vous n etes pas autorise a cloturer des OT');
      return;
    }
    if (newStatut === 'cloture') {
      const clotureData = {
        statut: 'cloture',
        rapportCloture: { actionsRealisees: '', dureeEffective: 0, observations: '', articlesConsommes: [], dateRealisation: new Date().toISOString() },
      };
      storageService.update('ordres_travail', otId, clotureData);
      logActivity('OT_CLOTURE', `OT ${otId} cloture`, utilisateur?.id);
    } else {
      storageService.update('ordres_travail', otId, { statut: newStatut });
      logActivity('OT_TRANSITION', `OT ${otId}: ${ot.statut} - ${newStatut}`, utilisateur?.id);
    }
    toast.success(`OT ${otId} - ${newStatut}`);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{titre}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {role === 'technicien'
              ? `${dataSource.length} intervention(s) assignee(s)`
              : `${ordresTravail.length} ordre(s) de travail`}
          </p>
        </div>
        {peutCreerOT && (
          <button onClick={handleNew} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0">
            <Plus size={18} /> <span className="hidden sm:inline">Nouvel OT</span><span className="sm:hidden">Ajouter</span>
          </button>
        )}
      </div>

      {role !== 'technicien' && role !== 'direction' && (
        <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
          <SearchBar value={filtres.recherche} onChange={v => setFiltres(f => ({ ...f, recherche: v }))} placeholder="Rechercher..." className="w-full sm:max-w-xs" />
          <select value={filtres.type} onChange={e => setFiltres(f => ({ ...f, type: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tous types</option>
            <option value="correctif">Correctif</option>
            <option value="preventif_systematique">Preventif</option>
            <option value="amelioratif">Amelioratif</option>
          </select>
          <select value={filtres.statut} onChange={e => setFiltres(f => ({ ...f, statut: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tous statuts</option>
            <option value="demande">Demande</option><option value="planifie">Planifie</option>
            <option value="en_cours">En cours</option><option value="en_attente">En attente</option>
            <option value="cloture">Cloture</option><option value="annule">Annule</option>
          </select>
          <select value={filtres.priorite} onChange={e => setFiltres(f => ({ ...f, priorite: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Toutes priorites</option>
            <option value="urgente">Urgente</option><option value="haute">Haute</option>
            <option value="normale">Normale</option><option value="basse">Basse</option>
          </select>
        </div>
      )}

      {dataSource.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
          <MaintenanceIllustration className="w-48 h-48 object-cover rounded-xl opacity-30" />
          <h3 className="text-lg font-semibold text-gray-500 mt-4">{role === 'technicien' ? 'Aucune intervention assignee' : 'Aucun ordre de travail'}</h3>
          <p className="text-sm text-gray-400 mt-1">Les interventions apparaitront ici une fois creees</p>
        </div>
      ) : (
      <DataTable
        columns={[
          { Header: 'ID', accessor: 'id', cell: row => <span className="font-mono text-xs font-medium text-gray-500">{row.id}</span> },
          { Header: 'Description', accessor: 'description', cell: row => <span className="font-medium text-gray-900 max-w-xs truncate block">{row.description}</span> },
          { Header: 'Type', accessor: 'type', cell: row => <StatusBadge status={row.type} /> },
          { Header: 'Statut', accessor: 'statut', cell: row => <StatusBadge status={row.statut} /> },
          { Header: 'Priorite', accessor: 'priorite', cell: row => <StatusBadge status={row.priorite} /> },
          { Header: 'Equipement', accessor: 'equipementId', cell: row => equipements.find(e => e.id === row.equipementId)?.designation?.substring(0, 30) || '-' },
          { Header: 'Date', accessor: 'datePlanifiee', cell: row => row.datePlanifiee ? new Date(row.datePlanifiee).toLocaleDateString('fr-FR') : '-' },
        ]}
        data={dataSource}
        onRowClick={row => setDetailId(row.id)}
        actions={row => (
          <>
            <button onClick={() => setDetailId(row.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Voir detailles"><Eye size={16} /></button>
            {peutModifier && (row.statut === 'demande' || row.statut === 'planifie') && (
              <button onClick={() => handleEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Modifier"><Edit size={16} /></button>
            )}
            {peutTransitioner(row.statut).filter(s => {
              if (s === 'cloture') return role === 'technicien' || peutCloturer;
              if (s === 'annuler') return role === 'admin' || role === 'responsable_maintenance';
              return true;
            }).map(nextStatut => (
              <button key={nextStatut} onClick={() => handleTransition(row.id, nextStatut)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded" title={`Passer a ${nextStatut}`}>
                <ArrowRight size={16} />
              </button>
            ))}
          </>
        )}
      />)}
 
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? "Modifier l'OT" : 'Nouvel ordre de travail'} size="lg">
        <OTForm formData={formData} setFormData={setFormData} equipements={equipements} articles={articles}
          utilisateurs={storageService.getAll('utilisateurs')} onSave={handleSave} onCancel={() => setShowForm(false)} isEditing={!!editing} />
      </Modal>

      <Modal isOpen={!!detailId} onClose={() => setDetailId(null)} title="Detail de l'ordre de travail" size="xl">
        <OTDetail otId={detailId} onClose={() => setDetailId(null)} ordresTravail={ordresTravail}
          equipements={equipements} articles={articles} mouvements={mouvements} onRefresh={refresh}
          peutTransitionner={peutTransitioner} onTransition={handleTransition} utilisateur={utilisateur} />
      </Modal>
    </div>
  );
}
