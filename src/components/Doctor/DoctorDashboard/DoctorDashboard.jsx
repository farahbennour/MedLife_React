import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorDashboard.css";
import cardiologie from "/src/assets/cardiologie.png";
import neurologie from "/src/assets/neurologie.png";
import orthopédie from "/src/assets/orthopédie.png";
import Gastroenterologist from "/src/assets/Gastroenterologist.jpeg";
import { CaseLower } from "lucide-react";

export default function DoctorDashboard() {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorRdvs, setDoctorRdvs] = useState([]);
  const [rdvCount, setRdvCount] = useState(0);


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
          `http://localhost:3000/consultation/my-clinic-dossiers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatients(patientsRes.data);

        const res = await axios.get('http://localhost:3000/rendezvous/doctor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctorRdvs(res.data);
        setRdvCount(res.data.length);

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
    <div className="doctor-dashboard-root">
      <header className="doctor-hero doctor-glass-effect">
        <div className="doctor-hero-inner">
          <div className="doctor-hero-left">
            <h1>👨‍⚕️ Simplifiez la gestion de vos rendez-vous et de vos patients </h1>
          </div>
          <div className="doctor-hero-right">
            <div className="doctor-card">
              <span className="doctor-icon">🏥</span>
            </div>
          </div>
        </div>
      </header>

      <div className="doctor-dashboard-grid">
        <div className="doctor-dashboard-left">
          <div className="doctor-services-container doctor-glass-effect">
            <section className="doctor-services-section">
              <h2>Nos Services :</h2>
              <div className="doctor-cards-row">
                {services.map((service) => (
                  <div className="doctor-service-card" key={service.id}>
                    <div className="doctor-service-image-box">
                      <img
                        src={localImages[service.name.toLowerCase()] || "/src/assets/default-service.png"}
                        alt={service.name}
                        className="doctor-service-img"
                      />
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="doctor-users-section">
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
                    <th>Service </th>
                  </tr>
                </thead>
                  <tbody>
                  {patients.map((dossier) => {
                    const p = dossier.patient;
                    return (
                      <tr key={p.id}>
                        <td>{p.user?.username}</td>
                        <td>{p.user?.email}</td>
                        <td>{p.user?.phone || "—"}</td>
                        <td>{p.address || "—"}</td>
                        <td>{p.dateNaissance ? new Date(p.dateNaissance).toLocaleDateString() : "—"}</td>
                        <td>{p.clinic?.name || "—"}</td>
                        <td>{p.services?.map((s) => s.name).join(", ") || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          </section>
        </div>

        <div className="doctor-dashboard-right">
          <div className="doctor-user-card">
            <img src="/src/assets/user.png" alt="Doctor" className="doctor-user-avatar" />
            <h3>{localStorage.getItem("username") || "Doctor"}</h3>
          </div>

          <div className="doctor-counts-circles">
            <div className="doctor-circle-card">
              <h3>{services.length}</h3>
              <p>Services</p>
            </div>
            <div className="doctor-circle-card">
              <h3>{patients.length}</h3>
              <p>Patients</p>
            </div>
            <div className="doctor-circle-card1">
              <h3>{rdvCount}</h3>
              <p>Mes RDV</p>
            </div>
          </div>

          <section className="doctor-users-section">
            <h2>Mes Rendez-vous</h2>
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {doctorRdvs.map((rdv) => (
                  <tr key={rdv.id}>
                    <td>{rdv.patient.user.username}</td>
                    <td>{rdv.service.name}</td>
                    <td>{new Date(rdv.date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</td>
                    <td>{rdv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>

  );
}