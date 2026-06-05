import { useMemo } from 'react';
import { getKPISynthese, calculerMTBF, calculerMTTR, calculerTauxDisponibilite, calculerParetoDefaillances } from '../utils/kpiCalculations';

export function useKPIs(equipements, ordresTravail, mouvements, articles, periodeJours = 365) {
  const synthese = useMemo(() =>
    getKPISynthese(equipements, ordresTravail, mouvements, articles, periodeJours),
    [equipements, ordresTravail, mouvements, articles, periodeJours]
  );

  const parEquipement = useMemo(() => {
    return equipements.map(eq => ({
      ...eq,
      mtbf: calculerMTBF(eq.id, ordresTravail, periodeJours),
      mttr: calculerMTTR(eq.id, ordresTravail, periodeJours),
      tauxDispo: calculerTauxDisponibilite(eq.id, ordresTravail, periodeJours),
      nbOT: ordresTravail.filter(ot => ot.equipementId === eq.id).length,
      nbCorrectifs: ordresTravail.filter(ot => ot.equipementId === eq.id && ot.type === 'correctif').length,
    }));
  }, [equipements, ordresTravail, periodeJours]);

  const pareto = useMemo(() =>
    calculerParetoDefaillances(equipements, ordresTravail, periodeJours),
    [equipements, ordresTravail, periodeJours]
  );

  const statsOT = useMemo(() => {
    const total = ordresTravail.length;
    const stats = {};
    ordresTravail.forEach(ot => {
      stats[ot.statut] = (stats[ot.statut] || 0) + 1;
    });
    return { total, repartition: stats };
  }, [ordresTravail]);

  const coutsParMois = useMemo(() => {
    const mois = {};
    const debut = Date.now() - periodeJours * 24 * 60 * 60 * 1000;
    ordresTravail.filter(ot =>
      ot.statut === 'cloture' &&
      ot.rapportCloture?.dateRealisation &&
      new Date(ot.rapportCloture.dateRealisation).getTime() > debut
    ).forEach(ot => {
      const date = new Date(ot.rapportCloture.dateRealisation);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!mois[key]) mois[key] = { mois: key, coutPieces: 0, coutMainOeuvre: 0, total: 0 };
      const heures = (ot.rapportCloture.dureeEffective || 0) / 60;
      const coutMO = Math.round(heures * 45 * 100) / 100;
      mois[key].coutMainOeuvre += coutMO;
      mois[key].total += coutMO;
    });
    mouvements.filter(m =>
      m.type === 'sortie' &&
      m.otId &&
      new Date(m.date).getTime() > debut
    ).forEach(m => {
      const date = new Date(m.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!mois[key]) mois[key] = { mois: key, coutPieces: 0, coutMainOeuvre: 0, total: 0 };
      const cout = (m.quantite * m.coutUnitaireApplique);
      mois[key].coutPieces += cout;
      mois[key].total += cout;
    });
    return Object.values(mois).sort((a, b) => a.mois.localeCompare(b.mois));
  }, [ordresTravail, mouvements, periodeJours]);

  return { synthese, parEquipement, pareto, statsOT, coutsParMois };
}
