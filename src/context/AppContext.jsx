import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storageService from '../utils/storageService';
import { seedData } from '../data/seedData';
import { generateAlertesNotifications } from '../utils/notifications';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [equipements, setEquipements] = useState([]);
  const [ordresTravail, setOrdresTravail] = useState([]);
  const [articles, setArticles] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [sites, setSites] = useState([]);
  const [inventaires, setInventaires] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    seedData();
    chargerDonnees();
  }, [refreshKey]);

  useEffect(() => {
    if (equipements.length > 0 && articles.length > 0) {
      generateAlertesNotifications(equipements, articles);
    }
  }, [equipements.length, articles.length]);

  function chargerDonnees() {
    setEquipements(storageService.getAll('equipements'));
    setOrdresTravail(storageService.getAll('ordres_travail'));
    setArticles(storageService.getAll('articles'));
    setMouvements(storageService.getAll('mouvements'));
    setSites(storageService.getAll('sites'));
    setInventaires(storageService.getAll('inventaires'));
    setUtilisateurs(storageService.getAll('utilisateurs'));
  }

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return (
    <AppContext.Provider value={{ equipements, ordresTravail, articles, mouvements, sites, inventaires, utilisateurs, refresh, refreshKey }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppData = () => useContext(AppContext);
