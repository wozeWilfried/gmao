import { useMemo } from 'react';
import { Wrench, ClipboardList, Package, AlertTriangle, TrendingUp, Clock, DollarSign, ArrowRight, Activity, UserCheck, Calendar, BarChart3, Truck, Eye, CheckCircle, Shield } from 'lucide-react';
import { useAppData } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useKPIs } from '../hooks/useKPIs';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import KPICard from '../components/rapports/KPICard';
import ChartOTStatus from '../components/rapports/ChartOTStatus';
import ChartCouts from '../components/rapports/ChartCouts';
import ParetoDefaillances from '../components/rapports/ParetoDefaillances';
import storageService from '../utils/storageService';

function DashboardTechnicien({ synthese, equipements, ordresTravail, articles, utilisateur, navigate }) {
  const mesOT = useMemo(() =>
    ordresTravail.filter(ot => ot.technicienIds?.includes(utilisateur?.id)),
    [ordresTravail, utilisateur]
  );
  const otEnCours = mesOT.filter(ot => ot.statut === 'en_cours');
  const otPlanifies = mesOT.filter(ot => ot.statut === 'planifie');
  const otClos = mesOT.filter(ot => ot.statut === 'cloture');
  const urgents = mesOT.filter(ot => ot.priorite === 'urgente' && ot.statut !== 'cloture' && ot.statut !== 'annule');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Bonjour, {utilisateur?.prenom}</h1>
            <p className="text-emerald-100 mt-1 text-sm lg:text-base">Voici votre tableau de bord technicien</p>
          </div>
          <div className="sm:text-right text-emerald-100 text-xs lg:text-sm">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => navigate('/interventions')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg transition-colors">
            <ClipboardList size={16} /> Voir mes interventions
          </button>
          <button onClick={() => navigate('/equipements')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg transition-colors">
            <Wrench size={16} /> Consulter equipements
          </button>
        </div>
      </div>

      {urgents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <AlertTriangle size={18} /> Interventions urgentes ({urgents.length})
          </div>
          {urgents.map(ot => (
            <div key={ot.id} className="flex items-center justify-between py-1 text-sm text-red-600">
              <span className="truncate">Urgent: {ot.description}</span>
              <button onClick={() => navigate('/interventions')} className="text-red-700 font-medium hover:underline ml-2 flex-shrink-0">Voir</button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard icon={ClipboardList} label="Mes OT en cours" value={otEnCours.length} subtitle="A realiser" color="blue" onClick={() => navigate('/interventions')} />
        <KPICard icon={Calendar} label="Planifies" value={otPlanifies.length} subtitle="A venir" color="indigo" onClick={() => navigate('/interventions')} />
        <KPICard icon={CheckCircle} label="Clotures" value={otClos.length} subtitle="Travail effectue" color="green" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Mes interventions a venir</h3>
          <button onClick={() => navigate('/interventions')} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Tout voir <ArrowRight size={12} />
          </button>
        </div>
        {otPlanifies.length === 0 && otEnCours.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <UserCheck size={40} className="mx-auto mb-2 text-gray-300" />
            Aucune intervention assignee pour le moment
          </div>
        ) : (
          <div className="space-y-2">
            {[...otPlanifies, ...otEnCours].slice(0, 10).map(ot => {
              const eq = equipements.find(e => e.id === ot.equipementId);
              return (
                <div key={ot.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer" onClick={() => navigate('/interventions')}>
                  <div className={`w-2 h-2 rounded-full ${ot.priorite === 'urgente' ? 'bg-red-500' : ot.priorite === 'haute' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ot.description}</p>
                    <p className="text-xs text-gray-500">{eq?.designation || 'Equipement inconnu'} - {ot.datePlanifiee ? format(new Date(ot.datePlanifiee), 'dd MMM yyyy', { locale: fr }) : 'Non planifie'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ot.statut === 'en_cours' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                    {ot.statut === 'en_cours' ? 'En cours' : 'Planifie'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardResponsableMaintenance({ synthese, equipements, ordresTravail, articles, mouvements, pareto, statsOT, coutsParMois, parEquipement, utilisateur, navigate }) {
  const otUrgents = useMemo(() => ordresTravail.filter(ot =>
    ot.priorite === 'urgente' && (ot.statut === 'planifie' || ot.statut === 'en_cours')
  ), [ordresTravail]);
  const techs = useMemo(() => storageService.getAll('utilisateurs').filter(u => u.role === 'technicien'), []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Tableau de bord maintenance</h1>
            <p className="text-blue-100 mt-1 text-sm lg:text-base">Bienvenue, {utilisateur?.prenom}</p>
          </div>
          <p className="text-blue-100/80 text-xs lg:text-sm">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => navigate('/interventions')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <ClipboardList size={16} /> Planifier
          </button>
          <button onClick={() => navigate('/equipements')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <Wrench size={16} /> Equipements
          </button>
          <button onClick={() => navigate('/rapports')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <BarChart3 size={16} /> Rapports
          </button>
        </div>
      </div>

      {otUrgents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2"><AlertTriangle size={18} /> OT urgents ({otUrgents.length})</div>
          {otUrgents.map(ot => (
            <p key={ot.id} className="text-sm text-red-600">Urgent: {ot.description.substring(0, 80)}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Wrench} label="Equipements" value={synthese.totalEQ} subtitle={`${synthese.actifs} en service`} color="blue" onClick={() => navigate('/equipements')} />
        <KPICard icon={ClipboardList} label="OT actifs" value={synthese.otEnCours} subtitle={`${synthese.otClos} clotures`} color="indigo" onClick={() => navigate('/interventions')} />
        <KPICard icon={UserCheck} label="Techniciens" value={techs.length} subtitle="Dans l'equipe" color="purple" />
        <KPICard icon={TrendingUp} label="Taux dispo" value={`${synthese.tauxDispo}%`} subtitle="Disponibilite" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">OT par statut</h3>
          <ChartOTStatus statsOT={statsOT} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Couts mensuels</h3>
          <ChartCouts coutsParMois={coutsParMois} />
        </div>
      </div>

      {pareto.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Analyse Pareto - Equipements les plus defaillants</h3>
          <ParetoDefaillances pareto={pareto} />
        </div>
      )}
    </div>
  );
}

function DashboardResponsableStock({ synthese, equipements, ordresTravail, articles, mouvements, utilisateur, navigate }) {
  const articlesAlerte = useMemo(() => articles.filter(a => a.stockActuel <= a.stockMinimum), [articles]);
  const stocksValorise = useMemo(() =>
    articles.reduce((sum, a) => sum + (a.stockActuel * (a.coutMoyenUnitairePondere || a.coutUnitaire)), 0)
  , [articles]);
  const mouvementsRecents = useMemo(() =>
    [...mouvements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
  , [mouvements]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-4 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Gestion des stocks</h1>
            <p className="text-purple-100 mt-1 text-sm lg:text-base">Bienvenue, {utilisateur?.prenom}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => navigate('/stocks')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <Package size={16} /> Gerer le stock
          </button>
          <button onClick={() => navigate('/stocks')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <Truck size={16} /> Mouvements
          </button>
        </div>
      </div>

      {articlesAlerte.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2"><AlertTriangle size={18} /> Stock critique ({articlesAlerte.length})</div>
          {articlesAlerte.map(a => (
            <p key={a.id} className="text-sm text-red-600">Stock bas: {a.designation} - {a.stockActuel} / {a.stockMinimum} unites</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard icon={Package} label="Articles" value={articles.length} subtitle="References gerees" color="purple" onClick={() => navigate('/stocks')} />
        <KPICard icon={DollarSign} label="Valorisation" value={`${stocksValorise.toLocaleString()} FCFA`} subtitle="Valeur totale du stock" color="green" />
        <KPICard icon={AlertTriangle} label="Sous seuil" value={articlesAlerte.length} subtitle="Reapprovisionnement requis" color="red" />
        <KPICard icon={Activity} label="Mouvements" value={mouvements.length} subtitle="Depuis la creation" color="blue" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Derniers mouvements de stock</h3>
          <button onClick={() => navigate('/stocks')} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Voir tout <ArrowRight size={12} />
          </button>
        </div>
        {mouvementsRecents.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Aucun mouvement enregistre</p>
        ) : (
          <div className="space-y-2">
            {mouvementsRecents.map(m => {
              const art = articles.find(a => a.id === m.articleId);
              return (
                <div key={m.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.type === 'entree' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {m.type === 'entree' ? 'ENTREE' : 'SORTIE'}
                    </span>
                    <span className="text-sm text-gray-900">{art?.designation || m.articleId}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm">{m.type === 'entree' ? '+' : '-'}{m.quantite}</span>
                    <span className="text-xs text-gray-400 ml-2">{m.quantiteAvant} - {m.quantiteApres}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardDirection({ synthese, equipements, ordresTravail, articles, pareto, statsOT, coutsParMois, parEquipement, utilisateur, navigate }) {
  const otClos = ordresTravail.filter(o => o.statut === 'cloture').length;
  const otEnCours = ordresTravail.filter(o => o.statut === 'en_cours' || o.statut === 'planifie').length;
  const articlesAlerte = articles.filter(a => a.stockActuel <= a.stockMinimum).length;
  const totalCouts = synthese.couts.total || 0;
  const coutPieces = synthese.couts.coutPieces || 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-4 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Tableau de bord direction</h1>
            <p className="text-slate-300 mt-1 text-sm lg:text-base">Indicateurs cles - {utilisateur?.prenom}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => navigate('/rapports')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <BarChart3 size={16} /> Rapports
          </button>
          <button onClick={() => navigate('/equipements')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <Eye size={16} /> Equipements
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={TrendingUp} label="Disponibilite" value={`${synthese.tauxDispo}%`} subtitle="Taux global des equipements" color="emerald" />
        <KPICard icon={Clock} label="Ratio PM" value={`${synthese.ratioPM}%`} subtitle="Part de maintenance preventive" color="cyan" />
        <KPICard icon={DollarSign} label="Couts annuels" value={`${totalCouts.toLocaleString()} FCFA`} subtitle="Pieces + Main d'oeuvre" color="green" />
        <KPICard icon={BarChart3} label="MTBF moyen" value={parEquipement.filter(e => e.mtbf != null).length > 0
          ? `${(parEquipement.filter(e => e.mtbf != null).reduce((s, e) => s + e.mtbf, 0) / parEquipement.filter(e => e.mtbf != null).length).toFixed(1)} h`
          : '0 h'} subtitle="Fiabilite" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Pilotage maintenance</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Equipements</p>
              <p className="text-xl font-bold text-gray-900">{synthese.totalEQ}</p>
              <p className="text-xs text-gray-400">{synthese.actifs} actifs - {synthese.enPanne} en panne</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">OT clotures</p>
              <p className="text-xl font-bold text-gray-900">{otClos}</p>
              <p className="text-xs text-gray-400">{otEnCours} en cours</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Cout total</p>
              <p className="text-xl font-bold text-gray-900">{totalCouts.toLocaleString()} FCFA</p>
              <p className="text-xs text-gray-400">Dont {coutPieces.toLocaleString()} FCFA en pieces</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Stock</p>
              <p className="text-xl font-bold text-gray-900">{articles.length}</p>
              <p className="text-xs text-gray-400">{articlesAlerte} articles sous seuil</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Repartition des OT</h3>
          <ChartOTStatus statsOT={statsOT} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Evolution des couts</h3>
        <ChartCouts coutsParMois={coutsParMois} />
      </div>

      {pareto.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Analyse Pareto - 80% des pannes</h3>
          <ParetoDefaillances pareto={pareto} />
        </div>
      )}
    </div>
  );
}

function DashboardAdmin({ synthese, equipements, ordresTravail, articles, mouvements, pareto, statsOT, coutsParMois, parEquipement, utilisateur, navigate }) {
  const techs = storageService.getAll('utilisateurs').filter(u => u.role === 'technicien').length;
  const usersCount = storageService.getAll('utilisateurs').length;
  const stockAlert = articles.filter(a => a.stockActuel <= a.stockMinimum).length;
  const otEnCours = ordresTravail.filter(o => o.statut === 'en_cours' || o.statut === 'planifie').length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Administration systeme</h1>
            <p className="text-gray-300 mt-1 text-sm lg:text-base">Supervision - {utilisateur?.prenom}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <Shield size={16} /> Administration
          </button>
          <button onClick={() => navigate('/rapports')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg">
            <BarChart3 size={16} /> Rapports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Wrench} label="Equipements" value={synthese.totalEQ} subtitle={`${synthese.actifs} en service`} color="blue" onClick={() => navigate('/equipements')} />
        <KPICard icon={ClipboardList} label="OT actifs" value={otEnCours} subtitle={`${synthese.otClos} clotures`} color="indigo" onClick={() => navigate('/interventions')} />
        <KPICard icon={UserCheck} label="Utilisateurs" value={usersCount} subtitle={`${techs} techniciens`} color="purple" onClick={() => navigate('/admin')} />
        <KPICard icon={AlertTriangle} label="Stock alerte" value={stockAlert} subtitle="Articles sous seuil" color="red" onClick={() => navigate('/stocks')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">OT par statut</h3>
          <ChartOTStatus statsOT={statsOT} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Couts mensuels</h3>
          <ChartCouts coutsParMois={coutsParMois} />
        </div>
      </div>

      {pareto.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Analyse Pareto - Equipements les plus defaillants</h3>
          <ParetoDefaillances pareto={pareto} />
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { equipements, ordresTravail, articles, mouvements } = useAppData();
  const { utilisateur } = useAuth();
  const { synthese, pareto, statsOT, coutsParMois, parEquipement } = useKPIs(equipements, ordresTravail, mouvements, articles);
  const navigate = useNavigate();
  const props = { synthese, equipements, ordresTravail, articles, mouvements, pareto, statsOT, coutsParMois, parEquipement, utilisateur, navigate };

  switch (utilisateur?.role) {
    case 'technicien':
      return <DashboardTechnicien {...props} />;
    case 'responsable_maintenance':
      return <DashboardResponsableMaintenance {...props} />;
    case 'responsable_stock':
      return <DashboardResponsableStock {...props} />;
    case 'direction':
      return <DashboardDirection {...props} />;
    case 'admin':
      return <DashboardAdmin {...props} />;
    default:
      return <DashboardAdmin {...props} />;
  }
}
