import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import { statsService } from '../services/statsService';
import { ClusterResponse, ClusterFeature } from '../types';
import Layout from '../components/Layout/Layout';
import { Loader2 } from 'lucide-react';

// Fix pour les icônes Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet manquantes
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function Carte() {
  const [clusters, setClusters] = useState<ClusterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      setLoading(true);
      const data = await statsService.getCluster();
      setClusters(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la carte');
      console.error('Erreur cluster:', err);
    } finally {
      setLoading(false);
    }
  };

  // Centre par défaut (Maroc)
  const defaultCenter: [number, number] = [31.7917, -7.0926];
  const defaultZoom = 6;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
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
        </div>
      </Layout>
    );
  }

  const getRadius = (count: number) => {
    if (count < 10) return 8;
    if (count < 50) return 12;
    if (count < 100) return 16;
    return 20;
  };

  const getColor = (count: number) => {
    if (count < 10) return '#22c55e'; // green
    if (count < 50) return '#eab308'; // yellow
    if (count < 100) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Carte Interactive - Géolocalisation des Demandes</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clusters?.feature?.map((feature: ClusterFeature, index: number) => {
              // Vérifier que la géométrie existe et a des coordonnées
              if (!feature.geom || !feature.geom.coordinates || feature.geom.coordinates.length < 2) {
                return null;
              }
              
              const [lng, lat] = feature.geom.coordinates;
              const count = feature.props?.count || 0;
              const commune = feature.props?.commune || 'Inconnue';
              
              return (
                <CircleMarker
                  key={index}
                  center={[lat, lng]}
                  radius={getRadius(count)}
                  pathOptions={{
                    fillColor: getColor(count),
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-semibold">{commune}</h3>
                      <p className="text-sm text-gray-600">
                        Nombre de demandes: <strong>{count}</strong>
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Légende */}
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Légende</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Moins de 10 demandes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">10-50 demandes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm">50-100 demandes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Plus de 100 demandes</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
