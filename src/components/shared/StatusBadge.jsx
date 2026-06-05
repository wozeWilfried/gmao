const STATUS_STYLES = {
  en_service: 'bg-green-100 text-green-800',
  en_panne: 'bg-red-100 text-red-800',
  en_maintenance: 'bg-yellow-100 text-yellow-800',
  hors_service: 'bg-gray-100 text-gray-800',
  planifie: 'bg-blue-100 text-blue-800',
  en_cours: 'bg-indigo-100 text-indigo-800',
  en_attente: 'bg-orange-100 text-orange-800',
  cloture: 'bg-green-100 text-green-800',
  annule: 'bg-red-100 text-red-800',
  demande: 'bg-purple-100 text-purple-800',
  haute: 'bg-red-100 text-red-800',
  urgente: 'bg-red-100 text-red-800 font-bold',
  normale: 'bg-blue-100 text-blue-800',
  basse: 'bg-gray-100 text-gray-800',
  correctif: 'bg-red-100 text-red-800',
  preventif_systematique: 'bg-blue-100 text-blue-800',
  preventif_conditionnel: 'bg-cyan-100 text-cyan-800',
  amelioratif: 'bg-purple-100 text-purple-800',
  entree: 'bg-green-100 text-green-800',
  sortie: 'bg-red-100 text-red-800',
  consommable: 'bg-blue-100 text-blue-800',
  piece_rechange: 'bg-purple-100 text-purple-800',
};

export default function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-800';
  const labels = {
    en_service: 'En service', en_panne: 'En panne', en_maintenance: 'En maintenance',
    hors_service: 'Hors service', planifie: 'Planifié', en_cours: 'En cours',
    en_attente: 'En attente', cloture: 'Clôturé', annule: 'Annulé', demande: 'Demande',
    haute: 'Haute', urgente: 'Urgente', normale: 'Normale', basse: 'Basse',
    correctif: 'Correctif', preventif_systematique: 'Préventif systématique',
    preventif_conditionnel: 'Préventif conditionnel', amelioratif: 'Amélioratif',
    entree: 'Entrée', sortie: 'Sortie', consommable: 'Consommable', piece_rechange: 'Pièce rechange',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>
      {labels[status] || status}
    </span>
  );
}
