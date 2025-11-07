import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import './header.css';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-sky-200 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        
      
          <div className="img-container">
          <img src="/src/assets/logo.png" alt="MedLife"  />
          </div>
    

        {/* Menu principal */}
        <nav className="hidden md:flex gap-6 text-sky-800 items-center relative">
          <Link to="/" className="hover:underline">Accueil</Link>

          {/* Menu déroulant Fonctionnalités */}
          <div className="features-menu">
            <Link 
              className="hover:underline"
              onClick={() => setFeaturesOpen(!featuresOpen)}
            >
              Fonctionnalités
            </Link>
            {featuresOpen && (
              <div className="features-dropdown">
                <NavLink to="/patient/rendezVousList" onClick={() => setFeaturesOpen(false)}>Consultations</NavLink>
                <NavLink to="/patient/dashboard" onClick={() => setFeaturesOpen(false)}>Tableau de bord</NavLink>
              </div>
            )}
          </div>

          <Link to="/about" className="hover:underline">À propos</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>

        {/* Connexion / Profil */}
        <div>
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="header-button"
            >
              Se connecter
            </button>
          ) : (
          <div className="user-menu">
            <img 
              src="/src/assets/user.png" 
              alt="Utilisateur"
              onClick={() => setUserOpen(!userOpen)} // toggle au clic
            />
            {userOpen && (
              <div className="user-dropdown-menu">
                <NavLink 
                  to="/patient/update-profile" 
                  onClick={() => setUserOpen(false)} // ferme le dropdown au clic
                >
                  Profil
                </NavLink>
                <button onClick={handleLogout}>Déconnexion</button>
              </div>
            )}
          </div>

          )}
        </div>
      </div>
    </header>
  );
}
