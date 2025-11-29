import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import './header.css';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const featuresRef = useRef(null); // 🔹 Ref pour le menu fonctionnalités
  const userRef = useRef(null);     // 🔹 Ref pour le menu utilisateur

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🔹 Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setFeaturesOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          <img src="/src/assets/logo.png" alt="MedLife" />
        </div>

        {/* Menu principal */}
     <nav className={`nav-links ${mobileOpen ? 'show' : ''} md:flex gap-6 items-center`}>

          <Link to="/" className="hover:underline">Accueil</Link>

          {/* Menu déroulant Fonctionnalités */}
          <div className="features-menu" ref={featuresRef}>
            <Link 
              className="hover:underline cursor-pointer"
              onClick={() => setFeaturesOpen(!featuresOpen)}
            >
              Fonctionnalités
            </Link>
            {featuresOpen && (
              <div className="features-dropdown md:absolute">
                <NavLink to="/patient/rendezVousList" onClick={() => setFeaturesOpen(false)}>Rendez-Vous</NavLink>
                <NavLink to="/patient/dashboard" onClick={() => setFeaturesOpen(false)}>Tableau de bord</NavLink>
                <NavLink to="/patient/dossier-medical" onClick={() => setFeaturesOpen(false)}>Dossier Médical</NavLink>
                <NavLink to="/patient/my-payments" onClick={() => setFeaturesOpen(false)}>Mes Paiements</NavLink>

              </div>
            )}
          </div>

          <Link to="/patient/a-propos" className="hover:underline">À propos</Link>
          <Link to="/patient/contact" className="hover:underline">Contact</Link>
        </nav>

        {/* Hamburger menu pour mobile */}
       {/* Hamburger menu mobile */}
        <button className="menu-toggle md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>



        {/* Connexion / Profil */}
        <div ref={userRef}>
          {!isLoggedIn ? (
           <div className="header-container">
              <button onClick={() => navigate("/login")} className="header-button">
                Se connecter
              </button>
           </div>

          ) : (
            <div className="user-menu">
              <img 
                src="/src/assets/user.png" 
                alt="Utilisateur"
                onClick={() => setUserOpen(!userOpen)}
              />
              {userOpen && (
                <div className="user-dropdown-menu">
                  <NavLink 
                    to="/patient/update-profile" 
                    onClick={() => setUserOpen(false)}
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
