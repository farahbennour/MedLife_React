import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./sidebar.css";

// ✅ Définition du menu
const menu = [
{ to: "/admin/dashboard", label: "dashboard", img: "/src/assets/dashboard.png" },
  { to: "/admin/cliniques", label: "Cliniques", img: "/src/assets/cliniques.png" },
  { to: "/admin/doctor", label: "Doctor", img: "/src/assets/consultation.png" },
  { to: "/admin/patientList", label: "Patient", img: "/src/assets/patient.png" },
  { to: "/admin/receptionist", label: "Receptionist", img: "/src/assets/infermiere.png" },
  { to: "/admin/update-profile-admin", label: "Profil", img: "/src/assets/profil.png" },
  { to: "/admin/DossiersList", label: "Dossiers Médicaux", img: "/src/assets/dossier.png" },
 
];

export default function Sidebar() {
  const navigate = useNavigate();

  // ✅ Fonction de déconnexion
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Déconnexion",
      text: "Êtes-vous sûr de vouloir vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#0c6d78",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
console.log("Token envoyé :", token);
      // Appel API pour blacklister le token
      if (token) {
        axios.post("http://localhost:3000/auth/logout", {}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      }

      // Supprimer les infos du localStorage
      localStorage.clear();

      // Message de confirmation
      Swal.fire({
        title: "Déconnecté",
        text: "Vous avez été déconnecté avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirection après un court délai
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      Swal.fire("Erreur", "Une erreur est survenue lors de la déconnexion.", "error");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/src/assets/logo.png" alt="Clinique Logo" className="sidebar-logo" />
      </div>

      <ul className="sidebar-menu">
        {menu.map((m) => (
          <li key={m.to}>
            <NavLink to={m.to} className="sidebar-link">
              <img src={m.img} alt={m.label} className="sidebar-icon" />
              <span>{m.label}</span>
            </NavLink>
          </li>
        ))}

        {/* 🔹 Bouton Déconnexion */}
        <li>
          <button onClick={handleLogout} className="sidebar-link logout">
            <img
              src="/src/assets/deconnexion.png"
              alt="Déconnexion"
              className="sidebar-icon"
            />
            <span>Déconnexion</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}