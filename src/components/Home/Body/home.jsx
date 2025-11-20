import { FaClock, FaShieldAlt, FaSmile } from "react-icons/fa";

import "./home.css";

// Import des images des services
import agendaImg from "/src/assets/agenda.png";
import consultationImg from "/src/assets/consultation.png";
import factureImg from "/src/assets/facturation.png";
import patientImg from "/src/assets/patient.png";
import portailImg from "/src/assets/portail.png";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";



export default function Body() {
  return (
    <div className="home">
      {/* --- HEADER --- */}
      <Header />

      {/* --- SECTION HERO --- */}
      <section className="home-section">
        <div className="content">
          <h1>Bienvenue sur MedLife</h1>
          <p>Votre plateforme de santé intelligente, simple et rapide.</p>
          <button>Commencer</button>
        </div>
      </section>

      {/* --- SECTION SERVICES --- */}
      <section className="services">
        <h2>Nos Services</h2>
        <div className="services-cards">
          <div className="service-card">
            <img src={patientImg} alt="Gestion des patients" className="service-img" />
            <h3>Gestion des patients</h3>
            <p>Organisez et suivez facilement les informations de vos patients.</p>
          </div>

          <div className="service-card">
            <img src={agendaImg} alt="Agenda et rendez-vous" className="service-img" />
            <h3>Agenda et rendez-vous</h3>
            <p>Planifiez et gérez vos rendez-vous rapidement et efficacement.</p>
          </div>

          <div className="service-card">
            <img src={consultationImg} alt="Consultations et ordonnances" className="service-img" />
            <h3>Consultations & Ordonnances</h3>
            <p>Suivez les consultations et générez des ordonnances numériques.</p>
          </div>

          <div className="service-card">
            <img src={factureImg} alt="Facturation et paiements" className="service-img" />
            <h3>Facturation et paiements</h3>
            <p>Gérez vos paiements et factures en toute simplicité.</p>
          </div>

          <div className="service-card">
            <img src={portailImg} alt="Portail patient en ligne" className="service-img1" />
            <h3>Portail patient en ligne</h3>
            <p>Accès sécurisé pour les patients à leurs informations et rendez-vous.</p>
          </div>
        </div>
      </section>

      {/* --- SECTION POURQUOI NOUS --- */}
      <section className="why-us">
        <h2>Pourquoi choisir MedLife ?</h2>
        <div className="why-card-single">
          <div className="why-card">
            <FaShieldAlt className="icon" />
            <div>
              <h3>Sécurité</h3>
              <p>Vos données de santé sont protégées et confidentielles.</p>
            </div>
          </div>

          <div className="why-card">
            <FaClock className="icon" />
            <div>
              <h3>Disponibilité 24/7</h3>
              <p>Accédez à nos services à tout moment, où que vous soyez.</p>
            </div>
          </div>

          <div className="why-card">
            <FaSmile className="icon" />
            <div>
              <h3>Facilité d'utilisation</h3>
              <p>Une interface simple et intuitive pour tous les utilisateurs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}