import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "./Rendez-VousList.css";

export default function RendezVousList() {
  const [rendezvous, setRendezvous] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingRendezVous, setEditingRendezVous] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    serviceId: "",
    preferredDoctorId: ""
  });
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Récupérer l'ID utilisateur depuis le token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id;
    } catch {
      return null;
    }
  };

  // SweetAlert configuration
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonColor: '#10B981',
      confirmButtonText: 'OK',
    });
  };

  const showErrorAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    position: 'center',
    confirmButtonColor: '#EF4444',
    confirmButtonText: 'OK',
    color: '#ffffff'
  });
};

const showConfirmDialog = (title, text, confirmButtonText = 'Supprimer') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    position: 'center',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Annuler',
  });
};


  useEffect(() => {
    const fetchRendezvous = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken();
        
        if (!userId) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/rendezvous/patient/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRendezvous(response.data);
        
      } catch (err) {
        console.error("❌ Erreur chargement RDV :", err);
        setError("Erreur lors du chargement des rendez-vous");
        showErrorAlert("Erreur", "Impossible de charger vos rendez-vous");
      } finally {
        setLoading(false);
      }
    };

    fetchRendezvous();
  }, []);

  // Charger les services et docteurs pour l'édition
  useEffect(() => {
    if (editingRendezVous) {
      loadServicesAndDoctors();
    }
  }, [editingRendezVous]);

  useEffect(() => {
    const fetchDoctorsForService = async () => {
      if (editForm.serviceId) {
        try {
          const token = localStorage.getItem("token");
          console.log("🔄 Chargement des docteurs pour le service:", editForm.serviceId);
          
          const response = await axios.get(
            `http://localhost:3000/services/${editForm.serviceId}/doctors`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          console.log("✅ Docteurs chargés:", response.data);
          setFilteredDoctors(response.data);
          
          // Vérifier si le docteur actuel est dans la nouvelle liste
          if (editForm.preferredDoctorId) {
            const currentDoctorInNewList = response.data.find(d => d.id === parseInt(editForm.preferredDoctorId));
            if (!currentDoctorInNewList) {
              console.log("🔄 Réinitialisation du docteur sélectionné");
              setEditForm(prev => ({ ...prev, preferredDoctorId: "" }));
            }
          }
        } catch (error) {
          console.error("❌ Erreur chargement docteurs:", error);
          setFilteredDoctors([]);
        }
      } else {
        setFilteredDoctors([]);
      }
    };

    fetchDoctorsForService();
  }, [editForm.serviceId]);

  const loadServicesAndDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const clinicId = localStorage.getItem("clinicId");
      console.log("🏥 Clinic ID:", clinicId);
      
      // 🔥 CORRECTION : Charger seulement les services d'abord
      const servicesRes = await axios.get(`http://localhost:3000/users/patient-services?clinicId=${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("📊 Services chargés:", servicesRes.data);

      setServices(servicesRes.data);

      if (editingRendezVous) {
        console.log("📝 Rendez-vous en édition:", editingRendezVous);
        
        const preferredDoctorId = editingRendezVous.preferredDoctor?.id || "";
        
        setEditForm({
          date: new Date(editingRendezVous.date).toISOString().slice(0, 16),
          serviceId: editingRendezVous.service?.id || "",
          preferredDoctorId: preferredDoctorId
        });

        // 🔥 Charger les docteurs pour le service initial
        if (editingRendezVous.service?.id) {
          try {
            const doctorsRes = await axios.get(
              `http://localhost:3000/services/${editingRendezVous.service.id}/doctors`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("👨‍⚕️ Docteurs chargés pour le service initial:", doctorsRes.data);
            setFilteredDoctors(doctorsRes.data);
          } catch (error) {
            console.error("❌ Erreur chargement docteurs initiaux:", error);
            setFilteredDoctors([]);
          }
        }
      }
    } catch (error) {
      console.error("Erreur chargement services:", error);
      showErrorAlert("Erreur", "Impossible de charger les données nécessaires");
    }
  };

  // === ANIMATIONS 3D ORIGINALES ===
  const handleMouseMove = (e, cardRef) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midCardWidth = rect.width / 2;
    const midCardHeight = rect.height / 2;
    const angleY = -(x - midCardWidth) / 8;
    const angleX = (y - midCardHeight) / 8;
    el.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (cardRef) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
  };

  // Fonction pour supprimer le rendez-vous
  const handleDeleteRendezVous = async (rdvId) => {
    const result = await showConfirmDialog(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ? Cette action est irréversible.",
      "Supprimer définitivement"
    );

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        
        await axios.delete(`http://localhost:3000/rendezvous/${rdvId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRendezvous(prevRendezvous => prevRendezvous.filter(rdv => rdv.id !== rdvId));
        setSelected(null);
        
        showSuccessAlert("Succès", "Le rendez-vous a été supprimé définitivement");
      } catch (error) {
        console.error("❌ Erreur suppression RDV:", error);
        showErrorAlert("Erreur", "Impossible de supprimer le rendez-vous");
      }
    }
  };

  // Fonction pour modifier un rendez-vous
  const handleEditRendezVous = async (e) => {
    e.preventDefault();
    
    if (!editingRendezVous) return;

    // Validation de la date
    const selectedDate = new Date(editForm.date);
    const now = new Date();
    
    if (selectedDate < now) {
      showErrorAlert("Date invalide", "Veuillez sélectionner une date et heure futures");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const updateData = {
        date: new Date(editForm.date).toISOString(),
        serviceId: parseInt(editForm.serviceId),
        preferredDoctorId: editForm.preferredDoctorId ? parseInt(editForm.preferredDoctorId) : null
      };

      await axios.patch(
        `http://localhost:3000/rendezvous/${editingRendezVous.id}/update`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = getUserIdFromToken();
      const res = await axios.get(`http://localhost:3000/rendezvous/patient/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRendezvous(res.data);
      setEditingRendezVous(null);
      setSelected(null);
      
      showSuccessAlert("Modification réussie", "Le rendez-vous a été modifié avec succès");
    } catch (error) {
      console.error("Erreur modification RDV:", error);
      
      let errorMessage = "Impossible de modifier le rendez-vous";
      if (error.response?.data?.message?.includes('date') || error.response?.data?.message?.includes('passé')) {
        errorMessage = "La date sélectionnée est dans le passé. Veuillez choisir une date future.";
      }
      
      showErrorAlert("Erreur", errorMessage);
    }
  };

  // Vérifier si le rendez-vous peut être modifié
  const canEditRendezVous = (rdv) => {
    const editableStatuses = ['pending', 'en attente', 'pending_confirmation'];
    return editableStatuses.includes(rdv.status?.toLowerCase());
  };

  // Fonction pour obtenir le statut affiché
  const getDisplayStatus = (status) => {
    const statusMap = {
      'pending': 'EN ATTENTE',
      'confirmed': 'CONFIRMÉ',
      'cancelled': 'ANNULÉ',
      'completed': 'TERMINÉ'
    };
    return statusMap[status] || status;
  };

  // Fonction pour obtenir la classe CSS du statut
  const getStatusClass = (status) => {
    const statusClassMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'cancelled': 'cancelled',
      'completed': 'completed'
    };
    return statusClassMap[status] || 'pending';
  };

  if (loading) {
    return (
      <div className="rv-section">
        <div className="rv-header">
          <h2>Mes Rendez-vous</h2>
          <div className="rv-loading">
            <div className="rv-loading-spinner"></div>
            <p>Chargement de vos rendez-vous...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rv-section">
        <div className="rv-header">
          <h2>Mes Rendez-vous</h2>
          <div className="rv-error-state">
            <div className="rv-error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rv-section">
      <div className="rv-header">
        <div className="rv-header-content">
          <h2>Mes Rendez-vous</h2>
          <p className="rv-sub">Gérez et suivez vos rendez-vous médicaux</p>
        </div>
        {rendezvous.length > 0 && (
          <div className="rv-stats">
            <span className="rv-stat-item">
              <strong>{rendezvous.length}</strong> RDV au total
            </span>
            <span className="rv-stat-item">
              <strong>{rendezvous.filter(r => r.status === 'confirmed').length}</strong> Confirmés
            </span>
          </div>
        )}
      </div>

      {rendezvous.length === 0 ? (
        <div className="rv-empty-state">
          <div className="rv-empty-icon">📅</div>
          <h3>Aucun rendez-vous programmé</h3>
          <p>Vous n'avez pas encore de rendez-vous programmé.</p>
        </div>
      ) : (
        <>
          {/* GRID AMÉLIORÉ DES CARTES */}
          <div className="rv-grid" ref={containerRef}>
            {rendezvous.map((r) => {
              const cardRef = React.createRef();
              const date = new Date(r.date);
              const isEditable = canEditRendezVous(r) && !r.doctor?.id;

              return (
                <div
                  key={r.id}
                  className={`rv-card ${r.status === "cancelled" ? "rv-cancel" : ""} ${isEditable ? "rv-editable" : ""}`}
                  onMouseMove={(e) => handleMouseMove(e, cardRef)}
                  onMouseLeave={() => handleMouseLeave(cardRef)}
                  onClick={() => setSelected(r)}
                >
                  <div className="rv-card-inner" ref={cardRef}>
                    <div className="rv-card-top">
                      <div className="rv-date">
                        <div className="rv-day">
                          {date.toLocaleDateString("fr-FR", { day: "2-digit" })}
                        </div>
                        <div className="rv-month">
                          {date.toLocaleDateString("fr-FR", { month: "short" })}
                        </div>
                        <div className="rv-year">
                          {date.toLocaleDateString("fr-FR", { year: "numeric" })}
                        </div>
                      </div>

                      <div className="rv-meta">
                        <div className="rv-clinic">{r.clinic?.name || "—"}</div>
                        <div className="rv-service">{r.service?.name || "—"}</div>
                      </div>
                    </div>

                    <div className="rv-body">
                      <h3 className="rv-doctor">
                        {r.doctor?.user?.username || r.preferredDoctor?.user?.username || "Docteur non assigné"}
                      </h3>
                      <div className="rv-time-display">
                        <span className="rv-time-icon">🕒</span>
                        {date.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="rv-footer">
                      <span
                        className={`rv-status rv-${getStatusClass(r.status)}`}
                      >
                        {getDisplayStatus(r.status)}
                      </span>
                      {isEditable && (
                        <span className="rv-edit-badge">Modifiable</span>
                      )}
                    </div>
                  </div>

                  <div className="rv-shadow rv-shadow-1" />
                  <div className="rv-shadow rv-shadow-2" />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal de détails AMÉLIORÉ */}
      {selected && (
        <div className="rv-modal" onClick={() => setSelected(null)}>
          <div className="rv-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <h3>Détails du Rendez-vous</h3>
              <button className="rv-modal-close" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>
            
            <div className="rv-modal-body">
              <div className="rv-detail-grid">
                <div className="rv-detail-item">
                  <span className="rv-detail-label">📅 Date et heure</span>
                  <span className="rv-detail-value">
                    {new Date(selected.date).toLocaleString("fr-FR", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="rv-detail-item">
                  <span className="rv-detail-label">🏥 Clinique</span>
                  <span className="rv-detail-value">{selected.clinic?.name || "—"}</span>
                </div>
                
                <div className="rv-detail-item">
                  <span className="rv-detail-label">🎯 Service</span>
                  <span className="rv-detail-value">{selected.service?.name || "—"}</span>
                </div>
                
                <div className="rv-detail-item">
                  <span className="rv-detail-label">👨‍⚕️ Docteur</span>
                  <span className="rv-detail-value">
                    {selected.doctor?.user?.username || selected.preferredDoctor?.user?.username || "Non assigné"}
                  </span>
                </div>
                
                <div className="rv-detail-item">
                  <span className="rv-detail-label">📊 Statut</span>
                  <span className={`rv-detail-status rv-${getStatusClass(selected.status)}`}>
                    {getDisplayStatus(selected.status)}
                  </span>
                </div>
              </div>

              {/* Message si modification impossible à cause du docteur assigné */}
              {selected.doctor && selected.doctor.id && (
                <div className="rv-warning-message">
                  <div className="rv-warning-icon">⚠️</div>
                  <div className="rv-warning-content">
                    <strong>Modification impossible</strong>
                    <p>Un docteur a déjà été assigné à ce rendez-vous. Contactez la clinique pour toute modification.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rv-modal-actions">
              {/* Bouton Modifier - seulement si statut le permet ET aucun docteur assigné */}
              {canEditRendezVous(selected) && !selected.doctor?.id && (
                <button 
                  className="rv-btn rv-btn-primary" 
                  onClick={() => setEditingRendezVous(selected)}
                >
               
                  Modifier le RDV
                </button>
              )}
              
              {/* BOUTON SUPPRIMER (DELETE) */}
              <button 
                className="rv-btn rv-btn-danger" 
                onClick={() => handleDeleteRendezVous(selected.id)}
              >
              
                Supprimer
              </button>
              
              <button className="rv-btn rv-btn-secondary" onClick={() => setSelected(null)}>
                Fermer
              </button>
            </div>

            {/* Informations sur les actions disponibles */}
            <div className="rv-actions-info">
              <h4>Informations importantes</h4>
              <ul>
                <li><strong>Modification :</strong> Possible seulement pour les rendez-vous en attente <strong>SANS docteur assigné</strong></li>
                <li><strong>Suppression :</strong> Suppression définitive du rendez-vous</li>
                <li><strong>Contact :</strong> Pour toute question, contactez directement la clinique</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition AMÉLIORÉ */}
      {editingRendezVous && (
        <div className="rv-modal" onClick={() => setEditingRendezVous(null)}>
          <div className="rv-modal-content rv-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <h3>Modifier le Rendez-vous</h3>
              <button className="rv-modal-close" onClick={() => setEditingRendezVous(null)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditRendezVous}>
              <div className="rv-modal-body">
                <div className="rv-form-grid">
                  <div className="rv-form-group">
                    <label className="rv-form-label">
                      <span className="rv-label-icon">📅</span>
                      Date et heure
                    </label>
                    <input
                      type="datetime-local"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      min={new Date().toISOString().slice(0, 16)}
                      className="rv-form-input"
                      required
                    />
                    <div className="rv-form-hint">
                      ⚠️ Les dates passées ne sont pas autorisées
                    </div>
                  </div>

                  <div className="rv-form-group">
                    <label className="rv-form-label">
                      <span className="rv-label-icon">🎯</span>
                      Service
                    </label>
                    <select
                      value={editForm.serviceId}
                      onChange={(e) => setEditForm({...editForm, serviceId: e.target.value})}
                      className="rv-form-select"
                      required
                    >
                      <option value="">Sélectionnez un service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rv-form-group">
                    <label className="rv-form-label">
                      <span className="rv-label-icon">👨‍⚕️</span>
                      Docteur préféré (optionnel)
                    </label>
                    <select
                      value={editForm.preferredDoctorId}
                      onChange={(e) => setEditForm({...editForm, preferredDoctorId: e.target.value})}
                      className="rv-form-select"
                      disabled={!editForm.serviceId}
                    >
                      <option value="">
                        {editForm.serviceId ? "Sélectionnez un docteur" : "Choisissez d'abord un service"}
                      </option>
                      
                      {/* Afficher le docteur actuel même s'il n'est plus dans la liste filtrée */}
                      {editingRendezVous.preferredDoctor && !filteredDoctors.find(d => d.id === editingRendezVous.preferredDoctor.id) && (
                        <option 
                          key={editingRendezVous.preferredDoctor.id} 
                          value={editingRendezVous.preferredDoctor.id}
                          className="rv-current-doctor"
                        >
                          Dr. {editingRendezVous.preferredDoctor.user?.username || editingRendezVous.preferredDoctor.user?.email} (actuel)
                        </option>
                      )}
                      
                      {filteredDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.user?.username || doctor.user?.email} {doctor.specialty ? `- ${doctor.specialty}` : ''}
                        </option>
                      ))}
                      
                      {editForm.serviceId && filteredDoctors.length === 0 && (
                        <option value="" disabled>
                          Aucun docteur disponible pour ce service
                        </option>
                      )}
                    </select>
                    <div className="rv-form-hint">
                      {editForm.serviceId && `📋 ${filteredDoctors.length} docteur(s) disponible(s) pour ce service`}
                      {editingRendezVous.preferredDoctor && ` • Docteur actuel: Dr. ${editingRendezVous.preferredDoctor.user?.username || editingRendezVous.preferredDoctor.user?.email}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rv-modal-actions">
                <button type="submit" className="rv-btn rv-btn-primary rv-btn-save">
                  <span className="rv-btn-icon">💾</span>
                  Enregistrer les modifications
                </button>
                <button 
                  type="button" 
                  className="rv-btn rv-btn-secondary" 
                  onClick={() => setEditingRendezVous(null)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}