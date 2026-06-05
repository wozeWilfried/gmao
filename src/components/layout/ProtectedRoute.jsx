import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { peutFaire, peutVoir, peutPartiel, ROLE_LABELS } from '../../utils/permissions';
import { Shield } from 'lucide-react';

export default function ProtectedRoute({ children, module, action, render }) {
  const { utilisateur } = useAuth();

  if (!utilisateur) return <Navigate to="/login" replace />;

  // Si render est spécifié, on passe les permissions au children
  if (render) {
    const permissions = {
      peutCreer: peutFaire(utilisateur.role, module, 'creer'),
      peutModifier: peutFaire(utilisateur.role, module, 'modifier'),
      peutSupprimer: peutFaire(utilisateur.role, module, 'supprimer'),
      peutVoir: peutVoir(utilisateur.role, module, action || 'consulter'),
      peutPartiel: peutPartiel(utilisateur.role, module, action || 'consulter'),
      peutCloturer: peutFaire(utilisateur.role, module, 'cloturer'),
      peutMouvement: peutFaire(utilisateur.role, module, 'mouvement'),
    };
    return typeof children === 'function' ? children(permissions) : children;
  }

  // Vérification spécifique d'action
  if (module && action) {
    const autorise = peutFaire(utilisateur.role, module, action) ||
                     peutPartiel(utilisateur.role, module, action) ||
                     peutVoir(utilisateur.role, module, action);

    if (!autorise) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-500 text-sm mb-4">
              Votre rôle <span className="font-medium text-gray-700">{ROLE_LABELS[utilisateur.role] || utilisateur.role}</span> ne vous permet pas d'effectuer cette action.
            </p>
            <p className="text-xs text-gray-400">
              Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur.
            </p>
          </div>
        </div>
      );
    }
  }

  // Vérification module générique
  if (module && !action) {
    const autorise = peutVoir(utilisateur.role, module, 'consulter') ||
                     peutPartiel(utilisateur.role, module, 'consulter');
    if (!autorise) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Module non accessible</h2>
            <p className="text-gray-500 text-sm">
              Votre rôle ne vous permet pas d'accéder à ce module.
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
}

// Hook utilitaire pour récupérer les permissions dans un composant
export function usePermissions(module) {
  const { utilisateur } = useAuth();
  if (!utilisateur) return {};
  return {
    peutCreer: peutFaire(utilisateur.role, module, 'creer'),
    peutModifier: peutFaire(utilisateur.role, module, 'modifier'),
    peutSupprimer: peutFaire(utilisateur.role, module, 'supprimer'),
    peutVoir: peutVoir(utilisateur.role, module, 'consulter'),
    peutPartiel: peutPartiel(utilisateur.role, module, 'consulter'),
    peutCloturer: peutFaire(utilisateur.role, module, 'cloturer'),
    peutMouvement: peutFaire(utilisateur.role, module, 'mouvement'),
    peutExporter: peutFaire(utilisateur.role, module, 'exporter'),
    role: utilisateur.role,
  };
}
