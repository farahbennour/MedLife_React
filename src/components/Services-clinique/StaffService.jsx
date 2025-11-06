
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./StaffService.css";

export default function StaffService() {
  const location = useLocation();
  const { serviceId } = location.state || {};

  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [activeTab, setActiveTab] = useState("doctor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!serviceId) return;
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
        return;
      }

      try {
        // 🔹 Fetch doctors
        const doctorsRes = await axios.get(
          `http://localhost:3000/users/doctors?serviceId=${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDoctors(doctorsRes.data || []);

        // 🔹 Fetch receptionists
        const recepRes = await axios.get(
          `http://localhost:3000/users/receptionists?serviceId=${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReceptionists(recepRes.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement du staff:", error);
        Swal.fire("Erreur", "Impossible de charger le staff ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [serviceId]);

  const handleDelete = async (userId) => {
    const confirmResult = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera l'utilisateur définitivement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mise à jour des listes
      setDoctors(doctors.filter((d) => d.id !== userId));
      setReceptionists(receptionists.filter((r) => r.id !== userId));

      Swal.fire("Supprimé !", "Utilisateur supprimé ✅", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Impossible de supprimer l'utilisateur ❌", "error");
    }
  };

  if (loading) return <p>Chargement du staff...</p>;

  const activeList = activeTab === "doctor" ? doctors : receptionists;
  const emptyMsg =
    activeTab === "doctor"
      ? "Aucun docteur trouvé pour ce service."
      : "Aucun réceptionniste trouvé pour ce service.";

  return (
    <div className="staff-page">
      
      {/* --- HEADER --- */}
      <div className="staff-header">
        
        <h2 className="staff-title">Staff du Service</h2>
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

      {/* --- GRID DES CARTES --- */}
      <div className="cards-grid">
        {activeList.length === 0 ? (
          <p className="no-staff">{emptyMsg}</p>
        ) : (
          activeList.map((user) => (
            <div key={user.id} className="staff-card">
              <img
                src={user.image ||  "/src/assets/doctorlist.png"}
                alt={user.username || user.name}
                className="staff-image"
              />
              <h3>{user.username || user.name}</h3>
              
              <p className="staff-email">{user.email}</p>
              <p className="staff-phone"> {user.phone || "N/A"}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(user.id)}
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
