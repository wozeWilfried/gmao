import { differenceInDays } from 'date-fns';
import storageService from './storageService';

const PERIODICITE_EN_JOURS = { hebdomadaire: 7, mensuelle: 30, trimestrielle: 90, semestrielle: 180, annuelle: 365 };

export function genererOTPreventifs(equipements, ordresTravail) {
  const nouveauxOT = [];
  const maintenant = new Date();

  equipements.forEach(eq => {
    if (!eq.periodicite || eq.statut === 'hors_service') return;
    const jours = PERIODICITE_EN_JOURS[eq.periodicite];
    if (!jours) return;

    const otPreventifs = ordresTravail.filter(ot =>
      ot.equipementId === eq.id &&
      (ot.type === 'preventif_systematique' || ot.type === 'preventif_conditionnel') &&
      ot.statut !== 'annule'
    ).sort((a, b) => new Date(b.datePlanifiee || b.dateCreation) - new Date(a.datePlanifiee || a.dateCreation));

    const dernierOT = otPreventifs[0];
    const dateDernierOT = dernierOT ? new Date(dernierOT.datePlanifiee || dernierOT.dateCreation) : null;

    let doitCreer = false;
    if (!dateDernierOT) {
      doitCreer = true;
    } else {
      const joursDepuis = differenceInDays(maintenant, dateDernierOT);
      if (joursDepuis >= jours) doitCreer = true;
    }

    if (doitCreer) {
      const nouvelleDate = new Date(maintenant);
      nouvelleDate.setDate(nouvelleDate.getDate() + 7);
      const titrePreventifs = {
        hebdomadaire: 'Maintenance hebdomadaire',
        mensuelle: 'Maintenance mensuelle',
        trimestrielle: 'Maintenance trimestrielle',
        semestrielle: 'Maintenance semestrielle',
        annuelle: 'Maintenance annuelle',
      };
      nouveauxOT.push({
        type: 'preventif_systematique',
        statut: 'planifie',
        equipementId: eq.id,
        priorite: 'normale',
        description: `${titrePreventifs[eq.periodicite] || 'Maintenance'} - ${eq.designation}`,
        technicienIds: [],
        responsableId: null,
        dateCreation: maintenant.toISOString(),
        datePlanifiee: nouvelleDate.toISOString(),
        dureeEstimee: 60,
        dateLimite: new Date(nouvelleDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        articlesNecessaires: [],
        instructionsSecurite: 'Appliquer les procédures standard de sécurité.',
        coutEstime: 0,
        rapportCloture: null,
      });
    }
  });

  return nouveauxOT;
}

export function appliquerGenerationOT() {
  const equipements = storageService.getAll('equipements');
  const ordresTravail = storageService.getAll('ordres_travail');
  const nouveauxOT = genererOTPreventifs(equipements, ordresTravail);
  nouveauxOT.forEach(ot => {
    storageService.create('ordres_travail', ot);
  });
  return nouveauxOT.length;
}
