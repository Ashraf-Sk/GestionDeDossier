import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { FileText, BarChart3, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold">Administration</h2>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin/demandes"
            className={`flex items-center space-x-3 px-6 py-3 transition ${
              location.pathname === '/admin/demandes'
                ? 'bg-gray-700 border-l-4 border-blue-500'
                : 'hover:bg-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Gestion des Demandes</span>
          </Link>
          <Link
            to="/admin/stats"
            className={`flex items-center space-x-3 px-6 py-3 transition ${
              location.pathname === '/admin/stats'
                ? 'bg-gray-700 border-l-4 border-blue-500'
                : 'hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Statistiques</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-3 w-full text-left hover:bg-gray-700 rounded transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
