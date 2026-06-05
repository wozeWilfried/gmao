import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ChartCouts({ coutsParMois }) {
  if (coutsParMois.length === 0) return <p className="text-gray-400 text-sm py-8 text-center">Aucune donnée de coût</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={coutsParMois}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${v.toFixed(2)} FCFA`, '']} />
        <Legend />
        <Bar dataKey="coutPieces" name="Pièces" fill="#3B82F6" radius={[2, 2, 0, 0]} />
        <Bar dataKey="coutMainOeuvre" name="Main d'œuvre" fill="#10B981" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
