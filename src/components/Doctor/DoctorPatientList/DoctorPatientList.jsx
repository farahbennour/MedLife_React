import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertService from "../../../Services/Alert";
import "./DoctorPatientList.css"; // optional: for styling

export default function DoctorPatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/consultation/my-clinic-dossiers",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPatients(
        res.data.map((dossier) => ({
          id: dossier.patient?.id,
          name: dossier.patient?.user?.username || "Nom inconnu",
          clinicId: dossier.clinic?.id || dossier.patient?.clinic?.id,
          email: dossier.patient?.user?.email || "",
          phone: dossier.patient?.user?.phone || "",
        }))
      );
    } catch (err) {
      console.error("Erreur lors du fetch:", err);
      setError("Impossible de charger les patients.");
      AlertService.error("Erreur", "Impossible de charger les patients.");
    } finally {
      setLoading(false);
    }
  };

  fetchPatients();
}, [token]);


  if (loading) return <div>Chargement des patients...</div>;
  if (error) return <div>{error}</div>;

  return (
    
    <div>
     {/* Title before the container */}

    <div className="doctor-patient-list">
      <h2 className="doctor-patient-title">Liste des patients</h2>
      {patients.length === 0 ? (
        <p>Aucun patient dans votre clinique.</p>
      ) : (
        <div className="patient-cards-container">
        {patients.map((patient) => (
          <div key={patient.id} className="doctor-patient-card">
            <h3>{patient.name}</h3>
            {patient.email && <p>Email: {patient.email}</p>}
            {patient.phone && <p>Téléphone: {patient.phone}</p>}
            <button
              onClick={() => navigate(`/doctor/dossier/${patient.id}/${patient.clinicId}`)}
              className="voir-dossier-btn"
            >
              Voir Dossier
            </button>
          </div>
        ))}
        </div>
      )}
    </div>
  </div>
  );
}
