import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout/Layout';
import { publicService } from '../services/publicService';
import { StatsResponse } from '../types';
import { Loader2, TrendingUp, Map, BarChart3, FileText } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Utiliser l'endpoint public pour les statistiques
      const data = await publicService.getPublicStats();
      // Convertir PublicStatsResponse en StatsResponse pour compatibilité
      setStats({
        total: data.total,
        deposees: data.deposees,
        enCours: data.enCours,
        acceptees: data.acceptees,
        rejetees: data.rejetees,
        parCommune: data.parCommune,
        parType: data.parType,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
      console.error('Erreur stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Les statistiques nécessitent une authentification administrateur.
          </p>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-gray-600">Aucune statistique disponible</p>
        </div>
      </Layout>
    );
  }

  // Préparer les données pour les graphiques
  const communeData = Object.entries(stats.parCommune).map(([name, value]) => ({
    name,
    value,
  }));

  const typeData = Object.entries(stats.parType).map(([name, value]) => ({
    name,
    value,
  }));

  const statusData = [
    { name: 'Déposées', value: stats.deposees },
    { name: 'En cours', value: stats.enCours },
    { name: 'Acceptées', value: stats.acceptees },
    { name: 'Rejetées', value: stats.rejetees },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header avec gradient */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Tableau de Bord
          </h1>
          <p className="text-xl text-gray-600">Statistiques et analyses des demandes</p>
        </div>

        {/* Cards de statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-100 uppercase tracking-wide">Total</h3>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm text-blue-100">demandes au total</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-yellow-100 uppercase tracking-wide">En cours</h3>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.enCours}</p>
            <p className="text-sm text-yellow-100">en traitement</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-green-100 uppercase tracking-wide">Acceptées</h3>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.acceptees}</p>
            <p className="text-sm text-green-100">validées</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-red-100 uppercase tracking-wide">Rejetées</h3>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.rejetees}</p>
            <p className="text-sm text-red-100">non validées</p>
          </div>
        </div>

        {/* Graphiques avec design amélioré */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Histogramme par commune */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Demandes par Commune</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={communeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Camembert par type */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Demandes par Type</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(name || '').substring(0, 15)}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique par statut */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Répartition par Statut</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
