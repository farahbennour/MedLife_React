
import axios from "axios";
import { useEffect, useState } from "react";
import AlertService from "../../../Services/Alert";
import RendezVousForm from "../RendezVousForm/RendezVousForm";
import "./dashbordpatient.css";

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
  const clinicId = localStorage.getItem("clinicId");
  const emptyMsg ="No services available"
  // ---------------------------
  // Images et couleurs associées aux services
  // ---------------------------
   const normalize = (name) =>
    name
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // accents
      .replace(/[^a-z]/g, ""); // espaces, tirets, (), etc.

  const serviceImages = {
    cardiologie: "/src/assets/cardiologie.png",
    dermatologie: "/src/assets/Dermatologie.png",
    neurologie: "/src/assets/neurologie.png",
    gynecologie: "/src/assets/Gynécologie.png",
    orthopedie: "/src/assets/orthopédie.png",
    ophthalmologie: "/src/assets/Ophthalmologie.png",
    orlotorhinolaryngologie: "/src/assets/ORL (Oto-Rhino-Laryngologie).png",
    gastroenterologie: "/src/assets/Gastro-entérologie.png",
    urologie: "/src/assets/Urologie.png",
    nephrologie: "/src/assets/Néphrologie.png",
    endocrinologie: "/src/assets/Endocrinologie.png",
    oncologie: "/src/assets/Oncologie.png",
    rhumatologie: "/src/assets/Rhumatologie.png",
    chirurgiegenerale: "/src/assets/chirurgieGénérale.png",
    chirurgieplastique: "/src/assets/chirurgiePlastique.png",
    anesthesiologie: "/src/assets/Anesthésiologie.png",
    radiologie: "/src/assets/Radiologie.png",
    pneumologie: "/src/assets/Pneumologie.png",
    medecineinterne: "/src/assets/Médecine Interne.png",
    psychiatrie: "/src/assets/Psychiatrie.png",
    traumatologie: "/src/assets/Traumatologie.png",
  };

  // ---------------------------
  // COLORS — fixed & normalized
  // ---------------------------
  const pastelColors = {
    cardiologie: "#C8E4F7",
    dermatologie: "#FEE1B3",
    neurologie: "#EAD7F7",
    gynecologie: "#F7D6E6",
    orthopedie: "#DFF6F0",
    ophthalmologie: "#FFF2CC",
    orlotorhinolaryngologie: "#E6F4F1",
    gastroenterologie: "#E0E7FF",
    urologie: "#D6EAF8",
    nephrologie: "#E8F1D4",
    endocrinologie: "#F9E1F2",
    oncologie: "#F7D9D9",
    rhumatologie: "#E2F2FF",
    chirurgiegenerale: "#FFE8D6",
    chirurgieplastique: "#FDE2FF",
    anesthesiologie: "#E4F5E7",
    radiologie: "#D8F3DC",
    pneumologie: "#D7E9FF",
    medecineinterne: "#F5EEDC",
    psychiatrie: "#E8DFFC",
    traumatologie: "#FFE5DF",
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
          params: { clinicId: clinicId } // Envoyer le clinicId comme paramètre
        });
        
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        console.error(err);
        AlertService.error("Erreur", "Erreur lors du parcour des services");
      } finally {
        setLoading(false);
      }
    };
    
    if (clinicId) {
      fetchServices();
    } else {
      setError("Clinic ID not found, please login again.");
      setLoading(false);
    }
  }, [token, clinicId]);


  // ---------------------------
  // Filtre des services selon le searchTerm
  // ---------------------------
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) =>
         s?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="hero-left-patient">
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
            placeholder="Cherchez votre service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="search-btn"
            onClick={() => {
              setFilteredServices(
                services.filter((s) =>
                 s?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
              );
            }}
          >
            Rechercher
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
            <p className="no-service">{emptyMsg}</p>
          ) : (
           filteredServices.map((service) => {
              const key = normalize(service.name);
              const imageSrc = serviceImages[key] || "/images/default.png";
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
