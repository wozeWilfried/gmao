import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storageService from '../utils/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const session = storageService.get('session');
    if (session) {
      const user = storageService.getById('utilisateurs', session.userId);
      if (user && user.actif) setUtilisateur(user);
      else storageService.remove('session');
    }
    setChargement(false);
  }, []);

  const login = useCallback((login, motDePasse) => {
    const utilisateurs = storageService.getAll('utilisateurs');
    const user = utilisateurs.find(u => u.login === login && u.actif);
    if (!user) throw new Error('Utilisateur introuvable');
    const hash = btoa(motDePasse);
    if (hash !== user.motDePasseHash) throw new Error('Mot de passe incorrect');
    const session = { userId: user.id, role: user.role, loginAt: new Date().toISOString() };
    storageService.set('session', session);
    setUtilisateur(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    storageService.remove('session');
    setUtilisateur(null);
  }, []);

  return (
    <AuthContext.Provider value={{ utilisateur, login, logout, chargement, estConnecte: !!utilisateur }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
