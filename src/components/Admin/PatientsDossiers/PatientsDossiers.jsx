import axios from "axios";
import { useEffect, useState } from "react";
import AlertService from "../../../Services/Alert";
import "./PatientsDossiers.css";

export default function PatientsDossiers() {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({}); // état des consultations repliées

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

  const toggleCollapse = (consultationId) => {
    setCollapsed(prev => ({
      ...prev,
      [consultationId]: !prev[consultationId],
    }));
  };

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
          responseType: "blob" 
        }
      );

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

  if (loading) return <div className="admin-dossier-loading">Chargement des dossiers...</div>;

  return (
    <div className="admin-dossier-container">
      <h2 className="admin-patient-name">Dossiers Médicaux des Patients</h2>

      {dossiers.length === 0 ? (
        <p>Aucun dossier trouvé.</p>
      ) : (
        dossiers.map((dossier) => (
          <div key={dossier.id} className="admin-dossier-card">
            <div className="admin-dossier-header">
              <div><strong>Patient:</strong> {dossier.patient?.user?.username || "—"}</div>
              <div><strong>Clinique:</strong> {dossier.clinic?.name || "—"} | <strong>Service:</strong> {dossier.service?.name || "—"}</div>
              <div><strong>Dossier créé le:</strong> {new Date(dossier.createdAt).toLocaleDateString("fr-FR")}</div>
            </div>

            {(dossier.consultations || []).length === 0 ? (
              <p>Aucune consultation trouvée.</p>
            ) : (
              dossier.consultations.map((consultation) => (
                <div key={consultation.id} className="admin-consultation-card">
                  <div 
                    className="admin-consultation-header"
                    onClick={() => toggleCollapse(consultation.id)}
                  >
                    <span>
                      <strong>Consultation:</strong> {new Date(consultation.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <span>
                      Docteur: {consultation.doctor?.user?.username || "—"}
                      <span className="admin-collapse-icon">{collapsed[consultation.id] ? "+" : "-"}</span>
                    </span>
                  </div>

                  {!collapsed[consultation.id] && (
                    <div className="admin-consultation-body">
                      <p><strong>Diagnostic:</strong> {consultation.diagnostic || "—"}</p>

                      {consultation.ordonnance ? (
                        <div className="admin-ordonnance-section">
                          <h5>Ordonnance</h5>
                          {(consultation.ordonnance.items || []).length === 0 ? (
                            <p>Aucun médicament prescrit.</p>
                          ) : (
                            <ul>
                              {consultation.ordonnance.items.map((med, idx) => (
                                <li key={idx}>💊 {med.name} - {med.dose} {med.duration && `(${med.duration})`}</li>
                              ))}
                            </ul>
                          )}
                          {consultation.ordonnance.instructions && <p><em>{consultation.ordonnance.instructions}</em></p>}
                        </div>
                      ) : <p>Pas d’ordonnance associée.</p>}

                      <div className="admin-consultation-actions">
                        <button onClick={() => handleDelete(consultation.id)}>🗑 Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
}
