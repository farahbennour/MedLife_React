import React, { useEffect, useState } from "react";
import axios from "axios";
import "./services.css"; // CSS spécifique à la page des services
import Swal from "sweetalert2"; // Pour les popups de notifications
import { useLocation, useNavigate } from "react-router-dom";

// Import des images locales correspondant aux services
import cardiologie from "/src/assets/cardiologie.png";
import neurologie from "/src/assets/neurologie.png";
import orthopédie from "/src/assets/orthopédie.png";
import gastroentérologie from "/src/assets/Gastro-entérologie.png";
import dermatologie from "/src/assets/Dermatologie.png";
import gynécologie from "/src/assets/Gynécologie.png";
import ophthalmologie from "/src/assets/Ophthalmologie.png";
import orl from "/src/assets/ORL (Oto-Rhino-Laryngologie).png";
import urologie from "/src/assets/Urologie.png";
import néphrologie from "/src/assets/Néphrologie.png";
import endocrinologie from "/src/assets/Endocrinologie.png";
import oncologie from "/src/assets/Oncologie.png";
import rhumatologie from "/src/assets/Rhumatologie.png";
import chirurgieGénérale from "/src/assets/chirurgieGénérale.png";
import chirurgiePlastique from "/src/assets/chirurgiePlastique.png";
import anesthésiologie from "/src/assets/Anesthésiologie.png";
import radiologie from "/src/assets/Radiologie.png";
import pneumologie from "/src/assets/Pneumologie.png";
import médecineInterne from "/src/assets/Médecine Interne.png";
import psychiatrie from "/src/assets/Psychiatrie.png";
import traumatologie from "/src/assets/Traumatologie.png";

// Mapping des images locales pour chaque service
const normalize = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z]/g, ""); // remove spaces, () and others

const localImages = {
  cardiologie: cardiologie,
  dermatologie: dermatologie,
  neurologie: neurologie,
  gynecologie: gynécologie,
  orthopedie: orthopédie,
  ophthalmologie: ophthalmologie,
  orlotorhinolaryngologie: orl,
  gastroenterologie: gastroentérologie,
  urologie: urologie,
  nephrologie: néphrologie,
  endocrinologie: endocrinologie,
  oncologie: oncologie,
  rhumatologie: rhumatologie,
  chirurgiegenerale: chirurgieGénérale,
  chirurgieplastique: chirurgiePlastique,
  anesthesiologie: anesthésiologie,
  radiologie: radiologie,
  pneumologie: pneumologie,
  medecineinterne: médecineInterne,
  psychiatrie: psychiatrie,
  traumatologie: traumatologie,
};

const serviceOptions = [
  "Cardiologie",
  "Dermatologie",
  "Neurologie",
  "Gynécologie",
  "Orthopédie",
  "Ophthalmologie",
  "ORL (Oto-Rhino-Laryngologie)",
  "Cardiologie",
  "Dermatologie",
  "Neurologie",
  "Gynécologie",
  "Orthopédie",
  "Ophthalmologie",
  "ORL (Oto-Rhino-Laryngologie)",
  "Gastroentérologie",
  "Urologie",
  "Néphrologie",
  "Endocrinologie",
  "Oncologie",
  "Rhumatologie",
  "Chirurgie Générale",
  "Chirurgie Plastique",
  "Anesthésiologie",
  "Radiologie",
  "Pneumologie",
  "Médecine Interne",
  "Psychiatrie",
  "Traumatologie",
];
const Services = () => {
  // ------------------- États principaux -------------------
  const [services, setServices] = useState([]); // Liste des services
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(""); // Message d'erreur
  const [showForm, setShowForm] = useState(false); // Affichage du formulaire popup
  const [formData, setFormData] = useState({ name: "" }); // Données du formulaire
  const [editingId, setEditingId] = useState(null); // Id du service en édition
const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation(); // Pour récupérer l'état envoyé depuis la navigation
  const navigate = useNavigate(); // Pour naviguer dans l'application
  // 🔹 Récupération du clinic_id depuis state ou localStorage

// 🔹 Nouvelle fonction pour le bouton "Retour"
const handleBack = () => {
  navigate(-1); // Retour à la page précédente
};
const { serviceId, clinic_id: clinicId } = location.state || {};

// 🔹 Récupération du clinic_id depuis state ou localStorage
const clinic_id = Number(location.state?.clinic_id || localStorage.getItem("clinic_id"));

// ------------------- Récupération des services -------------------
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
    navigate("/login");
    return;
  }
   if (!clinic_id || clinic_id === 0) { // 🔹 Vérification du clinic_id
      Swal.fire("Erreur", "Clinic ID manquant ❌", "error");
      navigate("/admin/cliniques");
      return;
    }



  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/services/clinic/${clinic_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(response.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les services.");
      if (err.response && err.response.status === 401) {
        Swal.fire("Erreur", "Session expirée. Veuillez vous reconnecter.", "error");
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchServices();
}, [clinic_id, navigate]);



// ------------------- Soumission du formulaire -------------------
const handleFormSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  if (!clinic_id || clinic_id === 0) {
    Swal.fire("Erreur", "Impossible d'ajouter le service : Clinic ID manquant ❌", "error");
    return;
  }

  // 🔹 Vérification si le service existe déjà dans cette clinique
  const serviceExists = services.some(
    (s) => s.name.toLowerCase() === formData.name.toLowerCase()
  );
  if (serviceExists && !editingId) {
    Swal.fire({ timer: 2500,
        showConfirmButton: false,title:"Attention", text:"Ce service existe déjà pour cette clinique ❌",icon: "warning"});
    return;
  }

  try {
    if (editingId) {
      const response = await axios.patch(
        `http://localhost:3000/services/${editingId}`,
        { name: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(services.map(s => (s.id === editingId ? response.data : s)));
      
      Swal.fire({
        icon: "success",
        title: "Modifié",
        text: "Service modifié avec succès ✅",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      const response = await axios.post(
        `http://localhost:3000/services`,
        { name: formData.name, clinic_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices([...services, response.data]);
       Swal.fire({
        icon: "success",
        title: "Ajouté",
        text: "Service ajouté avec succès ✅",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setShowForm(false);
    setFormData({ name: "" });
    setEditingId(null);
  } catch (err) {
    console.error(err);
    Swal.fire("Erreur", "Une erreur est survenue ❌", "error");
  }
};


  
  // ------------------- Supprimer un service -------------------
 const handleDelete = async (service) => {
  try {
    const token = localStorage.getItem("token");

    // 1️⃣ Vérification avant suppression
    const canDeleteResponse = await axios.get(
      `http://localhost:3000/services/${service.id}/can-delete`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { canDelete, doctorsCount, receptionistsCount, message } = canDeleteResponse.data;

 if (!canDelete) {
   Swal.fire({
    title: "Service non vide",
     html: `
      <div style="
        text-align: left; 
        font-size: 15px; 
        line-height: 1.6; 
        color: #2d3e50;
        padding: 0;
      ">
        
        <p style="margin-bottom: 12px;">
          Ce service est actuellement <strong style="color:#e63946;">actif</strong> 
          et utilisé par des membres du personnel. 
          Vous devez d'abord libérer le service avant de le supprimer.
        </p>

        <div style="
          background: #f5f9ff;
          padding: 12px 15px; 
          border-radius: 10px;
          border-left: 5px solid #4a90e2;
          margin-bottom: 14px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        ">
          <ul style="list-style: none; padding: 0; margin: 0;">

          
            <li style="margin-bottom: 10px; display:flex; align-items:center;">
              <span style="
                font-size:21px; 
                margin-right:8px;
                color:#4a90e2;
              ">👨‍⚕️</span>
              <strong>Médecins :</strong> 
              <span style="color: #e63946; font-weight: 700; margin-left:6px;">
                ${doctorsCount}
              </span>
            </li>

           
            <li style="display:flex; align-items:center;">
              <span style="
                font-size:21px;
                margin-right:8px;
                color:#50b38f;
              ">🧑‍💼</span>
              <strong>Réceptionnistes :</strong> 
              <span style="color: #e63946; font-weight: 700; margin-left:6px;">
                ${receptionistsCount}
              </span>
            </li>

          </ul>
        </div>

        <p style="
          font-size: 13px; 
          color: #5a6b7b;
          margin-top: 8px;
        ">
          Réaffectez ou retirez ces utilisateurs avant de supprimer le service.
        </p>

      </div>
    `,
    icon: "warning",
    confirmButtonColor: "#6684a3",
    confirmButtonText: "OK",
  });
  

 

  return;
}


  

    // 2️⃣ Confirmation avant suppression
    const confirmResult = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Cette action supprimera définitivement le service "${service.name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#6684a3",
      cancelButtonColor: "#0ea5e9",
    });

    if (confirmResult.isConfirmed) {
      await axios.delete(`http://localhost:3000/services/${service.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(services.filter((s) => s.id !== service.id));
      Swal.fire({
      icon:"success", 
      title:"Supprimé", 
      text:"Le service a été supprimé ✅",
      timer: 1500,
      showConfirmButton: false,  
    });
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Erreur", "Une erreur est survenue ❌", "error");
  }
};
// ------------------- Détails supplémentaires -------------------
const handleMoreDetails = (service) => {
  if (!clinic_id) {
    Swal.fire("Erreur", "Clinic ID manquant ❌", "error");
    navigate("/admin/cliniques");
    return;
  }
navigate("/admin/staffservice", {
  state: { serviceId: service.id, clinicId },
});

};


//-----------------------Modifier---------------------------

 const handleEdit = (service) => {
    setFormData({ name: service.name });
    setEditingId(service.id);
    setShowForm(true);
  };
// ------------------- Affichage loading / erreur -------------------
if (loading) return <p>Chargement des services...</p>;
if (error) return <p>{error}</p>;


  return (
    <div className="services-page">
      {/* ------------------- Header ------------------- */}
      <div className="header">
        <div className="service-back-btn" onClick={handleBack}>
          ←
        </div>
        <h2>Services de la Clinique</h2>
        <button className="add-service-btn" onClick={() => setShowForm(true)}>
          + Ajouter un Service
        </button>
      </div>

      {/* ------------------- Liste des services ------------------- */}
      <div className="services-list">
        {services.length === 0 ? (
          <p>Aucun service trouvé pour cette clinique.</p>
        ) : (
          services.map((service, index) => (
            <div
              key={service.id}
              className={`course-card ${
                index % 3 === 0 ? "purple" : index % 3 === 1 ? "orange" : "dark"
              }`}
            >
              <div className="course-info">
                <h3>{service.name}</h3>
              

                <div className="course-meta">
                  <div className="date">
                   
                  
                  </div>
                </div>

                {/* Bouton pour accéder aux détails */}
                <button
                  className="more-btn"
                  onClick={() => handleMoreDetails(service)}
                >
                  Plus de détails →
                </button>

                {/* Actions éditer / supprimer */}
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(service)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(service)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Illustration / image du service */}
              <div className="illustration">
               <img
  src={localImages[normalize(service.name)]}
  alt={service.name}
  onError={(e) => (e.target.style.display = "none")}
/>

              </div>
            </div>
          ))
        )}
      </div>

      {/* ------------------- Popup Formulaire ------------------- */}
     {showForm && (
  <div className="form-popup">
    <div className="form-content">
      <h3>{editingId ? "Modifier Service" : "Ajouter Service"}</h3>

      <form onSubmit={handleFormSubmit}>

        {/* --- DROPDOWN REACT WORKING --- */}
        <div
          className="dropdown"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className={`dropdown-selected ${dropdownOpen ? "active" : ""}`}>
            {formData.name || "-- Sélectionnez un service --"}
          </div>

          <ul className={`dropdown-list ${dropdownOpen ? "show" : ""}`}>
            {serviceOptions.map((service, index) => (
              <li
                key={index}
                onClick={() => {
                  setFormData({ ...formData, name: service });
                  setDropdownOpen(false);
                }}
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
        {/* -------------------------------- */}

        <div className="form-buttons">
          <button type="submit">
            {editingId ? "Modifier" : "Ajouter"}
          </button>

          <button type="button" onClick={() => setShowForm(false)}>
            Annuler
          </button>
        </div>

      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Services;
