
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Cliniques.css";
import { useNavigate } from "react-router-dom";
import { FaHospital, FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

export default function Cliniques() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Erreur", "Vous devez être connecté !", "warning");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(response.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les cliniques.");
        if (err.response && err.response.status === 401) {
          Swal.fire("Erreur", "Session expirée. Veuillez vous reconnecter.", "error");
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [navigate]);

  // --------------------------- Suppression ---------------------------
 const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action supprimera définitivement la clinique !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6684a3",
    cancelButtonColor: "#0ea5e9",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/clinics/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClinics(clinics.filter((c) => c.id !== id));
      Swal.fire({
        icon: "success",
        title: "Supprimé !",
        text: "La clinique a été supprimée.",
        timer: 1900,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      // Si le backend renvoie un message spécifique
      const message =
        err.response?.data?.message ||
        "Impossible de supprimer cette clinique, elle contient du personnel ou des services.";
     Swal.fire({
  title: "Clinique non vide",
  text: "Impossible de supprimer : cette clinique contient encore du staff et des services.",
  icon: "warning",
  confirmButtonColor: "#6684a3",
  confirmButtonText: "OK",
});

    }
  }
};

  // --------------------------- Édition ---------------------------
  const handleEdit = (clinic) => {
    setSelectedClinic(clinic);
    setFormData({ name: clinic.name, address: clinic.address, phone: clinic.phone });
    setShowEditDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/clinics/${selectedClinic.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClinics(
        clinics.map((c) =>
          c.id === selectedClinic.id ? { ...c, ...formData } : c
        )
      );
      setShowEditDialog(false);
      Swal.fire({
        icon: "success",
        title: "Modifié",
        text: "La clinique a été modifiée avec succès ✅",
        timer: 1900,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Erreur lors de la mise à jour.", "error");
    }
  };

  // --------------------------- Ajout ---------------------------
  const handleAdd = async (e) => {
    e.preventDefault();
    const exists = clinics.some(
      (clinic) => clinic.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (exists) {
      Swal.fire("Erreur", "Une clinique avec ce nom existe déjà ❌", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/clinics", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClinics([...clinics, res.data]);
      setShowAddDialog(false);
      setFormData({ name: "", address: "", phone: "" });
      Swal.fire({
        icon: "success",
        title: "Ajouté !",
        text: "La clinique a été ajoutée avec succès ✅",
        timer: 1900,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Échec de l’ajout de la clinique !", "error");
    }
  };

  // --------------------------- Filtrage par recherche ---------------------------
  const filteredClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Chargement des cliniques...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="clinique-container">
      {/* Banner */}
      <div className="clinique-banner">
        <div className="clinique-banner-text">
          <h2>Bienvenue ! <span>Liste des cliniques</span></h2>
          <p>Consultez et gérez les cliniques disponibles.</p>
        </div>
        <div className="clinique-banner-action">
          <button
            className="clinique-btn-add"
            onClick={() => setShowAddDialog(true)}
          >
            Ajouter Clinique
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="clinique-search-bar">
        <input
          type="text"
          placeholder="Rechercher un clinique..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
          <button>🔍</button>
      </div>

      {/* Liste des cliniques */}
       <div className="doctor-container-3d">
      <div className="clinique-grid">
        {filteredClinics.map((clinic) => (
          <div key={clinic.id} className="clinique-card">
            <div className="clinique-actions">
              <FaEdit
                className="clinique-icon-btn edit"
                title="Modifier"
                onClick={() => handleEdit(clinic)}
              />
              <FaTrashAlt
                className="clinique-icon-btn delete"
                title="Supprimer"
                onClick={() => handleDelete(clinic.id)}
              />
            </div>

            <div className="clinique-icon" style={{ backgroundColor: "#0ea5e920", color: "#0ea5e9" }}>
              <FaHospital />
            </div>

            <h3>{clinic.name}</h3>
            <p>{clinic.address}</p>
            {clinic.phone && <p>{clinic.phone}</p>}
            <div
              className="clinique-arrow"
              onClick={() => {
                localStorage.setItem("clinic_id", clinic.id);
                navigate("/admin/cliniques/services", { state: { clinic_id: clinic.id } });
              }}
              title="Voir les services de cette clinique"
            >
              →
            </div>
          </div>
        ))}
      </div>
      </div>
      {/* Dialogues */}
      {showAddDialog && (
        <div className="clinique-dialog">
          <div className="clinique-dialog-content">
            <h3>Ajouter une clinique</h3>
            <form onSubmit={handleAdd}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom"
                required
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse"
                required
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Téléphone"
              />
              <div className="clinique-dialog-buttons">
                <button type="submit" className="clinique-btn-save">Ajouter</button>
                <button type="button" className="clinique-btn-cancel" onClick={() => setShowAddDialog(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditDialog && (
        <div className="clinique-dialog">
          <div className="clinique-dialog-content">
            <h3>Modifier la clinique</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom"
                required
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse"
                required
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Téléphone"
              />
              <div className="clinique-dialog-buttons">
                <button type="submit" className="clinique-btn-save">Enregistrer</button>
                <button type="button" className="clinique-btn-cancel" onClick={() => setShowEditDialog(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
