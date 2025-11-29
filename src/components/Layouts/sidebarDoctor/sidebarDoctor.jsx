import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./sidebarDoctor.css";

// Menu de la sidebar du docteur
const menu = [
  { to: "/doctor/dashboard", label: "Dashboard", img: "/src/assets/dashboard.png" },
  { to: "/doctor/patients", label: "Patients", img: "/src/assets/patient.png" },
  { to: "/doctor/rdvs", label: "Rendez-vous", img: "/src/assets/agenda.png" },
  { to: "/doctor/update-profile-doctor", label: "Profil", img: "/src/assets/profil.png" },
];

export default function SidebarDoctor() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // état du menu mobile

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
        await axios.post(
          "http://localhost:3000/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      localStorage.clear();

      Swal.fire({
        title: "Déconnecté",
        text: "Vous avez été déconnecté avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      Swal.fire("Erreur", "Une erreur est survenue lors de la déconnexion.", "error");
    }
  };

  return (
    <>
      {/* Burger button */}
      <button className="burger-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Overlay pour mobile */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <img src="/src/assets/logo.png" alt="Clinique Logo" className="sidebar-logo" />
        </div>

        {/* Menu */}
        <ul className="sidebar-menu">
          {menu.map((m) => (
            <li key={m.to}>
              <NavLink
                to={m.to}
                className="sidebar-link"
                onClick={() => setIsOpen(false)} // ferme menu mobile au clic
              >
                <img src={m.img} alt={m.label} className="sidebar-icon" />
                <span>{m.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Déconnexion */}
          <li>
            <button onClick={handleLogout} className="sidebar-link logout">
              <img src="/src/assets/deconnexion.png" alt="Déconnexion" className="sidebar-icon" />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
