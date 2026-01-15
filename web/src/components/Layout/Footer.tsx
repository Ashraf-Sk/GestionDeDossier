import { FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Gestion Dossiers SIG</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Plateforme moderne de gestion des demandes d'autorisation avec suivi en temps réel,
              statistiques avancées et visualisation géographique.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 hover:bg-white/20 p-2 rounded-lg cursor-pointer transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div className="bg-white/10 hover:bg-white/20 p-2 rounded-lg cursor-pointer transition-all">
                <Phone className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">Accueil</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">Statistiques</a>
              </li>
              <li>
                <a href="/demandes" className="hover:text-white transition-colors">Demandes</a>
              </li>
              <li>
                <a href="/carte" className="hover:text-white transition-colors">Carte SIG</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@gestion-dossiers.ma</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+212 XXX-XXXXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="text-sm">Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Plateforme de Gestion des Dossiers SIG - Tous droits réservés
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
