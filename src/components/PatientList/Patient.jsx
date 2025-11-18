import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook pour la navigation
import axios from "axios"; // Pour les requêtes HTTP
import Swal from "sweetalert2"; // Pour les alertes modales
import "./Patient.css"; // Styles spécifiques à ce composant

export default function Patient() {
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
  }, [navigate]);

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

  // ------------------- Gestion formulaire -------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Mise à jour dynamique
  };

  // ------------------- Ajouter / Modifier un patient -------------------
  const handleSavePatient = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        clinic_id: Number(formData.clinic_id),
        address: formData.address,
        dateNaissance: formData.dateNaissance || null,
      };

      // Envoi de la requête POST vers le backend
      const response = await axios.post("http://localhost:3000/users/patient/register", payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "✅ Succès",
        text: "Patient ajouté avec succès !",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset formulaire et modal
      setShowModal(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        clinic_id: "",
        phone: "",
        address: "",
        dateNaissance: "",
      });
      fetchPatients(); // Rechargement de la liste
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || error.message || "Erreur inconnue",
      });
    }
  };

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

  // ------------------- JSX -------------------
  return (
    <div className="patient-main">
      {/* Banner */}
      <div className="patient-banner">
        <div className="patient-banner-text">
          <h2>Liste des Patients</h2>
          <p>Gérez les patients de vos cliniques.</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="patient-search">
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
      </div>

      {/* Liste des patients */}
      <div className="patient-section">
        <div className="patient-grid">
          {filteredPatients.map((p) => (
            <div className="patient-card" key={p.id}>
               <h4>{p.username}</h4>
                <p className="patient-attribute">
                  <span className="title">Email:</span> <span className="value">{p.email}</span>
                </p>
                <p className="patient-attribute">
                  <span className="title">Téléphone:</span> <span className="value">{p.phone || "—"}</span>
                </p>
                <p className="patient-attribute">
                  <span className="title">Adresse:</span> <span className="value">{p.address || "—"}</span>
                </p>
                <p className="patient-attribute">
                  <span className="title">Date de naissance:</span> <span className="value">{p.dateNaissance ? new Date(p.dateNaissance).toLocaleDateString() : "—"}</span>
                </p>
                <p className="patient-attribute">
                  <span className="title">Clinique:</span> <span className="value">{p.clinic || "—"}</span>
                </p>
              {/* Bouton supprimer pour admin */}
              <div className="patient-modal-actions">
                {role === "admin" && (
                  <button className="btn-cancel" onClick={() => handleDeletePatient(p.id)}>Supprimer</button>
                )}
              </div>
            </div>
          ))}

          {/* Ajouter un patient pour réceptionniste */}
          {role === "receptionist" && (
            <div className="patient-add-card" onClick={() => setShowModal(true)}>
              <div className="add-content">
                <div className="add-icon">+</div>
                <h4>Ajouter</h4>
                <p>Ajouter un nouveau patient à votre clinique.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal ajout/modification */}
      {showModal && (
        <div className="patient-modal-overlay">
          <div className="patient-modal">
            <h3>{editPatientId ? "✏️ Modifier un Patient" : "➕ Ajouter un Patient"}</h3>
            <form onSubmit={handleSavePatient}>
              <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder={editPatientId ? "Laissez vide pour ne pas changer" : "Mot de passe"} value={formData.password} onChange={handleChange} required={!editPatientId} />
              <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} />
              <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} />
              <input type="date" name="dateNaissance" placeholder="Date de naissance" value={formData.dateNaissance} onChange={handleChange} />

              <select name="clinic_id" value={formData.clinic_id} onChange={handleChange} required>
                <option value="">-- Choisir une clinique --</option>
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="patient-modal-actions">
                <button type="submit" className="btn-save">{editPatientId ? "Enregistrer" : "Ajouter"}</button>
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowModal(false);
                  setFormData({ username:"", email:"", password:"", clinic_id:"", phone:"", address:"", dateNaissance:"" });
                  setEditPatientId(null);
                }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
