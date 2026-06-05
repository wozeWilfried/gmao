import { useAppData } from '../context/AppContext';
import { useKPIs } from '../hooks/useKPIs';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../components/layout/ProtectedRoute';
import ExportButtons from '../components/shared/ExportButtons';
import KPICard from '../components/rapports/KPICard';
import ChartOTStatus from '../components/rapports/ChartOTStatus';
import ChartCouts from '../components/rapports/ChartCouts';
import ParetoDefaillances from '../components/rapports/ParetoDefaillances';
import { Wrench, TrendingUp, Clock, DollarSign, BarChart3, Package, Activity, FileText, Building2, ClipboardCheck, Target, AlertTriangle } from 'lucide-react';
import { AnalyticsIllustration } from '../components/shared/Illustrations';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RapportsPage() {
  const { equipements, ordresTravail, articles, mouvements, sites, inventaires } = useAppData();
  const { utilisateur } = useAuth();
  const { role } = usePermissions('rapports');
  const [periode, setPeriode] = useState(365);
  const { synthese, parEquipement, pareto, statsOT, coutsParMois } = useKPIs(equipements, ordresTravail, mouvements, articles, periode);

  const stockValue = useMemo(() =>
    articles.reduce((s, a) => s + (a.stockActuel * (a.coutMoyenUnitairePondere || a.coutUnitaire)), 0)
  , [articles]);

  const articlesAlerte = useMemo(() => articles.filter(a => a.stockActuel <= a.stockMinimum), [articles]);
  const sitesActifs = useMemo(() => sites.filter(s => s.actif).length, [sites]);
  const otPlanifies = ordresTravail.filter(o => o.statut === 'planifie').length;
  const otUrgents = ordresTravail.filter(o => o.priorite === 'urgente' && !['cloture', 'annule'].includes(o.statut)).length;
  const tauxRespectPlanning = useMemo(() => {
    const clos = ordresTravail.filter(o => o.statut === 'cloture' && o.datePlanifiee);
    if (clos.length === 0) return 100;
    const dansLesTemps = clos.filter(o => !o.dateLimite || new Date(o.rapportCloture?.dateRealisation) <= new Date(o.dateLimite));
    return Math.round((dansLesTemps.length / clos.length) * 100);
  }, [ordresTravail]);
  const tauxUrgence = ordresTravail.length > 0 ? Math.round((otUrgents / ordresTravail.length) * 100) : 0;
  const inventairesValides = useMemo(() => {
    const valides = inventaires.filter(i => i.statut === 'valide');
    return valides.length;
  }, [inventaires]);
  const ecartsInventaire = useMemo(() => {
    const valides = inventaires.filter(i => i.statut === 'valide');
    return valides.reduce((sum, inv) => sum + inv.lignes.reduce((s, l) => s + Math.abs(l.ecart), 0), 0);
  }, [inventaires]);

  const mtbfData = parEquipement.filter(e => e.mtbf != null).map((e, i) => ({
    name: e.designation?.substring(0, 20) || 'Inconnu', mtbf: e.mtbf, mttr: e.mttr || 0,
    tauxDispo: Math.round(e.tauxDispo * 100) / 100,
  })).sort((a, b) => b.mtbf - a.mtbf);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const isDirection = role === 'direction';
  const isStockManager = role === 'responsable_stock';
  const isTech = role === 'technicien';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 lg:gap-4">
          <AnalyticsIllustration className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-xl shadow hidden sm:block" />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {isDirection ? 'Rapports & Pilotage' : isStockManager ? 'Rapports stocks' : 'Rapports & Analyses'}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Indicateurs cles de performance (KPI)</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {(role === 'direction' || role === 'admin' || role === 'responsable_maintenance') && (
            <select value={periode} onChange={e => setPeriode(+e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={365}>1 an</option>
            </select>
          )}
        </div>
      </div>

      {equipements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-xl">
          <AnalyticsIllustration className="w-56 h-56 object-cover rounded-xl opacity-20" />
          <h3 className="text-xl font-semibold text-gray-500 mt-4">Aucune donnee disponible</h3>
          <p className="text-sm text-gray-400 mt-1">Les rapports apparaitront une fois les equipements et interventions crees</p>
        </div>
      ) : (
      <><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isStockManager && !isTech && (
          <>
            <KPICard icon={TrendingUp} label="MTBF moyen" value={parEquipement.filter(e => e.mtbf != null).length > 0
              ? `${(parEquipement.filter(e => e.mtbf != null).reduce((s, e) => s + e.mtbf, 0) / parEquipement.filter(e => e.mtbf != null).length).toFixed(1)} h`
              : '0 h'} subtitle="Temps moyen entre pannes" color="blue" />
            <KPICard icon={Clock} label="MTTR moyen" value={parEquipement.filter(e => e.mttr > 0).length > 0
              ? `${(parEquipement.filter(e => e.mttr > 0).reduce((s, e) => s + e.mttr, 0) / parEquipement.filter(e => e.mttr > 0).length).toFixed(1)} h`
              : '0 h'} subtitle="Temps moyen de reparations" color="orange" />
            <KPICard icon={BarChart3} label="Ratio PM/CM" value={`${synthese.ratioPM}%`} subtitle="Part maintenance preventive" color="green" />
            <KPICard icon={DollarSign} label="Cout total" value={`${synthese.couts.total?.toLocaleString() || 0} FCFA`} subtitle="Pieces + Main d'oeuvre" color="purple" />
          </>
        )}
        {isStockManager && (
          <>
            <KPICard icon={Package} label="Articles" value={articles.length} subtitle="References en stock" color="blue" />
            <KPICard icon={DollarSign} label="Valorisation" value={`${stockValue.toLocaleString()} FCFA`} subtitle="Valeur totale" color="green" />
            <KPICard icon={Activity} label="Stock faible" value={articlesAlerte.length} subtitle="Sous seuil minimum" color="red" />
            <KPICard icon={BarChart3} label="Mouvements" value={mouvements.length} subtitle="Depuis l'origine" color="purple" />
          </>
        )}
        {isTech && (
          <>
            <KPICard icon={Wrench} label="Equipements" value={equipements.length} subtitle="Dans le parc" color="blue" />
            <KPICard icon={TrendingUp} label="Disponibilite" value={`${synthese.tauxDispo}%`} subtitle="Taux global" color="emerald" />
            <KPICard icon={Activity} label="OT clotures" value={statsOT.repartition.cloture || 0} subtitle="Interventions terminees" color="green" />
            <KPICard icon={Clock} label="MTTR" value={parEquipement.filter(e => e.mttr > 0).length > 0
              ? `${(parEquipement.filter(e => e.mttr > 0).reduce((s, e) => s + e.mttr, 0) / parEquipement.filter(e => e.mttr > 0).length).toFixed(1)} h`
              : '0 h'} subtitle="Temps reparation moyen" color="orange" />
          </>
        )}
        {(role === 'direction' || role === 'admin' || role === 'responsable_maintenance') && (
          <>
            <KPICard icon={Building2} label="Sites actifs" value={sitesActifs} subtitle="Sites operationnels" color="cyan" />
            <KPICard icon={Target} label="Respect planning" value={`${tauxRespectPlanning}%`} subtitle="OT dans les delais" color="emerald" />
            <KPICard icon={AlertTriangle} label="Taux urgence" value={`${tauxUrgence}%`} subtitle="Interventions urgentes" color="red" />
            <KPICard icon={ClipboardCheck} label="Inventaires" value={inventairesValides} subtitle={`${ecartsInventaire} ecart(s) total`} color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!isStockManager && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Comparatif MTBF par equipement</h3>
            {mtbfData.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">Aucune donnee de panne</p> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mtbfData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${v} h`, 'MTBF']} />
                  <Bar dataKey="mtbf" name="MTBF (h)" radius={[0, 3, 3, 0]}>
                    {mtbfData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
        <div className={`${isStockManager ? 'lg:col-span-2' : ''} bg-white rounded-xl border border-gray-200 p-6`}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Repartition des OT par statut</h3>
          <ChartOTStatus statsOT={statsOT} />
        </div>
      </div>

      {(role === 'direction' || role === 'admin' || role === 'responsable_maintenance') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Couts de maintenance par mois</h3>
            <ChartCouts coutsParMois={coutsParMois} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Taux de disponibilite par equipement</h3>
              <ExportButtons titre="Disponibilite_equipements"
                colonnes={['Equipement', 'Disponibilite %', 'MTBF (h)', 'MTTR (h)', 'OT total']}
                lignes={parEquipement.sort((a, b) => a.tauxDispo - b.tauxDispo).map(e => [e.designation, `${e.tauxDispo.toFixed(1)}%`, e.mtbf?.toFixed(1) || '-', e.mttr?.toFixed(1) || '-', e.nbOT])}
                data={parEquipement} />
            </div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Equipement</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Disponibilite</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">MTBF (h)</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">MTTR (h)</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">OT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parEquipement.sort((a, b) => a.tauxDispo - b.tauxDispo).map(eq => {
                  const pct = Math.round(eq.tauxDispo);
                  const color = pct >= 98 ? 'text-green-600' : pct >= 90 ? 'text-amber-600' : 'text-red-600';
                  return (
                    <tr key={eq.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{eq.designation}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${pct >= 98 ? 'bg-green-500' : pct >= 90 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`font-semibold ${color}`}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center text-gray-700">{eq.mtbf != null ? eq.mtbf.toFixed(1) : '-'}</td>
                      <td className="px-3 py-2 text-center text-gray-700">{eq.mttr > 0 ? eq.mttr.toFixed(1) : '-'}</td>
                      <td className="px-3 py-2 text-center text-gray-700">{eq.nbOT}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pareto.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Analyse Pareto - Equipements les plus defaillants</h3>
          <ParetoDefaillances pareto={pareto} />
        </div>
      )}

      {role === 'direction' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Detail des KPI par equipement</h3>
            <ExportButtons titre="Rapport_KPI_equipements"
              colonnes={['Equipement', 'MTBF (h)', 'MTTR (h)', 'Dispo %', 'OT', 'Correctifs']}
              lignes={parEquipement.map(e => [e.designation, e.mtbf?.toFixed(1) || 'infini', e.mttr?.toFixed(1) || '0', `${e.tauxDispo.toFixed(1)}%`, e.nbOT, e.nbCorrectifs])}
              data={parEquipement} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Equipement</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">MTBF (h)</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">MTTR (h)</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Dispo %</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">OT total</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Correctifs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parEquipement.map(eq => (
                  <tr key={eq.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">{eq.designation}</td>
                    <td className="px-3 py-2 text-right">{eq.mtbf != null ? eq.mtbf.toFixed(1) : 'infini'}</td>
                    <td className="px-3 py-2 text-right">{eq.mttr > 0 ? eq.mttr.toFixed(1) : '-'}</td>
                    <td className="px-3 py-2 text-right">{eq.tauxDispo.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{eq.nbOT}</td>
                    <td className="px-3 py-2 text-right">{eq.nbCorrectifs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>)}
    </div>
  );
}
