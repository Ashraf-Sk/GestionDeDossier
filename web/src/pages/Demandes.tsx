import { useEffect, useState } from 'react';
import { publicService } from '../services/publicService';
import { PublicDemande, PageResponse } from '../types';
import Layout from '../components/Layout/Layout';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { DEMANDE_TYPES } from '../config/demandeTypes';
import DemandeTypeBadge from '../components/DemandeTypeBadge';

export default function Demandes() {
  const [demandes, setDemandes] = useState<PageResponse<PublicDemande> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    nomCommune: '',
  });

  useEffect(() => {
    loadDemandes();
  }, [page, filters]);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      // Utiliser l'endpoint public pour les demandes
      const data = await publicService.getPublicDemandes(
        page,
        size,
        filters.status || undefined,
        filters.type || undefined,
        filters.nomCommune || undefined
      );
      setDemandes(data);
    } catch (err: any) {
      console.error('Erreur chargement demandes:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // Reset à la première page
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACCEPTEE: 'bg-green-100 text-green-800',
      REJETE: 'bg-red-100 text-red-800',
      EN_COURS: 'bg-yellow-100 text-yellow-800',
      AVIS_FAVORABLE: 'bg-blue-100 text-blue-800',
      AVIS_DEFAVORABLE: 'bg-orange-100 text-orange-800',
      EN_ATTENTE: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header amélioré */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Liste des Demandes</h1>
          <p className="text-lg text-gray-600">Consultez toutes les demandes d'autorisation déposées</p>
        </div>

        {/* Filtres avec design moderne */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            Filtres de recherche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="EN_COURS">En cours</option>
                <option value="ACCEPTEE">Acceptée</option>
                <option value="REJETE">Rejetée</option>
                <option value="AVIS_FAVORABLE">Avis favorable</option>
                <option value="AVIS_DEFAVORABLE">Avis défavorable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les types</option>
                {DEMANDE_TYPES.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commune
              </label>
              <input
                type="text"
                value={filters.nomCommune}
                onChange={(e) => handleFilterChange('nomCommune', e.target.value)}
                placeholder="Filtrer par commune"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: '', type: '', nomCommune: '' });
                  setPage(0);
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau avec design moderne */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement des demandes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-800 font-semibold text-lg mb-2">Erreur de chargement</p>
            <p className="text-red-600">{error}</p>
          </div>
        ) : demandes && demandes.content.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Commune
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {demandes.content.map((demande) => (
                    <tr key={demande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {demande.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <DemandeTypeBadge typeCode={demande.typeAutorization} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.nomCommune}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            demande.status
                          )}`}
                        >
                          {demande.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(demande.temps).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination améliorée */}
            {demandes.totalPages > 1 && (
              <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  Page <span className="font-bold text-blue-600">{demandes.number + 1}</span> sur{' '}
                  <span className="font-bold">{demandes.totalPages}</span> ({demandes.totalElements} demandes)
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={demandes.first}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={demandes.last}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="w-5 h-5 inline" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-16 rounded-xl shadow-lg border border-gray-200 text-center">
            <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">Aucune demande trouvée</p>
            {!error && (
              <p className="text-gray-500">
                Aucune demande ne correspond aux critères de recherche.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
