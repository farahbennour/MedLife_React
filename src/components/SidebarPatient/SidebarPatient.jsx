import { NavLink, useNavigate } from "react-router-dom";
import "./sidebarPatient.css";

const menu = [
  { to: "/patient", label: "dashboard", img: "/src/assets/dashboard.png" },
  { to: "/patient/rendezVousList", label: "RendezVousList", img: "/src/assets/agenda.png" },
  { to: "/patient/update-profile", label: "Profil", img: "/src/assets/profil.png" },
];

export default function SidebarPatient() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/src/assets/logo.png" alt="Clinique Logo" className="sidebar-logo" />
      </div>

      <ul className="sidebar-menu">
        {menu.map((m) => (
          <li key={m.to}>
            <NavLink
              to={m.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <img src={m.img} alt={m.label} className="sidebar-icon" />
              <span>{m.label}</span>
            </NavLink>
          </li>
        ))}

        <li>
          <a href="#" className="sidebar-link logout"
          onClick={handleLogout}
          >
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
