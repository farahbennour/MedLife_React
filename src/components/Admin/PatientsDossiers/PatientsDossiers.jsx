import axios from "axios";
import { useEffect, useState } from "react";
import AlertService from "../../../Services/Alert";
import "./PatientsDossiers.css";

export default function PatientsDossiers() {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/consultation/admin/all-dossiers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDossiers(res.data || []);
      } catch (err) {
        console.error(err);
        AlertService.error("Erreur", "Impossible de charger les dossiers.");
      } finally {
        setLoading(false);
      }
    };
    fetchDossiers();
  }, [token]);

  const handleDelete = async (consultationId) => {
    try {
      const confirmed = await AlertService.confirm(
        "Voulez-vous vraiment supprimer cette consultation ?",
        "Cette action est irréversible."
      );
      if (!confirmed) return;

      await axios.delete(
        `http://localhost:3000/consultation/admin/${consultationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      AlertService.success("Succès", "Consultation supprimée.");

      setDossiers(prev =>
        prev.map(dossier => ({
          ...dossier,
          consultations: dossier.consultations.filter(c => c.id !== consultationId)
        }))
      );
    } catch (err) {
      console.error(err);
      AlertService.error("Erreur", "Impossible de supprimer la consultation.");
    }
  };

  const handleGenerateOrdonnance = async (consultationId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/consultation/${consultationId}/generate-ordonnance`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob" // important pour recevoir un PDF
        }
      );

      // Créer un lien pour télécharger le PDF
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ordonnance_${consultationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      AlertService.error("Erreur", "Impossible de générer l'ordonnance.");
    }
  };

  if (loading) return <div className="dossier-loading">Chargement des dossiers...</div>;

  return (
    <div className="admin-dossier-container">
      <h2 className="admin-patient-name">Dossiers Médicaux des Patients</h2>

      {dossiers.length === 0 ? (
        <p>Aucun dossier trouvé.</p>
      ) : (
        dossiers.map((dossier) => (
          <div key={dossier.id} className="admin-consultation-card">
            {(dossier.consultations || []).length === 0 ? (
              <p>Aucune consultation trouvée.</p>
            ) : (
              dossier.consultations.map((consultation) => (
                <div key={consultation.id} className="admin-consultation-card">
                  <p>
                    <strong>Date de consultation :</strong>{" "}
                    {new Date(consultation.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <p>
                    <strong>Date de création du dossier :</strong>{" "}
                    {new Date(dossier.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <p>
                    <strong>Clinique :</strong> {dossier.clinic?.name || "—"} |{" "}
                    <strong>Service :</strong> {dossier.service?.name || "—"}
                  </p>
                  <p>
                    <strong>Patient :</strong> {dossier.patient?.user?.username || "—"} |{" "}
                    <strong>Docteur :</strong> {consultation.doctor?.user?.username || "—"}
                  </p>
                  <p>
                    <strong>Diagnostic :</strong> {consultation.diagnostic || "—"}
                  </p>

                  {consultation.ordonnance ? (
                    <div className="admin-ordonnance-section">
                      <h5>Ordonnance</h5>
                      {(consultation.ordonnance.items || []).length === 0 ? (
                        <p>Aucun médicament prescrit.</p>
                      ) : (
                        <ul>
                          {consultation.ordonnance.items.map((med, idx) => (
                            <li key={idx}>
                              💊 {med.name} - {med.dose} {med.duration && `(${med.duration})`}
                            </li>
                          ))}
                        </ul>
                      )}
                      {consultation.ordonnance.instructions && (
                        <p><em>{consultation.ordonnance.instructions}</em></p>
                      )}
                    </div>
                  ) : (
                    <p>Pas d’ordonnance associée.</p>
                  )}

                  {/* Boutons d'action */}
                  <div className="admin-consultation-actions-container">
                    <button
                      className="admin-consultation-actions"
                      onClick={() => handleDelete(consultation.id)}
                    >
                      🗑 Supprimer
                    </button>

                 
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
}
