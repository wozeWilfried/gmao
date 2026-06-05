import { useState, useCallback } from 'react';
import { useAppData } from '../context/AppContext';
import storageService from '../utils/storageService';

export function useEquipements() {
  const { equipements: allEquipements, refresh: appRefresh } = useAppData();
  const [filtres, setFiltres] = useState({ recherche: '', categorie: '', statut: '' });

  const refresh = useCallback(() => appRefresh(), [appRefresh]);

  const getArbreEquipements = useCallback(() => {
    const racines = allEquipements.filter(e => !e.parentId);
    function getEnfants(parentId) {
      return allEquipements.filter(e => e.parentId === parentId).map(e => ({ ...e, enfants: getEnfants(e.id) }));
    }
    return racines.map(e => ({ ...e, enfants: getEnfants(e.id) }));
  }, [allEquipements]);

  const equipementsFiltres = allEquipements.filter(eq => {
    if (filtres.categorie && eq.categorie !== filtres.categorie) return false;
    if (filtres.statut && eq.statut !== filtres.statut) return false;
    if (filtres.recherche) {
      const r = filtres.recherche.toLowerCase();
      return eq.designation?.toLowerCase().includes(r) ||
        eq.code?.toLowerCase().includes(r) ||
        eq.localisation?.toLowerCase().includes(r) ||
        eq.fournisseur?.toLowerCase().includes(r);
    }
    return true;
  });

  return { equipements: allEquipements, equipementsFiltres, filtres, setFiltres, refresh, getArbreEquipements };
}

export function useOrdresTravail() {
  const { ordresTravail: allOT, equipements, refresh: appRefresh } = useAppData();
  const [filtres, setFiltres] = useState({ recherche: '', type: '', statut: '', priorite: '' });

  const refresh = useCallback(() => appRefresh(), [appRefresh]);

  const TRANSITIONS = {
    demande: ['planifie', 'annule'],
    planifie: ['en_cours', 'annule'],
    en_cours: ['en_attente', 'cloture'],
    en_attente: ['en_cours', 'annule'],
    cloture: [],
    annule: [],
  };

  const peutTransitioner = useCallback((statut) => {
    return TRANSITIONS[statut] || [];
  }, []);

  const ordresFiltres = allOT.filter(ot => {
    if (filtres.type && ot.type !== filtres.type) return false;
    if (filtres.statut && ot.statut !== filtres.statut) return false;
    if (filtres.priorite && ot.priorite !== filtres.priorite) return false;
    if (filtres.recherche) {
      const r = filtres.recherche.toLowerCase();
      return ot.description?.toLowerCase().includes(r) || ot.id?.toLowerCase().includes(r);
    }
    return true;
  });

  return { ordresTravail: allOT, equipementsDispo: equipements, ordresFiltres, filtres, setFiltres, refresh, peutTransitioner, TRANSITIONS };
}

export function useStocks() {
  const { articles: allArticles, mouvements: allMouvements, refresh: appRefresh } = useAppData();
  const [filtres, setFiltres] = useState({ recherche: '', categorie: '', stockFaible: false });

  const refresh = useCallback(() => appRefresh(), [appRefresh]);

  const articlesFiltres = allArticles.filter(a => {
    if (filtres.categorie && a.categorie !== filtres.categorie) return false;
    if (filtres.stockFaible && a.stockActuel > a.stockMinimum) return false;
    if (filtres.recherche) {
      const r = filtres.recherche.toLowerCase();
      return a.designation?.toLowerCase().includes(r) || a.reference?.toLowerCase().includes(r);
    }
    return true;
  });

  return { articles: allArticles, articlesFiltres, mouvements: allMouvements, filtres, setFiltres, refresh };
}
