import StatusBadge from '../shared/StatusBadge';
import storageService from '../../utils/storageService';

export default function OTDetail({ otId, onClose, ordresTravail, equipements, articles, mouvements, onRefresh, peutTransitionner, onTransition, utilisateur }) {
  const ot = ordresTravail.find(o => o.id === otId);
  if (!ot) return <p className="text-gray-500">OT introuvable</p>;

  const eq = equipements.find(e => e.id === ot.equipementId);
  const technicien = ot.technicienIds?.[0] ? storageService.getAll('utilisateurs').find(u => u.id === ot.technicienIds[0]) : null;

  const transitionsPossibles = peutTransitionner(ot.statut);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{ot.description}</h2>
          <p className="text-sm text-gray-500">{ot.id}</p>
        </div>
        <StatusBadge status={ot.statut} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">Equipement</p>
          <p className="text-sm font-medium">{eq?.designation || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Type</p>
          <p className="text-sm font-medium"><StatusBadge status={ot.type} /></p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Priorite</p>
          <p className="text-sm font-medium"><StatusBadge status={ot.priorite} /></p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Technicien</p>
          <p className="text-sm font-medium">{technicien ? `${technicien.prenom} ${technicien.nom}` : ot.technicienIds?.length > 0 ? `${ot.technicienIds.length} technicien(s)` : 'Non assigne'}</p>
        </div>
      </div>

      {ot.datePlanifiee && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Date planifiee</p>
            <p className="text-sm font-medium">{new Date(ot.datePlanifiee).toLocaleDateString('fr-FR')}</p>
          </div>
          {ot.dateLimite && (
            <div>
              <p className="text-xs text-gray-500">Date limite</p>
              <p className="text-sm font-medium">{new Date(ot.dateLimite).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>
      )}

      {ot.instructionsSecurite && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-700 font-medium mb-1">Instructions de securite</p>
          <p className="text-sm text-yellow-800">{ot.instructionsSecurite}</p>
        </div>
      )}

      {ot.articlesNecessaires?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">Articles necessaires</p>
          <div className="space-y-1">
            {ot.articlesNecessaires.map((art, i) => {
              const a = articles.find(x => x.id === art.articleId);
              return <p key={i} className="text-sm">{a?.designation || art.articleId} x{art.quantite}</p>;
            })}
          </div>
        </div>
      )}

      {ot.rapportCloture && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rapport de cloture</h3>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-gray-500">Actions realisees:</span> {ot.rapportCloture.actionsRealisees || '-'}</p>
            <p className="text-sm"><span className="text-gray-500">Duree effective:</span> {ot.rapportCloture.dureeEffective} min</p>
            {ot.rapportCloture.observations && <p className="text-sm"><span className="text-gray-500">Observations:</span> {ot.rapportCloture.observations}</p>}
            <p className="text-sm"><span className="text-gray-500">Date realisation:</span> {new Date(ot.rapportCloture.dateRealisation).toLocaleDateString('fr-FR')}</p>
            {ot.rapportCloture.articlesConsommes?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-medium mt-2">Articles consommes</p>
                {ot.rapportCloture.articlesConsommes.map((ac, i) => {
                  const a = articles.find(x => x.id === ac.articleId);
                  return <p key={i} className="text-sm ml-2">- {a?.designation || ac.articleId} x{ac.quantite}</p>;
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {transitionsPossibles.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {transitionsPossibles.map(s => (
            <button key={s} onClick={() => { onTransition(ot.id, s); onClose(); }}
              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              {s === 'cloture' ? 'Cloturer' : `Passer a: ${s}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
