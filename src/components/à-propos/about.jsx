import { FaCheckCircle, FaLightbulb, FaShieldAlt, FaUsers } from "react-icons/fa";

import "./about.css";
import Header from "../Home/header/header";
import Footer from "../Home/footer/footer";

export default function About() {
  return (
    <>
    <Header />
      <div className="about-page">

        {/* --- SECTION HERO --- */}
        <section className="about-hero">
          <div className="content">
            <h1>À propos de MedLife</h1>
            <p>
              MedLife est une plateforme web complète qui révolutionne la gestion des cliniques 
              et cabinets médicaux.
            </p>
          </div>
        </section>

        {/* --- SECTION HISTOIRE ET MISSION --- */}
        <section className="about-mission">
          <h2>Notre Mission</h2>
          <p>
            Digitaliser et simplifier toutes les étapes de la gestion médicale, depuis la prise
            de rendez-vous jusqu’à la facturation, tout en garantissant sécurité et confidentialité.
          </p>

          <ul className="mission-points">
            <li>📅 Optimiser la planification des rendez-vous et la gestion des patients.</li>
            <li>💻 Fournir des outils numériques modernes et intuitifs pour les praticiens.</li>
            <li>🔒 Assurer la protection et la confidentialité de toutes les données médicales.</li>
            <li>📈 Améliorer l'efficacité et la productivité des équipes médicales.</li>
          </ul>

          <h2>Notre Vision</h2>
          <p>
            Créer un écosystème de santé connecté, où patients et professionnels peuvent interagir 
            facilement et en toute confiance grâce à une interface fluide et intuitive.
          </p>

          <ul className="vision-points">
            <li>🌐 Favoriser l'accès aux soins via une plateforme centralisée et sécurisée.</li>
            <li>🤝 Renforcer la communication entre patients, médecins et personnel médical.</li>
            <li>⚡ Rendre les processus cliniques rapides, simples et sans stress.</li>
            <li>💚 Encourager une approche proactive et préventive de la santé.</li>
          </ul>
        </section>

        {/* --- SECTION VALEURS --- */}
        <section className="about-values">
          <h2>Nos Valeurs</h2>

          <div className="values-cards">
            <div className="value-card">
              <FaShieldAlt className="value-icon" />
              <h3>Sécurité</h3>
              <p>Protection et confidentialité maximales pour toutes les données médicales.</p>
            </div>

            <div className="value-card">
              <FaLightbulb className="value-icon" />
              <h3>Innovation</h3>
              <p>Solutions numériques modernes pour améliorer la gestion des cliniques et la qualité des soins.</p>
            </div>

            <div className="value-card">
              <FaUsers className="value-icon" />
              <h3>Accessibilité</h3>
              <p>Interface intuitive, disponible pour tous les utilisateurs, 24h/24 et 7j/7.</p>
            </div>

            <div className="value-card">
              <FaCheckCircle className="value-icon" />
              <h3>Fiabilité</h3>
              <p>Des outils fiables pour les professionnels de santé et les patients, garantissant efficacité et précision.</p>
            </div>
          </div>
        </section>

        {/* --- SECTION ÉQUIPE --- */}
        <section className="about-team">
          <h2>Notre Équipe</h2>
          <p>
            MedLife est conçu par une équipe passionnée de développeurs et de professionnels de santé,
            dédiée à améliorer l'expérience médicale numérique et à faciliter la vie des patients 
            comme des praticiens.
          </p>
        </section>

      </div>

      <Footer />
    </>
  );
}
