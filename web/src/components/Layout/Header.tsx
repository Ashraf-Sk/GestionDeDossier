import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Map, FileText, LogIn, Info } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return null; // Pas de header dans l'admin
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gestion Dossiers
              </span>
              <p className="text-xs text-gray-500 -mt-1">Plateforme SIG</p>
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Accueil</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/dashboard' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Statistiques</span>
            </Link>
            <Link
              to="/demandes"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/demandes' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">Demandes</span>
            </Link>
            <Link
              to="/carte"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/carte' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="font-medium">Carte</span>
            </Link>
            <Link
              to="/types"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/types' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="font-medium">Types</span>
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
