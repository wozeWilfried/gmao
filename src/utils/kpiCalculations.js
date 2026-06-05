import { subDays, isAfter } from 'date-fns';

export function calculerMTBF(equipementId, ordresTravail, periodeJours = 365) {
  const debut = subDays(new Date(), periodeJours);
  const otCorrectifs = ordresTravail.filter(ot =>
    ot.equipementId === equipementId &&
    ot.type === 'correctif' &&
    ot.statut === 'cloture' &&
    isAfter(new Date(ot.datePlanifiee), debut)
  );
  if (otCorrectifs.length === 0) return null;
  const heuresFonctionnement = periodeJours * 24;
  const tempsTotalReparation = otCorrectifs.reduce((sum, ot) =>
    sum + (ot.rapportCloture?.dureeEffective || 0), 0
  ) / 60;
  return Math.round(((heuresFonctionnement - tempsTotalReparation) / otCorrectifs.length) * 100) / 100;
}

export function calculerMTTR(equipementId, ordresTravail, periodeJours = 365) {
  const debut = subDays(new Date(), periodeJours);
  const otCorrectifs = ordresTravail.filter(ot =>
    ot.equipementId === equipementId &&
    ot.type === 'correctif' &&
    ot.statut === 'cloture' &&
    ot.rapportCloture?.dureeEffective > 0 &&
    isAfter(new Date(ot.datePlanifiee), debut)
  );
  if (otCorrectifs.length === 0) return 0;
  const totalMinutes = otCorrectifs.reduce((sum, ot) =>
    sum + ot.rapportCloture.dureeEffective, 0
  );
  return Math.round((totalMinutes / otCorrectifs.length / 60) * 100) / 100;
}

export function calculerTauxDisponibilite(equipementId, ordresTravail, periodeJours = 30) {
  const mttr = calculerMTTR(equipementId, ordresTravail, periodeJours);
  const mtbf = calculerMTBF(equipementId, ordresTravail, periodeJours);
  if (!mtbf || mtbf === 0) return 100;
  return Math.round((mtbf / (mtbf + mttr)) * 100 * 100) / 100;
}

export function calculerRatioPMCM(ordresTravail, periodeJours = 30) {
  const debut = subDays(new Date(), periodeJours);
  const otRecents = ordresTravail.filter(ot =>
    ot.statut === 'cloture' && isAfter(new Date(ot.datePlanifiee), debut)
  );
  if (otRecents.length === 0) return 0;
  const preventifs = otRecents.filter(ot => ot.type.startsWith('preventif')).length;
  return Math.round((preventifs / otRecents.length) * 100);
}

export function calculerCoutMaintenance(ordresTravail, mouvements, articles, periodeJours = 30) {
  const debut = subDays(new Date(), periodeJours);
  const otRecents = ordresTravail.filter(ot =>
    ot.statut === 'cloture' && isAfter(new Date(ot.datePlanifiee), debut)
  );
  const otIds = new Set(otRecents.map(ot => ot.id));
  const coutPieces = mouvements
    .filter(m => m.type === 'sortie' && otIds.has(m.otId))
    .reduce((sum, m) => sum + (m.quantite * m.coutUnitaireApplique), 0);
  const coutMainOeuvre = otRecents.reduce((sum, ot) => {
    const heures = (ot.rapportCloture?.dureeEffective || 0) / 60;
    return sum + (heures * 45);
  }, 0);
  return { coutPieces: Math.round(coutPieces * 100) / 100, coutMainOeuvre: Math.round(coutMainOeuvre * 100) / 100, total: Math.round((coutPieces + coutMainOeuvre) * 100) / 100 };
}

export function calculerParetoDefaillances(equipements, ordresTravail, periodeJours = 365) {
  const debut = subDays(new Date(), periodeJours);
  const compteur = {};
  ordresTravail
    .filter(ot => ot.type === 'correctif' && ot.datePlanifiee && isAfter(new Date(ot.datePlanifiee), debut))
    .forEach(ot => { compteur[ot.equipementId] = (compteur[ot.equipementId] || 0) + 1; });
  return Object.entries(compteur)
    .map(([id, count]) => ({ equipement: equipements.find(e => e.id === id), nbPannes: count }))
    .filter(item => item.equipement)
    .sort((a, b) => b.nbPannes - a.nbPannes);
}

export function getKPISynthese(equipements, ordresTravail, mouvements, articles, periodeJours = 365) {
  const totalEQ = equipements.length;
  const enPanne = equipements.filter(e => e.statut === 'en_panne').length;
  const enMaintenance = equipements.filter(e => e.statut === 'en_maintenance').length;
  const actifs = equipements.filter(e => e.statut === 'en_service').length;
  const otEnCours = ordresTravail.filter(o => o.statut === 'en_cours' || o.statut === 'planifie').length;
  const otClos = ordresTravail.filter(o => o.statut === 'cloture').length;
  const ratioPM = calculerRatioPMCM(ordresTravail, periodeJours);
  const couts = calculerCoutMaintenance(ordresTravail, mouvements, articles, periodeJours);
  const stockAlert = articles.filter(a => a.stockActuel <= a.stockMinimum).length;
  const tauxDispo = totalEQ > 0 ? Math.round(((totalEQ - enPanne - enMaintenance) / totalEQ) * 100) : 0;
  return { totalEQ, enPanne, enMaintenance, actifs, otEnCours, otClos, ratioPM, couts, stockAlert, tauxDispo };
}
