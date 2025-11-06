import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebarDoctor.css";

// Définition du menu de la sidebar du docteur
const menu = [
  { to: "/doctor", label: "Dashboard", img: "/src/assets/dashboard.png" },
  { to: "/doctor/patients", label: "Patients", img: "/src/assets/patient.png" },
  { to: "/doctor/rendezvous", label: "Rendez-vous", img: "/src/assets/agenda.png" },
  { to: "/doctor/update-profile-doctor", label: "Profil", img: "/src/assets/profil.png" },
];

export default function SidebarDoctor() {
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
    // Conteneur principal de la sidebar
    <aside className="sidebar">

      {/* --- Header de la sidebar avec logo --- */}
      <div className="sidebar-header">
        <img
          src="/src/assets/logo.png"      
          alt="Clinique Logo"             
          className="sidebar-logo"         
        />
      </div>

      {/* --- Menu de navigation de la sidebar --- */}
      <ul className="sidebar-menu">
       
        {/* Boucle sur le tableau 'menu' pour créer les liens */}
        {menu.map((m) => (
          <li key={m.to}>  {/* Chaque item du menu doit avoir une clé unique */}
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
