import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import doctorlistImg from "/src/assets/doctorlist.png";
import "./Doctor.css";

export default function Doctor() {
  // ---------------------------
  // Hooks et states
  // ---------------------------
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]); // Liste des docteurs
  const [clinics, setClinics] = useState([]); // Liste des cliniques
  const [services, setServices] = useState([]); // Liste des services pour la clinique sélectionnée
  const [loading, setLoading] = useState(true); // Loader pour le fetch initial
  const [search, setSearch] = useState(""); // Texte de recherche
  const [showModal, setShowModal] = useState(false); // Affichage du modal d'ajout / modification
  const [selectedClinic, setSelectedClinic] = useState(""); // Clinique sélectionnée pour filtrer les services
  const [editDoctorId, setEditDoctorId] = useState(null); // ID du docteur en modification

  // Formulaire
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    clinic_id: "",
    service_id: "",
    phone: "",
    specialty: "",
  });

  // ---------------------------
  // Récupération des docteurs depuis l'API
  // ---------------------------
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login"); // Redirection si non authentifié
      const res = await axios.get("http://localhost:3000/users/doctors/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data); // On stocke les docteurs récupérés
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [navigate]); // Fetch initial à l'ouverture du composant

  // ---------------------------
  // Récupération des cliniques depuis l'API
  // ---------------------------
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClinics();
  }, []);

  // ---------------------------
  // Filtrage des docteurs selon la recherche
  // ---------------------------
  const filteredDoctors = doctors.filter(
    doc =>
      doc.username?.toLowerCase().includes(search.toLowerCase()) ||
      doc.email?.toLowerCase().includes(search.toLowerCase()) ||
      doc.doctor?.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      doc.doctor?.clinic?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.doctor?.service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------------------
  // Mise à jour du formulaire à la saisie
  // ---------------------------
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ---------------------------
  // Gestion du changement de clinique (update services)
  // ---------------------------
  const handleClinicChange = async e => {
    const clinicId = e.target.value;
    setSelectedClinic(clinicId);
    setFormData({ ...formData, clinic_id: clinicId, service_id: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/clinics/${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services || []);
    } catch {
      setServices([]);
    }
  };

  // ---------------------------
  // Ajout ou modification d'un docteur
  // ---------------------------
  const handleSaveDoctor = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        specialty: formData.specialty,
        clinic_id: Number(formData.clinic_id),
        service_id: Number(formData.service_id),
      };
      if (editDoctorId) {
        // Modification
        await axios.patch(`http://localhost:3000/users/${editDoctorId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: "success", title: "✅ Succès !", text: "Docteur modifié avec succès !", timer: 2000, showConfirmButton: false });
      } else {
        // Ajout
        await axios.post("http://localhost:3000/users/create-account", { ...payload, role: "doctor" }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: "success", title: "✅ Succès", text: "Docteur ajouté avec succès !", timer: 2000, showConfirmButton: false });
      }
      setShowModal(false);
      setFormData({ username: "", email: "", password: "", clinic_id: "", service_id: "", phone: "", specialty: "" });
      setServices([]);
      setEditDoctorId(null);
      fetchDoctors();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Erreur", text: error.response?.data?.message || "Erreur inconnue" });
    }
  };

  // ---------------------------
  // Préparer le formulaire pour modification
  // ---------------------------
 const handleEditDoctor = (doc) => {
  setEditDoctorId(doc.id);
  
  // 1️⃣ mettre la clinique
  const clinicId = doc.doctor?.clinic?.id || doc.clinic?.id || "";
  handleClinicChange({ target: { value: clinicId } });

  // 2️⃣ mettre ensuite le reste des champs, y compris service_id
  setFormData({
    username: doc.username || "",
    email: doc.email || "",
    password: "",
    clinic_id: clinicId,
    service_id: doc.doctor?.service?.id || doc.service?.id || "",
    phone: doc.doctor?.phone || doc.phone || "",
    specialty: doc.doctor?.specialty || doc.specialty || "",
  });

  setShowModal(true);
};


  // ---------------------------
  // Suppression d'un docteur
  // ---------------------------
  const handleDeleteDoctor = async id => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action va supprimer le docteur définitivement !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6684a3",
      cancelButtonColor: "#0ea5e9",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:3000/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          Swal.fire("Supprimé !", "Le docteur a été supprimé avec succès.", "success");
          fetchDoctors();
        } catch (error) {
          Swal.fire("Erreur !", error.response?.data?.message || "Erreur inconnue", "error");
        }
      }
    });
  };

  if (loading) return <p>Chargement des docteurs...</p>;

  return (
    <div className="doctorlist-main">

      {/* ---------------------------
          Banner / En-tête de la page
      --------------------------- */}
      <div className="doctorlist-banner">
        <div className="doctorlist-banner-text">
          <h2>Bienvenue ! <span>Liste des Docteurs</span></h2>
          <p>Consultez et gérez les docteurs disponibles.</p>
        </div>
        <div className="doctorlist-banner-image">
          {/* <img src={doctorlistImg} alt="Doctor List" /> */}
        </div>
      </div>

      {/* ---------------------------
          Recherche de docteurs
      --------------------------- */}
      <div className="doctorlist-search">
        <input type="text" placeholder="Rechercher un docteur..." value={search} onChange={e => setSearch(e.target.value)} />
        <button>🔍</button>
      </div>

      {/* ---------------------------
          Liste des cartes docteurs
      --------------------------- */}
      <div className="doctorlist-grid">
        {filteredDoctors.map(doc => (
          <div className="doctorlist-card" key={doc.id}>
            <img src={doc.image || doctorlistImg} alt={doc.username} />
            <h4>{doc.username}</h4>
            <p className="doctorlist-role">{doc.email}</p>

            <div className="doctorlist-attributes">
              <div className="doctorlist-attribute">
                <span className="title">Téléphone:</span>
                <span className="value">{doc.phone || "—"}</span>
              </div>
              <div className="doctorlist-attribute">
                <span className="title">Spécialité:</span>
                <span className="value">{doc.doctor?.specialty || "—"}</span>
              </div>
              <div className="doctorlist-attribute">
                <span className="title">Clinique:</span>
                <span className="value">{doc.doctor?.clinic?.name || "—"}</span>
              </div>
              <div className="doctorlist-attribute">
                <span className="title">Service:</span>
                <span className="value">{doc.doctor?.service?.name || "—"}</span>
              </div>
              <div className="doctorlist-attribute">
                <span className="title">État:</span>
                <span className="value">{doc.etat ? "✅ Actif" : "❌ Inactif"}</span>
              </div>
            </div>

            {/* Actions : Modifier / Supprimer */}
            <div className="doctorlist-actions">
              <button className="edit-btn-doctor" onClick={() => handleEditDoctor(doc)}>Modifier</button>
              <button className="delete-btn-doctor" onClick={() => handleDeleteDoctor(doc.id)}>Supprimer</button>
            </div>
          </div>
        ))}

        {/* ---------------------------
            Carte pour ajouter un nouveau docteur
        --------------------------- */}
        <div className="doctorlist-add-card" onClick={() => setShowModal(true)}>
          <div className="add-icon">+</div>
          <h4>Ajouter</h4>
          <p>Ajouter un nouveau docteur à votre clinique.</p>
        </div>
      </div>

      {/* ---------------------------
          Modal ajout / modification docteur
      --------------------------- */}
      {showModal && (
        <div className="doctorlist-modal-overlay">
          <div className="doctorlist-modal">
            <h3>{editDoctorId ? " Modifier un Docteur" : "Ajouter un Docteur"}</h3>
            <form onSubmit={handleSaveDoctor}>
              <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            {!editDoctorId && (
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}
              <input type="text" name="specialty" placeholder="Spécialité" value={formData.specialty} onChange={handleChange} />

              <select name="clinic_id" value={formData.clinic_id} onChange={handleClinicChange} required>
                <option value="">-- Choisir une clinique --</option>
                {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select name="service_id" value={formData.service_id} onChange={handleChange} required disabled={!services.length}>
                <option value="">-- Choisir un service --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <div className="doctorlist-modal-actions">
                <button type="submit" className="btn-doctor-save">{editDoctorId ? "Enregistrer" : "Ajouter"}</button>
                <button type="button" className="btn-doctor-cancel" onClick={() => {
                  setShowModal(false);
                  setFormData({ username: "", email: "", password: "", clinic_id: "", service_id: "", phone: "", specialty: "" });
                  setServices([]);
                  setEditDoctorId(null);
                }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
