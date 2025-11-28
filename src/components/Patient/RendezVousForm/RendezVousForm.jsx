import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "./RendezVousForm.css";

export default function RendezVousForm({ onClose, service: initialService }) {
  // ------------------- États principaux -------------------
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedService, setSelectedService] = useState(initialService?.id || "");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [motif, setMotif] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const token = localStorage.getItem("token");
  const clinicId = localStorage.getItem("clinicId");

  // ------------------- Date minimale (aujourd'hui) -------------------
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Définir la date minimale comme la date et heure actuelles
    const now = new Date();
    // Format YYYY-MM-DDTHH:mm pour datetime-local
    const formattedDate = now.toISOString().slice(0, 16);
    setMinDate(formattedDate);
  }, []);

  // ------------------- Focus et touche Échap -------------------
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) focusableElements[0].focus();
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') handleCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ------------------- Récupérer les services -------------------
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/patient-services", {
          headers: { Authorization: `Bearer ${token}` },
          params: { clinicId: clinicId }
        });
        setServices(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger les services', confirmButtonColor: '#2563eb' });
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [token, clinicId]);

  // ------------------- Récupérer les médecins selon le service -------------------
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedService) {
        setDoctors([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3000/services/${selectedService}/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [selectedService, token]);

  // ------------------- Validation de la date côté client -------------------
  const validateDate = (selectedDate) => {
    const selected = new Date(selectedDate);
    const now = new Date();
    return selected >= now;
  };

  // ------------------- Soumission -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation des champs requis
    if (!selectedService || !selectedDoctor || !date || !motif) {
      Swal.fire({ icon: 'warning', title: 'Champs incomplets', text: 'Veuillez remplir tous les champs', confirmButtonColor: '#2563eb' });
      setIsSubmitting(false);
      return;
    }

    // Validation de la date côté client
    if (!validateDate(date)) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Date invalide', 
        text: 'Veuillez sélectionner une date et heure futures', 
        confirmButtonColor: '#ef4444' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
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
        if(onClose) onClose();
        setSelectedService("");
        setSelectedDoctor("");
        setDate("");
        setMotif("");
      });

    } catch (err) {
      console.error(err);
      let errorMessage = 'Erreur lors de la création du rendez-vous';
      
      // Gestion spécifique des erreurs de date du serveur
      if (err.response?.data?.message?.includes('date') || err.response?.data?.message?.includes('passé')) {
        errorMessage = 'La date sélectionnée est invalide. Veuillez choisir une date future.';
      }
      
      Swal.fire({ 
        icon: 'error', 
        title: 'Erreur', 
        text: errorMessage, 
        confirmButtonColor: '#ef4444' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      if (result.isConfirmed && onClose) onClose();
    });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement des services...</p>
    </div>
  );

  return (
    <div className="rendezvous-form" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="close-button" onClick={handleCancel} aria-label="Fermer le formulaire" disabled={isSubmitting} ref={cancelButtonRef}>×</button>
      <h2 id="modal-title">Prendre un Rendez-vous</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="service-select">Service médical</label>
            <select id="service-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} disabled={isSubmitting}>
              <option value="">Sélectionnez un service</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor-select">Médecin</label>
            <select id="doctor-select" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} disabled={!selectedService || isSubmitting}>
              <option value="">Choisissez votre médecin</option>
              {doctors.map(doc => <option key={doc.id} value={doc.id}>Dr. {doc.user?.username || doc.user?.email}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date-input">Date et heure</label>
            <input 
              id="date-input" 
              type="datetime-local" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={minDate}
              disabled={isSubmitting} 
              required
            />
            <small className="date-hint">
              ⚠️ Les dates passées ne sont pas autorisées
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="motif-input">Motif de consultation</label>
            <input id="motif-input" type="text" value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Décrivez brièvement le motif" disabled={isSubmitting} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel} disabled={isSubmitting}>Annuler</button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Traitement en cours..." : "Confirmer le rendez-vous"}
          </button>
        </div>
      </form>
    </div>
  );
}