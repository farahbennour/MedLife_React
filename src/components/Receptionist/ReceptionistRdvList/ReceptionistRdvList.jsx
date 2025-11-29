import axios from "axios";
import { useEffect, useState } from "react";
import AlertService from "../../../Services/Alert";
import "./ReceptionistRdvList.css";

const ReceptionistRdvList = () => {
  const [rdvs, setRdvs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingRdvId, setUpdatingRdvId] = useState(null);

  const token = localStorage.getItem("token");

  // 🩺 Fetch RDVs + Doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rdvRes, doctorRes] = await Promise.all([
          axios.get("http://localhost:3000/rendezvous/receptionist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/rendezvous/receptionist/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRdvs(rdvRes.data);
        setDoctors(doctorRes.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données");
        AlertService.error("Erreur", "Impossible de charger les rendez-vous et les médecins.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 🩹 Assign doctor to a rendez-vous
  const handleAssignDoctor = async (rdvId, doctorUserId) => {
    if (!doctorUserId) return;
    try {
      setUpdatingRdvId(rdvId);

      await axios.post(
        `http://localhost:3000/rendezvous/${rdvId}/assign-doctor`,
        { doctorId: doctorUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh RDVs
      const response = await axios.get("http://localhost:3000/rendezvous/receptionist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRdvs(response.data);

      AlertService.success("Docteur assigné", "Le médecin a été assigné avec succès !");
    } catch (error) {
      console.error(error);
      AlertService.error("Erreur", "Erreur lors de l’assignation du docteur.");
    } finally {
      setUpdatingRdvId(null);
    }
  };

  if (loading) return <p className="receptionist-rdv-message">Chargement...</p>;
  if (error) return <p className="receptionist-rdv-message error">{error}</p>;

  return (
    <div className="receptionist-rdv-container">
      <h1>📅 Liste des Rendez-vous</h1>
      <div className="receptionist-rdv-table-wrapper">
        <table className="receptionist-rdv-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Service</th>
              <th>Médecin souhaité</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Assigner un docteur</th>
            </tr>
          </thead>
          <tbody>
            {rdvs.map((rdv) => (
              <tr key={rdv.id}>
                <td>{rdv.patient?.user?.username || "—"}</td>
                <td>{rdv.patient?.user?.email || "—"}</td>
                <td>{rdv.service?.name || "—"}</td>
                <td>{rdv.preferredDoctor?.user?.username || "— Aucun souhait —"}</td>
                <td>
                  {new Date(rdv.date).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "Africa/Tunis",
                  })}
                </td>
                <td>
                  <span
                    className={`receptionist-rdv-status ${
                      rdv.status === "pending"
                        ? "pending"
                        : rdv.status === "cancelled"
                        ? "cancelled"
                        : "confirmed"
                    }`}
                  >
                    {rdv.status === "pending"
                      ? "En attente"
                      : rdv.status === "confirmed"
                      ? "Confirmé"
                      : rdv.status === "cancelled"
                      ? "Annulé"
                      : rdv.status}
                  </span>
                </td>
                <td>
                  <select
                    value={rdv.doctor ? rdv.doctor.user.id : ""}
                    onChange={(e) =>
                      handleAssignDoctor(rdv.id, Number(e.target.value))
                    }
                    disabled={updatingRdvId === rdv.id}
                  >
                    {!rdv.doctor ? (
                      <option value="">Sélectionner un docteur</option>
                    ) : (
                      <option value={rdv.doctor.user.id}>
                        {rdv.doctor.user.username} ({rdv.doctor.specialty || "Spécialité inconnue"})
                      </option>
                    )}

                    {doctors
                      .filter((doc) => doc.user.id !== rdv.doctor?.user?.id)
                      .map((doc) => (
                        <option key={doc.id} value={doc.user.id}>
                          {doc.user.username} ({doc.specialty})
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceptionistRdvList;