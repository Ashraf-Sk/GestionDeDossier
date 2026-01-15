import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { demandeService } from '../../services/demandeService';
import { AdminDetailsDemande, DemandeStatus } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import { ArrowLeft, CheckCircle, XCircle, FileText, Download, Eye } from 'lucide-react';
import { getDemandeTypeInfo } from '../../config/demandeTypes';
import DemandeTypeBadge from '../../components/DemandeTypeBadge';

export default function AdminDemandeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [demande, setDemande] = useState<AdminDetailsDemande | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<DemandeStatus>('EN_ATTENTE');
  const [motifRejet, setMotifRejet] = useState('');
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadDemande();
    }
  }, [id]);

  const loadDemande = async () => {
    try {
      setLoading(true);
      const data = await demandeService.getDemandeDetails(id!);
      setDemande(data);
      setNewStatus(data.status as DemandeStatus);
    } catch (err: any) {
      console.error('Erreur chargement demande:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!id) return;

    try {
      setUpdating(true);
      await demandeService.updateDemandeStatus(id, {
        status: newStatus,
        motifRejet: newStatus === 'REJETE' ? motifRejet : null,
      });
      await loadDemande(); // Recharger les données
      alert('Statut mis à jour avec succès');
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadDocument = async (documentId: string, fileName: string, openInNewTab: boolean = false) => {
    try {
      setDownloadingDoc(documentId);
      const blob = await demandeService.downloadDocumentAsAdmin(documentId);
      
      // Vérifier si le blob est vide ou si c'est une erreur (par exemple, un message d'erreur en JSON)
      if (blob.size === 0) {
        throw new Error('Le document est vide');
      }
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      if (openInNewTab) {
        // Ouvrir dans un nouvel onglet
        window.open(url, '_blank');
      } else {
        // Télécharger le fichier
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Nettoyer l'URL après un délai
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      }
    } catch (err: any) {
      console.error('Erreur lors du téléchargement:', err);
      let errorMessage = 'Erreur lors du téléchargement du document';
      
      if (err.response?.status === 404) {
        errorMessage = 'Document introuvable. Le fichier peut avoir été supprimé ou déplacé.';
      } else if (err.response?.data) {
        // Essayer de lire le message d'erreur depuis le blob si c'est du texte
        try {
          const text = await err.response.data.text();
          errorMessage = text || errorMessage;
        } catch {
          errorMessage = err.response.data.message || errorMessage;
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setDownloadingDoc(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des détails...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!demande) {
    return (
      <AdminLayout>
        <div className="text-center py-16 bg-white rounded-xl shadow-lg p-12">
          <div className="inline-block bg-red-100 p-4 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Demande introuvable</p>
          <p className="text-gray-500">La demande demandée n'existe pas ou a été supprimée.</p>
        </div>
      </AdminLayout>
    );
  }

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
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/admin/demandes')}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la liste
        </button>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Détails de la Demande</h1>
              <p className="text-gray-600 mt-1">Informations complètes et gestion du statut</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ID</label>
              <p className="text-xl font-bold text-gray-900">{demande.id}</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">CIN</label>
              <p className="text-xl font-bold text-gray-900">{demande.cin}</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Type d'autorisation</label>
              <div className="mt-1">
                <DemandeTypeBadge typeCode={demande.typeAuthorization} />
                {(() => {
                  const typeInfo = getDemandeTypeInfo(demande.typeAuthorization);
                  return typeInfo ? (
                    <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <p className="mb-2 font-medium">{typeInfo.description}</p>
                      <p className="text-xs text-gray-500">💡 Utilité: {typeInfo.utilite}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Commune</label>
              <p className="text-xl font-semibold text-gray-900">{demande.nomCommune || 'Non déterminée'}</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Date de création</label>
              <p className="text-lg font-semibold text-gray-900">{new Date(demande.date).toLocaleString('fr-FR')}</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Statut actuel</label>
              <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(demande.status)} shadow-sm`}>
                {demande.status}
              </span>
            </div>
          </div>

          {demande.motif && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 p-5 rounded-lg">
              <label className="block text-sm font-bold text-red-800 mb-2 uppercase tracking-wide">⚠️ Motif de rejet</label>
              <p className="text-red-900 font-medium">{demande.motif}</p>
            </div>
          )}

          <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Documents ({demande.documents.length})
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demande.documents.length > 0 ? (
                demande.documents.map((doc) => (
                  <div key={doc.idFichier} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate" title={doc.NomFichier}>
                      {doc.NomFichier}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadDocument(doc.idFichier, doc.NomFichier, true)}
                        disabled={downloadingDoc === doc.idFichier}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Ouvrir le PDF"
                      >
                        {downloadingDoc === doc.idFichier ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(doc.idFichier, doc.NomFichier, false)}
                        disabled={downloadingDoc === doc.idFichier}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Télécharger le PDF"
                      >
                        {downloadingDoc === doc.idFichier ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm col-span-2 text-center py-4">Aucun document disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Mise à jour du statut avec design moderne */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Mettre à jour le statut</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau statut
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as DemandeStatus)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EN_ATTENTE">En attente</option>
                <option value="EN_COURS">En cours</option>
                <option value="AVIS_FAVORABLE">Avis favorable</option>
                <option value="AVIS_DEFAVORABLE">Avis défavorable</option>
                <option value="ACCEPTEE">Acceptée</option>
                <option value="REJETE">Rejetée</option>
              </select>
            </div>

            {newStatus === 'REJETE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de rejet (obligatoire)
                </label>
                <textarea
                  value={motifRejet}
                  onChange={(e) => setMotifRejet(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Indiquez le motif de rejet..."
                />
              </div>
            )}

            <button
              onClick={handleUpdateStatus}
              disabled={updating || (newStatus === 'REJETE' && !motifRejet.trim())}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Mise à jour en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mettre à jour le statut
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
