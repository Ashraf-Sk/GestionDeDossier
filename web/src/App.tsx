import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy loading pour améliorer les performances
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Demandes = lazy(() => import('./pages/Demandes'));
const Carte = lazy(() => import('./pages/Carte'));
const TypesDemandes = lazy(() => import('./pages/TypesDemandes'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDemandes = lazy(() => import('./pages/admin/AdminDemandes'));
const AdminDemandeDetails = lazy(() => import('./pages/admin/AdminDemandeDetails'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats'));

// Composant de chargement
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/carte" element={<Carte />} />
          <Route path="/types" element={<TypesDemandes />} />

          {/* Routes admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/demandes"
            element={
              <ProtectedRoute>
                <AdminDemandes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/demandes/:id"
            element={
              <ProtectedRoute>
                <AdminDemandeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute>
                <AdminStats />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
