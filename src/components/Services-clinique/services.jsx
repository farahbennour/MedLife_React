import React, { useEffect, useState } from "react";
import axios from "axios";
import "./services.css"; // CSS spécifique à la page des services
import Swal from "sweetalert2"; // Pour les popups de notifications
import { useLocation, useNavigate } from "react-router-dom";

// Import des images locales correspondant aux services
import cardiologie from "/src/assets/cardiologie.png";
import neurologie from "/src/assets/neurologie.png";
import orthopédie from "/src/assets/orthopédie.png";
import Gastroenterologist from "/src/assets/Gastro-entérologie.png";

// Mapping des images locales pour chaque service
const localImages = {
  cardiologie: cardiologie,
  neurologie: neurologie,
  orthopédie: orthopédie,
  Gastroenterologist: Gastroenterologist,
  // On peut ajouter d'autres services ici de la même façon
};

const Services = () => {
  // ------------------- États principaux -------------------
  const [services, setServices] = useState([]); // Liste des services
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(""); // Message d'erreur
  const [showForm, setShowForm] = useState(false); // Affichage du formulaire popup
  const [formData, setFormData] = useState({ name: "" }); // Données du formulaire
  const [editingId, setEditingId] = useState(null); // Id du service en édition

  const location = useLocation(); // Pour récupérer l'état envoyé depuis la navigation
  const navigate = useNavigate(); // Pour naviguer dans l'application
  const clinicId = location.state?.clinicId; // Récupération de l'id de la clinique

  // ------------------- Récupération des services -------------------
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Si pas de token, afficher un warning et rediriger
          Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
          window.location.href = "/login";
          return;
        }

        // Requête pour récupérer les services de la clinique
        const response = await axios.get(
          `http://localhost:3000/services/clinic/${clinicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setServices(response.data); // Mise à jour de la liste
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les services."); // Message d'erreur
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    if (clinicId) fetchServices(); // Appel uniquement si clinicId existe
  }, [clinicId]);

  // ------------------- Navigation -------------------
  const handleBack = () => navigate(-1); // Retour à la page précédente

  // ------------------- Soumission du formulaire -------------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        // ------------------- Modifier un service existant -------------------
        const response = await axios.patch(
          `http://localhost:3000/services/${editingId}`,
          { name: formData.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Mise à jour du service modifié dans la liste
        setServices(
          services.map((s) => (s.id === editingId ? response.data : s))
        );
        Swal.fire("Succès", "Service modifié avec succès ✅", "success");
      } else {
        // ------------------- Ajouter un nouveau service -------------------
        const response = await axios.post(
          `http://localhost:3000/services`,
          { name: formData.name, clinic_id: clinicId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices([...services, response.data]); // Ajout du nouveau service à la liste
        Swal.fire("Succès", "Service ajouté avec succès ✅", "success");
      }

      // Réinitialisation du formulaire
      setShowForm(false);
      setFormData({ name: "" });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Une erreur est survenue ❌", "error");
    }
  };

  // ------------------- Préparer le formulaire pour l'édition -------------------
  const handleEdit = (service) => {
    setFormData({ name: service.name });
    setEditingId(service.id);
    setShowForm(true);
  };

  // ------------------- Supprimer un service -------------------
  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera le service définitivement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#6684a3",
      cancelButtonColor: "#0ea5e9",
    });

    if (confirmResult.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(services.filter((s) => s.id !== id)); // Retirer le service de la liste
        Swal.fire("Supprimé !", "Le service a été supprimé ✅", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Impossible de supprimer le service ❌", "error");
      }
    }
  };

  // ------------------- Détails supplémentaires d’un service -------------------
  const handleMoreDetails = (service) => {
  navigate("/admin/staffservice", {
    state: { 
      serviceId: service.id,
      clinicId: clinicId   // 🔹 نبعث الـ clinicId معاه
    },
  });
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
                <p>{service.description || "Pas de description"}</p>

                <div className="course-meta">
                  <div className="date">
                   
                  
                  </div>
                </div>

                {/* Bouton pour accéder aux détails */}
                <button
                  className="more-btn"
                  onClick={() => handleMoreDetails(service)}
                >
                  More Details →
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
                    onClick={() => handleDelete(service.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Illustration / image du service */}
              <div className="illustration">
                {localImages[service.name.toLowerCase()] && (
                  <img
                    src={localImages[service.name.toLowerCase()]}
                    alt={service.name}
                  />
                )}
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
              <input
                type="text"
                placeholder="Nom du service"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
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
