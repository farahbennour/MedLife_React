import axios from "axios";
import { useEffect, useState } from "react";
import RendezVousForm from "../../Patient/RendezVousForm/RendezVousForm";
import "./DashboardReceptionist.css";
import cardiologie from "/src/assets/cardiologie.png";
import neurologie from "/src/assets/neurologie.png";
import orthopédie from "/src/assets/orthopédie.png";
import Gastroenterologist from "/src/assets/Gastro-entérologie.png";
import { CaseLower } from "lucide-react";

export default function DashboardReceptionist() {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const clinicId = localStorage.getItem("clinicId");

  const localImages = {
    cardiologie: cardiologie,
    neurologie: neurologie,
    orthopédie: orthopédie,
    gastroenterologist: Gastroenterologist,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Services for the receptionist's clinic
        const servicesRes = await axios.get(
          `http://localhost:3000/services/clinic/${clinicId}`, // Replace 1 with clinic_id dynamically
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices(servicesRes.data);

        // Patients for the receptionist
        const patientsRes = await axios.get(
          `http://localhost:3000/users/patient/clinic/${clinicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatients(patientsRes.data);

        // Doctors for receptionist
        const doctorsRes = await axios.get(
          `http://localhost:3000/rendezvous/receptionist/doctors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleOpenRendezVousForm = (service) => setSelectedService(service);
  const handleCloseRendezVousForm = () => setSelectedService(null);

  if (loading) return <p>Chargement des données...</p>;

  return (
    <div className="dashboard-root">
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
                    <div className="service-card" key={service.id}>
                      <div className="service-image-box">
                        <img
                          src={localImages[service.name.toLowerCase()] || "/src/assets/default-service.png"}
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
                      <td>{p.phone || "—"}</td>
                      <td>{p.address || "—"}</td>
                      <td>{p.dateNaissance ? new Date(p.dateNaissance).toLocaleDateString() : "—"}</td>
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

      <div className={`rendezvous-form-slide ${selectedService ? "open" : ""}`}>
        {selectedService && (
          <RendezVousForm service={selectedService} onClose={handleCloseRendezVousForm} />
        )}
      </div>
    </div>
  );
}