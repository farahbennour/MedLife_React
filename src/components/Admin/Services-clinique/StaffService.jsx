import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./StaffService.css";

export default function StaffService() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clinicId, serviceId } = location.state || {};

  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [activeTab, setActiveTab] = useState("doctor");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!clinicId || !serviceId) {
        setError("Aucune clinique ou service sélectionné.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
        setError("Pas de token");
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/users/staff?clinicId=${clinicId}&serviceId=${serviceId}`,

          { headers: { Authorization: `Bearer ${token}` } }
        );


        const data = res.data || {};
        setDoctors(data.doctors || []);
        setReceptionists(data.receptionists || []);
        setError(null);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Erreur lors du chargement du staff.");

      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [clinicId, serviceId]);

  if (loading) return <p className="loading">Chargement du staff...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const activeList = activeTab === "doctor" ? doctors : receptionists;
  const emptyMsg =
    activeTab === "doctor"
      ? "Aucun docteur trouvé."
      : "Aucun réceptionniste trouvé.";

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="staff-page">
     <div className="staff-header">
  <div className="header-top">
    <button className="back-arrow" onClick={() => navigate(-1)}>
      ←
    </button>
    <h2 className="staff-title">Équipe du service</h2>
  </div>

  <div className="tab-container">
    <button
      className={`tab-btn ${activeTab === "doctor" ? "active" : ""}`}
      onClick={() => setActiveTab("doctor")}
    >
      Doctors
    </button>
    <button
      className={`tab-btn ${activeTab === "receptionist" ? "active" : ""}`}
      onClick={() => setActiveTab("receptionist")}
    >
      Receptionists
    </button>
  </div>
</div>

      

    <div className="cards-grid large">
  {activeList.length > 0 ? (
    activeList.map((item) => {
      const user = item.user || item;
      const initials = (user.name || user.username || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div key={item.id} className="staff-card move-style">
          {/* Avatar */}
          {user.image ? (
            <img src={user.image} alt={user.name} className="avatar-move" />
          ) : (
            <div className="avatar-move avatar-initials">{initials}</div>
          )}

          {/* Info in same line */}
          <div className="info-row">
            <div><strong>Nom :</strong> {user.name || "—"}</div>
            <div><strong>Email :</strong> {user.email || "—"}</div>
            <div><strong>Téléphone :</strong> {user.phone || "—"}</div>
            
          </div>
        </div>
      );
    })
  ) : (
    <p className="no-staff">{emptyMsg}</p>
  )}
</div>


    </div>
  );
}


