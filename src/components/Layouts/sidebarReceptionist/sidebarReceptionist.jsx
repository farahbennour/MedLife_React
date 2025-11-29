import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./sidebarReceptionist.css";

const menu = [
  { to: "/receptionist", label: "Dashboard", img: "/src/assets/dashboard.png" },
  { to: "/receptionist/doctors", label: "Médecin", img: "/src/assets/consultation.png" },
  { to: "/receptionist/patient", label: "Patient", img: "/src/assets/portail.png" },
  { to: "/receptionist/rdvs", label: "Rendez-vous", img: "/src/assets/agenda.png" },
  { to: "/receptionist/update-profile-receptionist", label: "Profil", img: "/src/assets/profil.png" },
  { to: "/receptionist/emit-facture", label: "Paiement", img: "/src/assets/facturation.png" },
];

export default function SidebarReceptionist() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Ferme la sidebar si redimensionnement > 480
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 480 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Bloque le scroll quand sidebar mobile ouverte
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleClose = () => setIsOpen(false);

  const handleNavClick = () => {
    if (window.innerWidth <= 480) handleClose();
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
      Swal.fire({
        title: "Déconnecté",
        text: "Vous avez été déconnecté.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      Swal.fire("Erreur", "Une erreur est survenue lors de la déconnexion.", "error");
    }
  };

  return (
    <>
      {/* Burger mobile */}
      <button className="burger-btn" onClick={handleToggle}>☰</button>

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
                <span>{m.label}</span>
              </NavLink>
            </li>
          ))}

          <li>
            <button onClick={handleLogout} className="sidebar-link logout">
              <img src="/src/assets/deconnexion.png" alt="Déconnexion" className="sidebar-icon" />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="overlay-menu" onClick={handleClose}></div>}
    </>
  );
}
