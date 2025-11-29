import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./sidebar.css";

const menu = [
  { to: "/admin/dashboard", label: "Dashboard", img: "/src/assets/dashboard.png" },
  { to: "/admin/cliniques", label: "Cliniques", img: "/src/assets/cliniques.png" },
  { to: "/admin/doctor", label: "Doctor", img: "/src/assets/consultation.png" },
  { to: "/admin/patientList", label: "Patient", img: "/src/assets/patient.png" },
  { to: "/admin/receptionist", label: "Receptionist", img: "/src/assets/infermiere.png" },
  { to: "/admin/update-profile-admin", label: "Profil", img: "/src/assets/profil.png" },
  { to: "/admin/DossiersList", label: "Dossiers Médicaux", img: "/src/assets/dossier.png" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleNavClick = () => {
    if (window.innerWidth <= 480) setIsOpen(false); // ferme la sidebar après clic sur mobile
  };

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
      if (token) {
        await axios.post("http://localhost:3000/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      localStorage.clear();
      Swal.fire({ title: "Déconnecté", text: "Vous avez été déconnecté.", icon: "success", timer: 2000, showConfirmButton: false });
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      Swal.fire("Erreur", "Une erreur est survenue lors de la déconnexion.", "error");
    }
  };

  return (
    <>
      {/* Burger mobile */}
      <button className="burger-btn" onClick={handleToggle} aria-label="Toggle sidebar">☰</button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="/src/assets/logo.png" alt="Clinique Logo" className="sidebar-logo" />
        </div>

        <ul className="sidebar-menu">
          {menu.map(m => (
            <li key={m.to}>
              <NavLink to={m.to} className="sidebar-link" onClick={handleNavClick}>
                <img src={m.img} alt={m.label} className="sidebar-icon" />
                <span className="link-text">{m.label}</span>
              </NavLink>
            </li>
          ))}

          <li>
            <button onClick={handleLogout} className="sidebar-link logout">
              <img src="/src/assets/deconnexion.png" alt="Déconnexion" className="sidebar-icon" />
              <span className="link-text">Déconnexion</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
