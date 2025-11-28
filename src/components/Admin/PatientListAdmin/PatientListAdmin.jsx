import axios from "axios"; // Pour les requêtes HTTP
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook pour la navigation
import Swal from "sweetalert2"; // Pour les alertes modales
import "./PatientListAdmin.css"; // Styles spécifiques à ce composant

export default function PatientListAdmin() {
  const navigate = useNavigate(); // Hook pour redirection
  const role = localStorage.getItem("role"); // Rôle de l'utilisateur connecté

  // ------------------- States -------------------
  const [patients, setPatients] = useState([]); // Liste des patients
  const [clinics, setClinics] = useState([]); // Liste des cliniques
  const [services, setServices] = useState([]); // Liste des services d'une clinique
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [search, setSearch] = useState(""); // Recherche dynamique
  const [showModal, setShowModal] = useState(false); // Affichage modal ajout/modification
  const [editPatientId, setEditPatientId] = useState(null); // Id patient pour modification

  const clinicId = localStorage.getItem("clinicId"); // Récupération de l'ID de la clinique pour la réceptionniste
  // Formulaire pour ajout/modification
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    clinic_id: "",
    phone: "",
    address: "",
    dateNaissance: "",
  });

  // ------------------- Charger les patients -------------------
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token non trouvé. Veuillez vous reconnecter.");
        navigate("/login"); // Redirection vers login si pas de token
        return;
      }

      const res = await axios.get(`http://localhost:3000/users/patients/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data); // Stocke les patients
    } catch (error) {
      console.error("Erreur lors du chargement des patients :", error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchPatients(); // Chargement au montage
  }, []);

  // ------------------- Charger les cliniques -------------------
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(res.data); // Stocke les cliniques
      } catch (error) {
        console.error("Erreur lors du chargement des cliniques :", error);
      }
    };
    fetchClinics();
  }, []);

  // ------------------- Filtrage dynamique -------------------
  const filteredPatients = patients.filter(
    (p) =>
      p.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      (p.clinic?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.service?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  
 


     

  // ------------------- Supprimer un patient -------------------
  const handleDeletePatient = async (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action va supprimer le patient définitivement !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6684a3",
      cancelButtonColor: "#0ea5e9",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:3000/users/patient/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Supprimé !", "Le patient a été supprimé avec succès.", "success");
          fetchPatients(); // Rechargement liste
        } catch (error) {
          console.error(error);
          Swal.fire("Erreur !", error.response?.data?.message || "Erreur inconnue", "error");
        }
      }
    });
  };

  if (loading) return <p>Chargement des patients...</p>; // Affichage pendant le fetch

 
  return (
    <div className="patient-admin-main">
      {/* Banner */}
      <div className="patient-admin-banner">
        <div className="patient-admin-banner-text">
          <h2>Liste des Patients</h2>
          <p>Gérez les patients de vos cliniques.</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="patient-admin-search">
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
      </div>

      {/* Liste des patients */}
      <div className="patient-admin-section">
        <div className="patient-admin-grid">
          {filteredPatients.map((p) => (
            <div className="patient-admin-card" key={p.id}>
               <h4>{p.username}</h4>
                <p className="patient-admin-attribute">
                  <span className="title">Email:</span> <span className="value">{p.email}</span>
                </p>
                <p className="patient-admin-attribute">
                  <span className="title">Téléphone:</span> <span className="value">{p.phone || "—"}</span>
                </p>
                <p className="patient-admin-attribute">
                  <span className="title">Adresse:</span> <span className="value">{p.address || "—"}</span>
                </p>
                <p className="patient-admin-attribute">
                  <span className="title">Date de naissance:</span> <span className="value">{p.dateNaissance ? new Date(p.dateNaissance).toLocaleDateString() : "—"}</span>
                </p>
                <p className="patient-admin-attribute">
                  <span className="title">Clinique:</span> <span className="value">{p.clinic || "—"}</span>
                </p>
              {/* Bouton supprimer pour admin */}
              <div className="patient-admin-modal-actions">
                {role === "admin" && (
                  <button className="btn-cancel" onClick={() => handleDeletePatient(p.id)}>Supprimer</button>
                )}
              </div>
            </div>
          ))}

         
        </div>
      </div>

      
    </div>
  );
}
