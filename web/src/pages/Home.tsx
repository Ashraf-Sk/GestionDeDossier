import { Link } from 'react-router-dom';
import { BarChart3, Map, FileText, Shield, Zap, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section avec gradient moderne */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl mb-16 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative px-8 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Plateforme de Gestion
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                des Dossiers SIG
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Suivez et gérez vos demandes d'autorisation en temps réel avec une interface moderne et intuitive
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/demandes"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explorer les Demandes
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-blue-500/30 transition-all transform hover:scale-105"
              >
                Voir les Statistiques
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid avec design moderne */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link
            to="/dashboard"
            className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200"
          >
            <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Statistiques Avancées</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualisez les statistiques détaillées sur les demandes par commune, type et statut avec des graphiques interactifs
            </p>
            <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
              Explorer <span className="ml-2">→</span>
            </div>
          </Link>

          <Link
            to="/demandes"
            className="group bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200"
          >
            <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Liste des Demandes</h3>
            <p className="text-gray-600 leading-relaxed">
              Consultez toutes les demandes avec filtres avancés, recherche et pagination intelligente
            </p>
            <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
              Consulter <span className="ml-2">→</span>
            </div>
          </Link>

          <Link
            to="/carte"
            className="group bg-gradient-to-br from-red-50 to-rose-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-200"
          >
            <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Carte Interactive SIG</h3>
            <p className="text-gray-600 leading-relaxed">
              Géolocalisation des demandes sur une carte interactive avec clusters et statistiques géographiques
            </p>
            <div className="mt-4 text-red-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
              Visualiser <span className="ml-2">→</span>
            </div>
          </Link>

          <div className="group bg-gradient-to-br from-purple-50 to-violet-100 p-8 rounded-xl shadow-lg border border-purple-200">
            <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Suivi en Temps Réel</h3>
            <p className="text-gray-600 leading-relaxed">
              Suivez l'évolution de vos demandes en temps réel avec notifications et mises à jour automatiques
            </p>
          </div>
        </div>

        {/* Info Section avec design moderne */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-10 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-yellow-300" />
              <h2 className="text-3xl md:text-4xl font-bold">
                À propos de la plateforme
              </h2>
            </div>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed max-w-3xl">
              Cette plateforme innovante permet aux citoyens de déposer des demandes d'autorisation
              et de suivre leur traitement en temps réel. Les administrateurs peuvent gérer et traiter
              les demandes efficacement, tandis que le public peut consulter les statistiques détaillées
              et visualiser les demandes sur une carte interactive SIG.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0" />
                <span className="text-indigo-100">Interface intuitive</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0" />
                <span className="text-indigo-100">Temps réel</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0" />
                <span className="text-indigo-100">Sécurisé</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/demandes"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Voir les demandes
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-indigo-500/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-indigo-500/40 transition-all transform hover:scale-105"
              >
                Consulter les statistiques
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
