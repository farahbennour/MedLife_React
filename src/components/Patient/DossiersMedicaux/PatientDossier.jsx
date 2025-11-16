import axios from "axios";
import { useEffect, useState } from "react";
import AlertService from "../../../Services/Alert";
import "./PatientDossier.css";

import OrdonnancePDF from "../../../Services/ordonnance.jsx";

export default function PatientDossier() {
  const [dossier, setDossier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Mon Dossier Médical");

  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/consultation/my-dossiers?patientId=${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDossier(res.data.dossiers || []);

        if (res.data.patient?.user?.username)
          setPatientName(res.data.patient.user.username);

      } catch (err) {
        console.error(err);
        AlertService.error("Erreur", "Impossible de charger votre dossier.");
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [patientId, token]);

  if (loading) return <div className="dossier-loading">Chargement du dossier...</div>;

  return (
    <div className="patient-dossier-container">
      <div className="dossier-header">
        <button className="patient-back-btn" onClick={() => window.history.back()}>
          ⬅ Retour
        </button>
        <h2 className="patients-name">Dossier Médical</h2>
      </div>

      {dossier.length === 0 ? (
        <p>Aucun dossier trouvé.</p>
      ) : (
        dossier.map(d => (
          <div key={d.id} className="dossier-card">
            <h3>Dossier créé le {new Date(d.createdAt).toLocaleDateString("fr-FR")}</h3>

            {d.consultations.map(c => (
              <div key={c.id} className="consultation-card">
                <h4>Consultation du {new Date(c.createdAt).toLocaleDateString("fr-FR")}</h4>

           <div className="clinic-info-container">
              <div className="clinic-info-block">
                <strong>Clinique :</strong> {c.clinicName || d.clinic?.name || "—"}
              </div>
              <div className="clinic-info-block">
                <strong>Adresse :</strong> {c.clinicAddress || d.clinic?.address || "—"}
              </div>
              <div className="clinic-info-block">
                <strong>Téléphone :</strong> {c.clinicPhone || d.clinic?.phone || "—"}
              </div>
                <div className="clinic-info-block">
                <strong>Docteur :</strong> Dr.  {c.doctorName || c.doctor?.user?.username || "—"}
              </div>
                <div className="clinic-info-block">
                <strong>Montant :</strong>  {c.totalAmount || "—"} TND
              </div>
                  

            </div>

                <p><strong>Patient :</strong> {d.patient?.user?.username}</p>

                <p><strong>Diagnostic :</strong> {c.diagnostic || "—"}</p>
                <p><strong>Notes :</strong> {c.notes || "Aucune note"}</p>

                {c.ordonnance ? (
                  <div className="patient-ordonnance-section">
                    <h5>Ordonnance :</h5>
                    {c.ordonnance.items?.length ? (
                      <ul>
                        {c.ordonnance.items.map((i, idx) => (
                          <li key={idx}>💊 {i.name} — {i.dose} {i.duration && `(${i.duration})`}</li>
                        ))}
                      </ul>
                    ) : <p>Aucun médicament prescrit.</p>}
                    {c.ordonnance.instructions && <p><em>{c.ordonnance.instructions}</em></p>}
                  </div>
                ) : <p>Aucune ordonnance disponible.</p>}

                {/* Génération PDF */}
                {c.ordonnance && (
                  <OrdonnancePDF
                    ordonnance={{
                      patientName,
                      doctorName: c.doctorName || c.doctor?.user?.username || "Médecin inconnu",
                      items: c.ordonnance.items || [],
                      instructions: c.ordonnance.instructions || "",
                      date: c.createdAt,
                    }}
                    clinicInfo={{
                      name: c.clinicName || d.clinic?.name || "Clinique Exemple",
                      address: c.clinicAddress || d.clinic?.address || "Adresse N/A",
                      phone: c.clinicPhone || d.clinic?.phone || "Tél N/A",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
