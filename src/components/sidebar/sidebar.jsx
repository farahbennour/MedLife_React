import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

// Définition du menu avec les chemins des images
const menu = [

  { to: "/admin/dashboard", label: "dashboard", img: "/src/assets/dashboard.png" },
  { to: "/admin/cliniques", label: "Cliniques", img: "/src/assets/cliniques.png" },
  { to: "/admin/doctor", label: "Doctor", img: "/src/assets/consultation.png" },
  { to: "/admin/patient", label: "Patient", img: "/src/assets/patient.png" },
  { to: "/admin/receptionist", label: "Receptionist", img: "/src/assets/infermiere.png" },
  { to: "/admin/update-profile-admin", label: "Profil", img: "/src/assets/profil.png" },
 

];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Logo de la clinique */}
        <img
          src="/src/assets/logo.png"
          alt="Clinique Logo"
          className="sidebar-logo"
        />
      </div>

      <ul className="sidebar-menu">
        {/* Chaque item du menu doit avoir une clé unique */}
        {menu.map((m) => (
          <li key={m.to}> {/* Chaque item du menu doit avoir une clé unique */}
            <NavLink to={m.to} className="sidebar-link">
                {/* Icône du menu */}
              <img src={m.img} alt={m.label} className="sidebar-icon" />
                {/* Texte du menu */}
              <span>{m.label}</span>
            </NavLink>
          </li>
        ))}
            {/* Bouton de déconnexion */}
        <li>
          <a href="#" className="sidebar-link logout">
            <img
              src="/src/assets/deconnexion.png"
              alt="Déconnexion"
              className="sidebar-icon"
            />
            <span>Déconnexion</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
