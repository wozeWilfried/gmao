import StatusBadge from '../shared/StatusBadge';

export default function EquipementDetail({ equipementId, onClose, equipements, ordresTravail, mouvements }) {
  const eq = equipements.find(e => e.id === equipementId);
  if (!eq) return <p className="text-gray-500">Équipement introuvable</p>;

  const historiquesOT = ordresTravail.filter(ot => ot.equipementId === eq.id).sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
  const parent = equipements.find(e => e.id === eq.parentId);
  const enfants = equipements.filter(e => e.parentId === eq.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{eq.designation}</h2>
          <p className="text-gray-500 text-sm mt-1">{eq.description}</p>
          <div className="flex gap-2 mt-2">
            <StatusBadge status={eq.statut} />
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{eq.categorie}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Informations générales</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p><span className="text-gray-500">Constructeur :</span> <span className="font-medium">{eq.constructeur || '-'}</span></p>
            <p><span className="text-gray-500">Modèle :</span> <span className="font-medium">{eq.modele || '-'}</span></p>
            <p><span className="text-gray-500">N° série :</span> <span className="font-medium">{eq.numeroSerie || '-'}</span></p>
            <p><span className="text-gray-500">Mise en service :</span> <span className="font-medium">{eq.dateMiseEnService || '-'}</span></p>
            <p><span className="text-gray-500">Fin garantie :</span> <span className="font-medium">{eq.dateFinGarantie || '-'}</span></p>
            <p><span className="text-gray-500">Durée de vie :</span> <span className="font-medium">{eq.dureeVieEstimee || '-'} ans</span></p>
            <p><span className="text-gray-500">Périodicité :</span> <span className="font-medium">{eq.periodicite || 'Aucune'}</span></p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Localisation</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p><span className="text-gray-500">Site :</span> <span className="font-medium">{eq.localisation?.site || '-'}</span></p>
            <p><span className="text-gray-500">Bâtiment :</span> <span className="font-medium">{eq.localisation?.batiment || '-'}</span></p>
            <p><span className="text-gray-500">Salle :</span> <span className="font-medium">{eq.localisation?.salle || '-'}</span></p>
            <p><span className="text-gray-500">Ligne :</span> <span className="font-medium">{eq.localisation?.ligne || '-'}</span></p>
          </div>
          {parent && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">Équipement parent</p>
              <p className="text-sm font-medium text-blue-800">{parent.designation}</p>
            </div>
          )}
          {enfants.length > 0 && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-medium">Sous-équipements ({enfants.length})</p>
              {enfants.map(e => <p key={e.id} className="text-sm text-green-800">{e.designation}</p>)}
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Historique des interventions ({historiquesOT.length})</h4>
        {historiquesOT.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune intervention enregistrée</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-auto">
            {historiquesOT.map(ot => (
              <div key={ot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <p className="font-medium text-gray-900">{ot.description}</p>
                  <p className="text-xs text-gray-400">{ot.id} · {new Date(ot.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ot.type} />
                  <StatusBadge status={ot.statut} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
