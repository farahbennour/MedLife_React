import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Cliniques.css";
import { useNavigate } from "react-router-dom";
import { FaHospital, FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

export default function Cliniques() {
  // ---------------------------
  // États locaux
  // ---------------------------
  const [clinics, setClinics] = useState([]); // Liste des cliniques
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(""); // Message d'erreur
  const [selectedClinic, setSelectedClinic] = useState(null); // Clinique sélectionnée pour édition
  const [showEditDialog, setShowEditDialog] = useState(false); // Affichage du dialog d'édition
  const [showAddDialog, setShowAddDialog] = useState(false); // Affichage du dialog d'ajout
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" }); // Données du formulaire
  const navigate = useNavigate(); // Navigation entre pages

  // ---------------------------
  // Chargement des cliniques au montage du composant
  // ---------------------------
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire("Erreur", "Vous devez être connecté !", "warning");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get("http://localhost:3000/clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(response.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les cliniques.");
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // ---------------------------
  // Suppression d'une clinique
  // ---------------------------
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
        Swal.fire("Supprimé !", "La clinique a été supprimée.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Erreur lors de la suppression.", "error");
      }
    }
  };

  // ---------------------------
  // Édition d'une clinique
  // ---------------------------
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
      Swal.fire("Modifié !", "La clinique a été mise à jour.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Erreur lors de la mise à jour.", "error");
    }
  };

  // ---------------------------
  // Ajout d'une nouvelle clinique
  // ---------------------------
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/clinics", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClinics([...clinics, res.data]);
      setShowAddDialog(false);
      setFormData({ name: "", address: "", phone: "" });
      Swal.fire("Ajouté !", "La clinique a été ajoutée.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Échec de l’ajout de la clinique !", "error");
    }
  };

  // ---------------------------
  // Gestion des états de chargement et d'erreur
  // ---------------------------
  if (loading) return <p>Chargement des cliniques...</p>;
  if (error) return <p>{error}</p>;

  // ---------------------------
  // Rendu principal
  // ---------------------------
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

      {/* Liste des cliniques */}
      <h1 className="clinique-title">Toutes les Cliniques</h1>
      <div className="clinique-grid">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="clinique-card">
            {/* Actions : Edit / Delete */}
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

            {/* Icone de la clinique */}
            <div className="clinique-icon" style={{ backgroundColor: "#0ea5e920", color: "#0ea5e9" }}>
              <FaHospital />
            </div>

            {/* Informations */}
            <h3>{clinic.name}</h3>
            <p>{clinic.address}</p>
            {clinic.phone && <p>{clinic.phone}</p>}
            <div
              className="clinique-arrow"
              onClick={() => navigate("/admin/cliniques/services", { state: { clinicId: clinic.id } })}
              title="Voir les services de cette clinique"
            >
              → 
            </div>
          </div>
        ))}
      </div>

      {/* Dialog d'ajout */}
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

      {/* Dialog d'édition */}
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
