import axios from "axios";
import { useEffect, useState } from "react";
import RendezVousForm from "../../Patient/RendezVousForm/RendezVousForm";
import "./DashboardReceptionist.css";


export default function DashboardReceptionist() {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const clinicId = localStorage.getItem("clinicId");
  const serviceId = localStorage.getItem("serviceId"); // service sélectionné si existant

 const normalize = (name) =>
    name
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");

  // ----------------------------------------
  // Images et couleurs pastel pour les services
  // ----------------------------------------
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ------------------ Services ------------------
        const servicesRes = await axios.get(
          `http://localhost:3000/services/clinic/${clinicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices(servicesRes.data);

        // ------------------ Patients ------------------
        if (clinicId && serviceId) {
          // 1️⃣ récupérer rendez-vous filtrés
          const rdvRes = await axios.get(
            `http://localhost:3000/rendezvous/filter?clinicId=${clinicId}&serviceId=${serviceId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const rdvs = Array.isArray(rdvRes.data) ? rdvRes.data : [];
          const patientIds = [...new Set(rdvs.map(rdv => rdv.patient?.id).filter(Boolean))];

          const patientPromises = patientIds.map(async (id) => {
            const res = await axios.get(
              `http://localhost:3000/users/patient/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const p = res.data;
            return {
              id: p.id,
              username: p.user?.username || "—",
              email: p.user?.email || "—",
              phone: p.user?.phone || "—",
              address: p.address || "—",
              dateNaissance: p.dateNaissance ? new Date(p.dateNaissance).toLocaleDateString() : "—",
              clinic: p.clinic?.name || "—",
            };
          });

          const patientsData = (await Promise.all(patientPromises)).filter(Boolean);
          setPatients(patientsData);
        }

        // ------------------ Doctors ------------------
        const doctorsRes = await axios.get(
          `http://localhost:3000/rendezvous/receptionist/doctors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDoctors(doctorsRes.data);

      } catch (err) {
        console.error("Erreur lors du fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clinicId, serviceId, token]);

  const handleOpenRendezVousForm = (service) => setSelectedService(service);
  const handleCloseRendezVousForm = () => setSelectedService(null);

  if (loading) return <p>Chargement des données...</p>;

  return (
    <div className="dashboard-root">
      {/* Header */}
      <header className="hero glass-effect">
        <div className="hero-inner">
          <div className="hero-left">
            <h1> 🤝 Offrez un service d’accueil fluide et professionnel au quotidien</h1>
          </div>
          <div className="hero-right">
            <div className="doctor-card">
              <span className="doctor-icon">🏥</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          <div className="services-container glass-effect">
            <section className="services-section">
              <h2>Nos Services : </h2>
              <div className="cards-row">
                {services.map((service) => (
                  <div className="service-card" key={service.id} onClick={() => handleOpenRendezVousForm(service)}>
                    <div className="service-image-box">
                     <img
                    src={serviceImages[normalize(service.name)] || "/src/assets/default-service.png"}
                    alt={service.name}
                    className="service-img"
                  />
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="users-section">
            <h2>Patients</h2>
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Date de Naissance</th>
                  <th>Clinique</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.username}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.address}</td>
                    <td>{p.dateNaissance}</td>
                    <td>{p.clinic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          <div className="user-card">
            <img src="/src/assets/user.png" alt="Receptionist" className="user-avatar" />
            <h3>{localStorage.getItem("username") || "Receptionist"}</h3>
          </div>

          <div className="calendar">
            <h3>Calendar - {new Date().toLocaleString("default", { month: "long", year: "numeric" })}</h3>
            <div className="calendar-grid">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`calendar-day ${i === new Date().getDate() - 1 ? "today" : ""}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Circle Cards Section */}
          <div className="counts-circles">
            <div className="circle-card">
              <h3>{services.length}</h3>
              <p>Services</p>
            </div>
            <div className="circle-card">
              <h3>{patients.length}</h3>
              <p>Patients</p>
            </div>
            <div className="circle-card">
              <h3>{doctors.length}</h3>
              <p>Doctors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rendez-vous Form */}
      <div className={`rendezvous-form-slide ${selectedService ? "open" : ""}`}>
        {selectedService && (
          <RendezVousForm service={selectedService} onClose={handleCloseRendezVousForm} />
        )}
      </div>
    </div>
  );
}
