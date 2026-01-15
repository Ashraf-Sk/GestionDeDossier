import Layout from '../components/Layout/Layout';
import { DEMANDE_TYPES } from '../config/demandeTypes';
import { FileText, CheckCircle } from 'lucide-react';

export default function TypesDemandes() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Types de Demandes</h1>
        <p className="text-gray-600 mb-8">
          Découvrez les différents types de demandes d'autorisation disponibles
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {DEMANDE_TYPES.map((type) => (
            <div key={type.code} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start space-x-4 mb-4">
                <span className="text-4xl">{type.icon}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{type.label}</h2>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Documents typiques :
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {type.documentsTypiques.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Utilité :
                  </h3>
                  <p className="text-sm text-gray-600">{type.utilite}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
