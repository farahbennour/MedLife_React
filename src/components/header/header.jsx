import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './header.css';


export default function Header(){
     const navigate = useNavigate();
  return (
    
    <header className="bg-sky-200 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="header">
          <img src="/src/assets/logo.png" alt="MedLife" className="h-10 rounded" />
         
        </div>

        <nav className="hidden md:flex gap-6 text-sky-800">
          <Link to="/" className="hover:underline">Accueil</Link>
          <Link to="/features" className="hover:underline">Fonctionnalités</Link>
          <Link to="/about" className="hover:underline">À propos</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>

   <div>
      <button
        onClick={() => navigate("/login")}
        className="bg-[#6684A3] text-white px-6 py-2.5 rounded-[16px] font-semibold shadow-md hover:bg-[#557393] hover:-translate-y-0.5 transition-all duration-300"
      >
        Se connecter
      </button>
    </div>

      </div>
    </header>
  );
}
