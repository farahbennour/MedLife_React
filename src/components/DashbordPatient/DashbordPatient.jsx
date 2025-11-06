
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashbordpatient.css";
import RendezVousForm from "../RendezVousForm/RendezVousForm";
import AlertService from "../../Services/Alert";

export default function DashbordPatient() {
  // ---------------------------
  // State hooks
  // ---------------------------
  const [services, setServices] = useState([]); // Tous les services récupérés depuis l'API
  const [filteredServices, setFilteredServices] = useState([]); // Services filtrés selon la recherche
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Message d'erreur
  const [selectedService, setSelectedService] = useState(null); // Service sélectionné pour le formulaire de RDV
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche pour filtrer les services

  const token = localStorage.getItem("token"); // Récupération du token pour l'authentification

  // ---------------------------
  // Images et couleurs associées aux services
  // ---------------------------
  const serviceImages = {
    cardiologie: "/src/assets/cardiologie.png",
    dentisterie: "/src/assets/dentisterie.png",
    radiologie: "/src/assets/radiologie.png",
    neurologie: "/src/assets/neurologie.png",
    ophtalmologie: "/src/assets/ophtalmologie.png",
    orthopédie: "/src/assets/orthopédie.png",
    dermatologie: "/src/assets/dermatologie.png",
    pédiatrie: "/src/assets/pediatrie.png",
    Gastroenterologist: "/src/assets/Gastroenterologist.jpeg",
  };

  const pastelColors = {
    cardiologie: "#C8E4F7",
    dentistry: "#FFD6E0",
    radiology: "#D8F3DC",
    neurologie: "#EAD7F7",
    ophthalmology: "#FFF2CC",
    orthopédie: "#DFF6F0",
    dermatology: "#FEE1B3",
    pediatrics: "#F8D7DA",
    Gastroenterologist: "#E0E7FF",
  };

  // ---------------------------
  // useEffect pour récupérer les services depuis l'API
  // ---------------------------
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!token) {
          setError("Token not found, please login again.");
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:3000/users/patient-services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        console.error(err);
        AlertService.error("Erreur","Erreur lors du parcour des services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  // ---------------------------
  // Filtre des services selon le searchTerm
  // ---------------------------
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, services]);

  // ---------------------------
  // Ouvre le formulaire de rendez-vous pour le service sélectionné
  // ---------------------------
  const handleOpenRendezVousForm = (service) => {
    setSelectedService(service);
    setTimeout(() => {
      const formElement = document.querySelector(".rendezvous-form-slide");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  // ---------------------------
  // Ferme le formulaire de rendez-vous
  // ---------------------------
  const handleCloseRendezVousForm = () => {
    setSelectedService(null);
  };

  // ---------------------------
  // Affichage du loader ou message d'erreur
  // ---------------------------
  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="dashboardpatient-root">

      {/* ---------------------------
          Header / Hero section avec message et recherche
      --------------------------- */}
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
        
        {/* Search bar */}
        <div className="search-wrapper">
          <input
            className="search-input"
            placeholder="Search your service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="search-btn"
            onClick={() => {
              setFilteredServices(
                services.filter((s) =>
                  s.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              );
            }}
          >
            Search
          </button>
        </div>
      </header>

      {/* ---------------------------
          Section principale : Liste des services
      --------------------------- */}
      <main className="services-section">
        <h2 className="section-title">Nos Services</h2>
        <p className="section-sub">
          Nous offrons des soins de santé attentionnés et adaptés aux besoins
          variés de chaque patient.
        </p>
        <div className="cards-row">
          {filteredServices.length === 0 ? (
            <p>No services available.</p>
          ) : (
            filteredServices.map((service) => {
              const key = service.name.toLowerCase().replace(/\s/g, "");
              const imageSrc =
                serviceImages[key] || "/images/default-service.jpg";
              const bgColor = pastelColors[key] || "#F3F4F6";

              return (
                <div
                  className="service-card"
                  key={service.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenRendezVousForm(service)}
                >
                  <div
                    className="service-image-box"
                    style={{ backgroundColor: bgColor }}
                  >
                    <img src={imageSrc} alt={service.name} className="service-img" />
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ---------------------------
          Modal du formulaire de rendez-vous
      --------------------------- */}
      <div className={`rendezvous-form-slide ${selectedService ? "open" : ""}`}>
        {selectedService && (
          <RendezVousForm
            service={selectedService}
            onClose={handleCloseRendezVousForm}
          />
        )}
      </div>
    </div>
  );
}
