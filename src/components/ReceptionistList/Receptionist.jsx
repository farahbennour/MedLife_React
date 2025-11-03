import React, { useEffect, useState } from "react"; // Import des hooks React
import { useNavigate } from "react-router-dom"; // Import pour la navigation programmatique
import axios from "axios"; // Pour les requêtes HTTP
import Swal from "sweetalert2"; // Pour les alertes et notifications
// import receptionlist from "/src/assets/receptionlist.png"; // Image optionnelle pour les réceptionnistes
import "./Receptionist.css"; // Styles CSS spécifiques à ce composant

export default function Receptionist() {
  const navigate = useNavigate(); // Hook pour naviguer vers d'autres routes

  // ------------------- Etats principaux -------------------
  const [receptionists, setReceptionists] = useState([]); // Liste des réceptionnistes
  const [clinics, setClinics] = useState([]); // Liste des cliniques
  const [services, setServices] = useState([]); // Liste des services selon la clinique sélectionnée
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [search, setSearch] = useState(""); // Texte de recherche
  const [showModal, setShowModal] = useState(false); // Affichage du modal
  const [selectedClinic, setSelectedClinic] = useState(""); // Clinique sélectionnée dans le formulaire
  const [editReceptionistId, setEditReceptionistId] = useState(null); // ID du réceptionniste en édition

  // Données du formulaire pour ajouter/modifier un réceptionniste
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    clinic_id: "",
    service_id: "",
    phone: "",
  });

  // ------------------- Charger les réceptionnistes depuis le backend -------------------
  const fetchReceptionists = async () => {
    try {
      const token = localStorage.getItem("token"); // Récupère le token d'authentification
      if (!token) {
        alert("Token non trouvé. Veuillez vous reconnecter.");
        navigate("/login"); // Redirige vers la page de login
        return;
      }

      const res = await axios.get("http://localhost:3000/users/receptionists/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceptionists(res.data); // Stocke les réceptionnistes
    } catch (error) {
      console.error("Erreur lors du chargement des réceptionnistes :", error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Appel initial pour charger les réceptionnistes
  useEffect(() => {
    fetchReceptionists();
  }, [navigate]);

  // ------------------- Charger les cliniques -------------------
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des cliniques :", error);
      }
    };

    fetchClinics();
  }, []);

  // ------------------- Filtrage dynamique -------------------
  const filteredReceptionists = receptionists.filter(
    (r) =>
      r.username?.toLowerCase().includes(search.toLowerCase()) || // Filtre par nom
      r.email?.toLowerCase().includes(search.toLowerCase()) || // Filtre par email
      r.receptionist?.clinic?.name?.toLowerCase().includes(search.toLowerCase()) || // Filtre par clinique
      r.receptionist?.service?.name?.toLowerCase().includes(search.toLowerCase()) // Filtre par service
  );

  // ------------------- Gestion du formulaire -------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Met à jour le formulaire à chaque modification
  };

  // Gestion du changement de clinique dans le formulaire
  const handleClinicChange = async (e) => {
    const clinicId = e.target.value;
    setSelectedClinic(clinicId);
    setFormData({ ...formData, clinic_id: clinicId, service_id: "" }); // Reset du service si la clinique change

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/clinics/${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services || []); // Charge les services de la clinique
    } catch (error) {
      console.error("Erreur chargement services:", error);
      setServices([]);
    }
  };

  // ------------------- Ajouter / Modifier un réceptionniste -------------------
  const handleSaveReceptionist = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        clinic_id: Number(formData.clinic_id),
        service_id: Number(formData.service_id),
      };

      if (editReceptionistId) {
        // Modification
        await axios.patch(`http://localhost:3000/users/${editReceptionistId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "✅ Succès",
          text: "Réceptionniste modifié avec succès !",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Ajout
        await axios.post("http://localhost:3000/users/create-account", { ...payload, role: "receptionist" }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "✅ Succès",
          text: "Réceptionniste ajouté avec succès !",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Reset formulaire et modal
      setShowModal(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        clinic_id: "",
        service_id: "",
        phone: "",
      });
      setServices([]);
      setEditReceptionistId(null);
      fetchReceptionists(); // Recharge la liste
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Erreur inconnue",
      });
    }
  };

  // ------------------- Modifier un réceptionniste -------------------
  const handleEditReceptionist = async (r) => {
    setEditReceptionistId(r.id);

    const clinicId = r.receptionist?.clinic?.id || r.clinic?.id || "";
    const serviceId = r.receptionist?.service?.id || r.service?.id || "";

    setFormData({
      username: r.username || "",
      email: r.email || "",
      password: "",
      clinic_id: clinicId,
      service_id: serviceId,
      phone: r.phone || "",
    });

    if (clinicId) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/clinics/${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data.services || []);

        // Assure que le service existant reste sélectionné
        if (res.data.services?.some(s => s.id === serviceId)) {
          setFormData(prev => ({ ...prev, service_id: serviceId }));
        } else {
          setFormData(prev => ({ ...prev, service_id: "" }));
        }
      } catch (error) {
        console.error("Erreur chargement services:", error);
        setServices([]);
      }
    } else {
      setServices([]);
    }

    setShowModal(true); // Affiche le modal
  };

  // ------------------- Supprimer un réceptionniste -------------------
  const handleDeleteReceptionist = async (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action va supprimer le réceptionniste définitivement !",
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
          await axios.delete(`http://localhost:3000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire("Supprimé !", "Le réceptionniste a été supprimé avec succès.", "success");
          fetchReceptionists();
        } catch (error) {
          console.error(error);
          Swal.fire("Erreur !", error.response?.data?.message || "Erreur inconnue", "error");
        }
      }
    });
  };

  if (loading) return <p>Chargement des réceptionnistes...</p>; // Affiche un loader si nécessaire

  // ------------------- Rendu JSX -------------------
  return (
    <div className="main-content">
      {/* Banner */}
      <div className="banner">
        <div className="banner-text">
          <h2>
            Bienvenue ! <span>Liste des Réceptionnistes</span>
          </h2>
          <p>Gérez les réceptionnistes de vos cliniques.</p>
        </div>
        <div className="banner-image">
          {/* Image optionnelle */}
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <input type="text" placeholder="Rechercher un docteur..." value={search} onChange={e => setSearch(e.target.value)} />
        <button>🔍</button>
      </div>

      {/* Liste des réceptionnistes */}
      <div className="staff-section">
        <h3 className="section-title">RÉCEPTIONNISTES ({filteredReceptionists.length})</h3>
        <div className="staff-grid">
          {filteredReceptionists.map((r) => (
            <div className="staff-card" key={r.id}>
              <h4>{r.username}</h4>
              <p className="role">{r.role}</p>
              <p className="desc">{r.email}</p>
              <p className="desc">Téléphone: {r.phone || "—"}</p>
              <p className="desc">Clinique: {r.receptionist?.clinic?.name || "—"}</p>
              <p className="desc">Service: {r.receptionist?.service?.name || "—"}</p>
              <p className="desc">État: {r.etat ? "✅ Actif" : "❌ Inactif"}</p>
              <div className="doctorlist-modal-actions">
                <button className="edit-btn-doctor" onClick={() => handleEditReceptionist(r)}> Modifier</button>
                <button className="delete-btn" onClick={() => handleDeleteReceptionist(r.id)}>Supprimer</button>
              </div>
            </div>
          ))}

          {/* Carte ajout */}
          <div className="staff-card add-card" onClick={() => setShowModal(true)}>
            <div className="add-content">
              <div className="add-icon">+</div>
              <h4>Ajouter</h4>
              <p>Ajouter un nouveau réceptionniste.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal ajout/modification */}
      {showModal && (
        <div className="patient-modal-overlay">
          <div className="patient-modal">
            <h3>{editReceptionistId ? " Modifier un Réceptionniste" : " Ajouter un Réceptionniste"}</h3>
            <form onSubmit={handleSaveReceptionist}>
              <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder={editReceptionistId ? "Laissez vide pour ne pas changer" : "Mot de passe"} value={formData.password} onChange={handleChange} required={!editReceptionistId} />
              <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} />

              {/* Sélection clinique */}
              <select name="clinic_id" value={formData.clinic_id} onChange={handleClinicChange} required>
                <option value="">-- Choisir une clinique --</option>
                {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              {/* Sélection service */}
              <select name="service_id" value={formData.service_id} onChange={handleChange} required disabled={!services.length}>
                <option value="">-- Choisir un service --</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <div className="doctorlist-modal-actions">
                <button type="submit" className="btn-doctor-save">{editReceptionistId ? "Enregistrer" : "Ajouter"}</button>
                <button type="button" className="btn-doctor-cancel" onClick={() => {
                  setShowModal(false);
                  setFormData({ username: "", email: "", password: "", clinic_id: "", service_id: "", phone: "" });
                  setServices([]);
                  setEditReceptionistId(null);
                }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
