// File: RendezVousForm.jsx
import React, { useEffect, useState, useRef } from "react"; // Import des hooks React
import axios from "axios"; // Pour les requêtes HTTP
import Swal from 'sweetalert2'; // Pour les alertes et notifications
import "./RendezVousForm.css"; // Styles CSS spécifiques

export default function RendezVousForm({ onClose }) {
  // ------------------- États principaux -------------------
  const [services, setServices] = useState([]); // Liste des services médicaux disponibles
  const [doctors, setDoctors] = useState([]); // Liste des médecins selon le service sélectionné
  const [selectedService, setSelectedService] = useState(""); // Service sélectionné
  const [selectedDoctor, setSelectedDoctor] = useState(""); // Médecin sélectionné
  const [date, setDate] = useState(""); // Date et heure du rendez-vous
  const [motif, setMotif] = useState(""); // Motif de consultation
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [message, setMessage] = useState(""); // Message d'information ou d'erreur
  const [isSubmitting, setIsSubmitting] = useState(false); // Indique si le formulaire est en cours d'envoi

  const modalRef = useRef(null); // Référence pour le modal (accessibilité)
  const cancelButtonRef = useRef(null); // Référence pour le bouton annuler

  const token = localStorage.getItem("token"); // Récupération du token d'authentification

  // ------------------- Focus et gestion de la touche Échap -------------------
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      // Focus sur le premier élément focalisable du modal
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Fonction pour fermer le modal avec Échap
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // ------------------- Récupérer les services disponibles -------------------
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/patient-services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data); // Stocke les services récupérés
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les services',
          confirmButtonColor: '#2563eb'
        });
      } finally {
        setLoading(false); // Fin du chargement
      }
    };
    fetchServices();
  }, [token]);

  // ------------------- Récupérer les médecins selon le service sélectionné -------------------
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedService) {
        setDoctors([]); // Si aucun service sélectionné, vide la liste des médecins
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/services/${selectedService}/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data); // Stocke les médecins récupérés
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [selectedService, token]);

  // ------------------- Soumission du formulaire -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Bloque le formulaire pendant l'envoi

    // Vérification des champs obligatoires
    if (!selectedService || !selectedDoctor || !date || !motif) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs incomplets',
        text: 'Veuillez remplir tous les champs',
        confirmButtonColor: '#2563eb'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/rendezvous",
        {
          serviceId: selectedService,
          preferredDoctorId: selectedDoctor,
          date,
          motif,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Rendez-vous créé avec succès !',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'OK'
      }).then(() => {
        // 🔹 Fermer le formulaire et retourner au dashboard
        if(onClose) onClose();
        // 🔹 Reset champs si nécessaire
        setSelectedService("");
        setSelectedDoctor("");
        setDate("");
        setMotif("");
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la création du rendez-vous',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false); // Débloque le formulaire
    }
  };

  // ------------------- Annuler le formulaire -------------------
  const handleCancel = () => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment annuler ce rendez-vous?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, continuer',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && onClose) {
        onClose(); // Fermer le formulaire et retourner au dashboard
      }
    });
  };

  // ------------------- Affichage du loader -------------------
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des services...</p>
      </div>
    );
  }

  // ------------------- Rendu du formulaire -------------------
  return (
    <div 
      className="rendezvous-form" 
      ref={modalRef} // Référence pour le modal
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Bouton pour fermer le modal */}
      <button 
        className="close-button"
        onClick={handleCancel}
        aria-label="Fermer le formulaire de rendez-vous"
        disabled={isSubmitting}
        ref={cancelButtonRef}
      >
        ×
      </button>
      
      <h2 id="modal-title">Prendre un Rendez-vous</h2>

      <form onSubmit={handleSubmit}>
        {/* Sélection du service et du médecin */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="service-select">Service médical</label>
            <select
              id="service-select"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Sélectionnez un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor-select">Médecin</label>
            <select
              id="doctor-select"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              disabled={!selectedService || isSubmitting} // Désactive si pas de service sélectionné
            >
              <option value="">Choisissez votre médecin</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.user?.username || doc.user?.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date et motif */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date-input">Date et heure</label>
            <input
              id="date-input"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="motif-input">Motif de consultation</label>
            <input
              id="motif-input"
              type="text"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Décrivez brièvement le motif de votre visite"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading" aria-hidden="true"></span>
                Traitement en cours...
              </>
            ) : (
              "Confirmer le rendez-vous"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
