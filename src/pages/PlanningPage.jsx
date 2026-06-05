import { useState, useMemo } from 'react';
import { useAppData } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../components/layout/ProtectedRoute';
import StatusBadge from '../components/shared/StatusBadge';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Wrench, AlertTriangle } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const PRIORITY_COLORS = {
  urgente: 'bg-red-500',
  haute: 'bg-orange-500',
  normale: 'bg-blue-500',
  basse: 'bg-gray-400',
};

export default function PlanningPage() {
  const { ordresTravail, equipements, utilisateurs } = useAppData();
  const { utilisateur } = useAuth();
  const { role } = usePermissions('interventions');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const otWeek = useMemo(() => {
    return ordresTravail.filter(ot => {
      if (!ot.datePlanifiee) return false;
      const d = parseISO(ot.datePlanifiee);
      return d >= weekDays[0] && d <= weekDays[6];
    }).sort((a, b) => {
      const pa = { urgente: 0, haute: 1, normale: 2, basse: 3 };
      return (pa[a.priorite] || 2) - (pa[b.priorite] || 2);
    });
  }, [ordresTravail, weekDays]);

  const otNonPlanifies = useMemo(() =>
    ordresTravail.filter(ot => !ot.datePlanifiee && !['cloture', 'annule'].includes(ot.statut)),
  [ordresTravail]);

  const todayOT = useMemo(() =>
    ordresTravail.filter(ot => ot.datePlanifiee && isSameDay(parseISO(ot.datePlanifiee), new Date()) && !['cloture', 'annule'].includes(ot.statut)),
  [ordresTravail]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-indigo-600 flex-shrink-0" />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Planning</h1>
            <p className="text-gray-500 mt-1 text-sm">{otWeek.length} intervention(s) cette semaine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(d => subDays(d, 7))} className="p-2 border rounded-lg hover:bg-gray-50"><ChevronLeft size={16} /></button>
          <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
            {format(weekDays[0], 'dd MMM', { locale: fr })} - {format(weekDays[6], 'dd MMM yyyy', { locale: fr })}
          </span>
          <button onClick={() => setCurrentDate(d => addDays(d, 7))} className="p-2 border rounded-lg hover:bg-gray-50"><ChevronRight size={16} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 ml-1">Aujourd'hui</button>
        </div>
      </div>

      {todayOT.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
            <Calendar size={16} /> Aujourd'hui - {todayOT.length} intervention(s)
          </div>
          {todayOT.map(ot => {
            const eq = equipements.find(e => e.id === ot.equipementId);
            return (
              <div key={ot.id} className="flex items-center justify-between py-1 text-sm text-indigo-600">
                <span className="truncate mr-2">{ot.description}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-indigo-400">{eq?.designation?.substring(0, 20)}</span>
                  <StatusBadge status={ot.priorite} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-200">
            <div className="p-3 bg-gray-50 border-r border-gray-200 font-semibold text-xs text-gray-600 uppercase">Interventions</div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className={`p-3 text-center border-r border-gray-200 ${isSameDay(day, new Date()) ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500 uppercase">{format(day, 'EEEEEE', { locale: fr })}</p>
                <p className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-indigo-600' : 'text-gray-900'}`}>{format(day, 'dd')}</p>
              </div>
            ))}
          </div>
          <div className="divide-y divide-gray-100">
            {otWeek.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Aucune intervention planifiee cette semaine</div>
            ) : otWeek.map(ot => {
              const otDate = parseISO(ot.datePlanifiee);
              const dayIndex = weekDays.findIndex(d => isSameDay(d, otDate));
              const eq = equipements.find(e => e.id === ot.equipementId);
              return (
                <div key={ot.id} className="grid grid-cols-[200px_repeat(7,1fr)] hover:bg-gray-50">
                  <div className="p-2.5 border-r border-gray-100 flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLORS[ot.priorite] || 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-700 truncate">{ot.description}</span>
                  </div>
                  {weekDays.map((day, i) => (
                    <div key={i} className={`p-2 border-r border-gray-100 ${i === dayIndex ? 'bg-blue-50' : ''}`}>
                      {i === dayIndex && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-blue-700">{eq?.designation?.substring(0, 18) || '-'}</span>
                          <div className="flex items-center gap-1">
                            <StatusBadge status={ot.statut} />
                            <span className="text-xs text-gray-400">{ot.dureeEstimee}min</span>
                          </div>
                          {ot.technicienIds?.map(tId => {
                            const tech = utilisateurs.find(u => u.id === tId);
                            return tech ? <span key={tId} className="text-xs text-gray-500">{tech.prenom} {tech.nom}</span> : null;
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {otNonPlanifies.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
            <AlertTriangle size={16} /> {otNonPlanifies.length} intervention(s) non planifiee(s)
          </div>
          <div className="space-y-1">
            {otNonPlanifies.map(ot => (
              <div key={ot.id} className="flex items-center gap-2 text-sm text-amber-600">
                <Clock size={12} />
                <span className="truncate">{ot.description}</span>
                <StatusBadge status={ot.priorite} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
