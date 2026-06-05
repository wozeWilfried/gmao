import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function ParetoDefaillances({ pareto }) {
  const total = pareto.reduce((sum, item) => sum + item.nbPannes, 0);
  let cumul = 0;
  const data = pareto.slice(0, 10).map(item => {
    cumul += item.nbPannes;
    return {
      name: item.equipement?.designation?.substring(0, 25) || 'Inconnu',
      nbPannes: item.nbPannes,
      cumul: Math.round((cumul / total) * 100),
    };
  });

  if (data.length === 0) return <p className="text-gray-400 text-sm py-8 text-center">Aucune panne enregistrée</p>;

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
          <Tooltip formatter={(v, name) => [v, name === 'cumul' ? 'Cumul %' : 'Nombre de pannes']} />
          <ReferenceLine yAxisId="right" y={80} stroke="#EF4444" strokeDasharray="5 5" label="80%" />
          <Bar yAxisId="left" dataKey="nbPannes" name="Pannes" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.cumul <= 80 ? '#EF4444' : '#F59E0B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-2 text-center">Ligne rouge = seuil 80% (Loi de Pareto)</p>
    </div>
  );
}
