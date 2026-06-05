import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = { demande: '#8B5CF6', planifie: '#3B82F6', en_cours: '#6366F1', en_attente: '#F59E0B', cloture: '#10B981', annule: '#EF4444' };
const LABELS = { demande: 'Demande', planifie: 'Planifié', en_cours: 'En cours', en_attente: 'En attente', cloture: 'Clôturé', annule: 'Annulé' };

export default function ChartOTStatus({ statsOT }) {
  const data = Object.entries(statsOT.repartition || {}).map(([statut, count]) => ({
    name: LABELS[statut] || statut,
    value: count,
    color: COLORS[statut] || '#9CA3AF',
  }));

  if (data.length === 0) return <p className="text-gray-400 text-sm py-8 text-center">Aucune donnée</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${v} OT`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
