import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebarReceptionist.css";


// Définition du menu avec les chemins des images
const menu = [
  { to: "/receptionist", label: "dashboard", img: "/src/assets/dashboard.png" },
  { to: "/receptionist/medecin", label: "Médecin", img: "/src/assets/consultation.png" },
  { to: "/receptionist/patient", label: "Patient", img: "/src/assets/portail.png" },
  { to: "/receptionist/rendezvous", label: "Rendez-vous", img: "/src/assets/agenda.png" },
  { to: "/receptionist/update-profile-receptionist", label: "Profil", img: "/src/assets/profil.png" },
 

];

export default function SidebarReceptionist() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img
          src="/src/assets/logo.png"
          alt="Clinique Logo"
          className="sidebar-logo"
        />
      </div>

      <ul className="sidebar-menu">
              {/* Boucle sur le tableau 'menu' pour créer les liens */}
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
            {/* Lien pour se déconnecter */}
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
