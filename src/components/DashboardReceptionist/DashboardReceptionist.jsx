import React, { useState } from "react";
import "./DashboardReceptionist.css";
import RendezVousForm from "../RendezVousForm/RendezVousForm";

export default function DashboardReceptionist() {
  const [selectedService, setSelectedService] = useState(null);

  // ---------------------------
  // Services statiques
  // ---------------------------
  const services = [
    {
      id: 1,
      name: "Cardiologie",
      description: "Soins spécialisés pour le cœur et le système circulatoire.",
      image: "/src/assets/cardiologie.png",
      color: "#C8E4F7",
    },
    {
      id: 2,
      name: "Dentisterie",
      description: "Soins dentaires pour toutes les tranches d'âge.",
      image: "/src/assets/dentisterie.png",
      color: "#FFD6E0",
    },
    {
      id: 3,
      name: "Radiologie",
      description: "Examens radiologiques pour un diagnostic précis.",
      image: "/src/assets/radiologie.png",
      color: "#D8F3DC",
    },
    {
      id: 4,
      name: "Neurologie",
      description: "Diagnostic et traitement des maladies du système nerveux.",
      image: "/src/assets/neurologie.png",
      color: "#EAD7F7",
    },
  ];

  // ---------------------------
  // Utilisateurs statiques
  // ---------------------------
  const users = [
    { name: "Mary G. Schuecke", designation: "Project Manager", status: "Tech Interview" },
    { name: "Lawrence A. Mason", designation: "ROR Developer", status: "Task" },
    { name: "Jimmy C. Wilson", designation: "React JS Developer", status: "Resume Review" },
    { name: "Vivian J. Joseph", designation: "NodeJS Developer", status: "Final Interview" },
  ];

  const handleOpenRendezVousForm = (service) => setSelectedService(service);
  const handleCloseRendezVousForm = () => setSelectedService(null);

  return (
    <div className="dashboard-root">
      {/* HEADER */}
        <header className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1>Faites confiance aux meilleurs spécialistes certifiés</h1>
            <ul className="hero-features">
              <li>Trouvez un spécialiste médical</li>
              <li>Réservez un rendez-vous</li>
              <li>Bénéficiez de soins de qualité</li>
            </ul>
          </div>
          <div className="hero-right">
            <div className="doctor-card">🏥</div>
          </div>
        </div>
</header>
      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* SERVICES */}
          <section className="services-section">
            <h2>Nos Services</h2>
            <div className="cards-row">
              {services.map((service) => (
                <div
                  className="service-card"
                  key={service.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenRendezVousForm(service)}
                >
                  <div
                    className="service-image-box"
                    style={{ backgroundColor: service.color }}
                  >
                    <img src={service.image} alt={service.name} className="service-img" />
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* USERS LIST */}
          <section className="users-section">
            <h2>Recruitment Progress</h2>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx}>
                    <td>{user.name}</td>
                    <td>{user.designation}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* USER INFO */}
          <div className="user-card">
            <img
              src="/src/assets/user.png"
              alt="Sophia Miller"
              className="user-avatar"
            />
            <h3>Sophia Miller</h3>
            <p>Sr. UI Designer</p>
            <ul className="user-contact">
              <li>Email: sophia@example.com</li>
              <li>Company: Foxit Pvt. Ltd.</li>
              <li>Joining Date: 01/02/2018</li>
              <li>Projects: 34 Active</li>
            </ul>
          </div>

          {/* CALENDAR */}
          <div className="calendar">
            <h3>Calendar - September 2020</h3>
            <div className="calendar-grid">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`calendar-day ${i === 8 ? "today" : ""}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de rendez-vous */}
      <div className={`rendezvous-form-slide ${selectedService ? "open" : ""}`}>
        {selectedService && (
          <RendezVousForm service={selectedService} onClose={handleCloseRendezVousForm} />
        )}
      </div>
    </div>
  );
}
