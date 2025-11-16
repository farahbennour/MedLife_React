import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./DoctorDossier.css";
import AlertService from "../../../Services/Alert";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function DoctorDossier() {
  const { patientId, clinicId } = useParams();
  const [dossier, setDossier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Patient");
  const [showModal, setShowModal] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [newConsultation, setNewConsultation] = useState({ diagnostic: "", notes: "" });
  const [showOrdonnanceFields, setShowOrdonnanceFields] = useState(false);
  const [newOrdonnance, setNewOrdonnance] = useState({
    items: [{ name: "", dose: "", duration: "" }],
    instructions: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rendezvousId = queryParams.get("rendezvousId");

  // 🔹 Fetch dossier
useEffect(() => {
  const fetchDossier = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/consultation/dossier?patientId=${patientId}&clinicId=${clinicId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDossier(res.data); // tableau de dossiers
      if (res.data.length > 0 && res.data[0].patient?.user?.username) {
        setPatientName(res.data[0].patient.user.username);
      }
    } catch (err) {
      console.error(err);
      AlertService.error("Erreur", "Impossible de charger le dossier du patient.");
    } finally {
      setLoading(false);
    }
  };
  fetchDossier();
}, [patientId, clinicId]);

  // 🔹 Handle change in ordonnance items
  const handleOrdonnanceItemChange = (index, field, value) => {
    const updatedItems = [...newOrdonnance.items];
    updatedItems[index][field] = value;
    setNewOrdonnance({ ...newOrdonnance, items: updatedItems });
  };

  const handleAddOrdonnanceItem = () => {
    setNewOrdonnance({
      ...newOrdonnance,
      items: [...newOrdonnance.items, { name: "", dose: "", duration: "" }],
    });
  };

  // 🔹 Handle Add or Update
  const handleSaveConsultation = async () => {
    if (!newConsultation.diagnostic)
      return AlertService.warning("Champ manquant", "Veuillez saisir un diagnostic.");

    const dto = {
      diagnostic: newConsultation.diagnostic,
      notes: newConsultation.notes,
    };

    if (showOrdonnanceFields) {
      dto.ordonnance = {
        items: newOrdonnance.items.filter(
          (item) => item.name || item.dose || item.duration
        ),
        instructions: newOrdonnance.instructions,
      };
    }

    try {
      let res;

      // 🔹 UPDATE (PATCH)
      if (editingConsultation) {
        res = await axios.patch(
          `http://localhost:3000/consultation/${editingConsultation.id}`,
          dto,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updated = res.data.consultation ?? res.data;

        setDossier((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );

        AlertService.success(
          "Consultation mise à jour",
          "Les modifications ont été enregistrées !"
        );
      }

      // 🔹 CREATE (POST) — **THIS WAS MISSING**
      else {
        res = await axios.post(
          `http://localhost:3000/consultation/rendezvous/${rendezvousId}`,
          dto,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const created = res.data.consultation ?? res.data;

        setDossier((prev) => [created, ...prev]);

        AlertService.success(
          "Consultation ajoutée",
          "La consultation a été enregistrée avec succès !"
        );
      }

      resetModal();
    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.status === 403)
        AlertService.error("Erreur", "Vous n’êtes pas autorisé(e).");
      else
        AlertService.error("Erreur", "Une erreur est survenue.");
    }
  };


  // 🔹 Delete consultation
  const handleDeleteConsultation = async (id) => {
    const confirmed = await AlertService.confirm(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette consultation ?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/consultation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDossier((prev) => prev.filter((c) => c.id !== id));
      AlertService.success(
        "Consultation supprimée",
        "La fiche a été supprimée avec succès !"
      );
    } catch (err) {
      console.error(err);
      // Fallback if response is undefined
      const status = err.response?.status || err?.status;
      if (status === 403) {
        AlertService.error(
          "Erreur",
          "Vous n’êtes pas autorisé(e) à supprimer cette fiche de consultation."
        );
      } else if (status === 404) {
        AlertService.error("Erreur", "Consultation introuvable.");
      } else {
        AlertService.error("Erreur", "Une erreur est survenue lors de la suppression.");
      }
    }
  };

  // 🔹 Open edit modal
  const handleEditConsultation = (consultation) => {
    setEditingConsultation(consultation);
    setNewConsultation({
      diagnostic: consultation.diagnostic || "",
      notes: consultation.notes || "",
    });

    if (consultation.ordonnance) {
      setShowOrdonnanceFields(true);
      setNewOrdonnance({
        items: consultation.ordonnance.items || [{ name: "", dose: "", duration: "" }],
        instructions: consultation.ordonnance.instructions || "",
      });
    } else {
      setShowOrdonnanceFields(false);
      setNewOrdonnance({ items: [{ name: "", dose: "", duration: "" }], instructions: "" });
    }

    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingConsultation(null);
    setNewConsultation({ diagnostic: "", notes: "" });
    setNewOrdonnance({ items: [{ name: "", dose: "", duration: "" }], instructions: "" });
    setShowOrdonnanceFields(false);
  };

  if (loading) return <div className="dossier-loading">Chargement du dossier...</div>;

  return (
    <div className="doctor-dossier-container">
      <div className="dossier-header">
        <button className="back-btn" onClick={() => navigate(-1)}>⬅ Retour</button>
        <h2 className="patient-name">{patientName}</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+</button>
      </div>

      {/* Modal for Add / Update */}
      {showModal && (
        <div className={`modal ${showOrdonnanceFields ? "expanded" : ""}`}>
          <h3>{editingConsultation ? "Modifier Consultation" : "Nouvelle Consultation"}</h3>

          <label>Diagnostic:</label>
          <input
            type="text"
            value={newConsultation.diagnostic}
            onChange={(e) => setNewConsultation({ ...newConsultation, diagnostic: e.target.value })}
          />

          <label>Notes:</label>
          <textarea
            rows="3"
            value={newConsultation.notes}
            onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
          />

          <button
            type="button"
            className="add-ordonnance-btn"
            onClick={() => setShowOrdonnanceFields((prev) => !prev)}
          >
            {showOrdonnanceFields ? "Masquer l’ordonnance" : "Ajouter une ordonnance"}
          </button>

          {showOrdonnanceFields && (
            <div className="ordonnance-modal-section">
              <h4>Ordonnance</h4>
              {newOrdonnance.items.map((item, i) => (
                <div key={i} className="ordonnance-item">
                  <input
                    type="text"
                    placeholder="Nom du médicament"
                    value={item.name}
                    onChange={(e) => handleOrdonnanceItemChange(i, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Dose"
                    value={item.dose}
                    onChange={(e) => handleOrdonnanceItemChange(i, "dose", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Durée (facultative)"
                    value={item.duration}
                    onChange={(e) => handleOrdonnanceItemChange(i, "duration", e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddOrdonnanceItem} className="add-ordonnance-btn">
                Ajouter un médicament
              </button>

              <label>Instructions:</label>
              <textarea
                rows="3"
                value={newOrdonnance.instructions}
                onChange={(e) => setNewOrdonnance({ ...newOrdonnance, instructions: e.target.value })}
              />
            </div>
          )}

          <div className="modal-actions">
            <button onClick={handleSaveConsultation}>
              {editingConsultation ? "Mettre à jour" : "Ajouter"}
            </button>
            <button onClick={resetModal} className="modal-cancel">Annuler</button>
          </div>
        </div>
      )}

      {/* Consultations list */}
    {dossier.length === 0 ? (
        <p>Aucune consultation enregistrée.</p>
      ) : (
        dossier.map((dossierItem) => 
          dossierItem.consultations.map((consultation) => (
            <div key={consultation.id} className="consultation-card">
              <h3>Consultation du {new Date(consultation.createdAt).toLocaleDateString("fr-FR")}</h3>
              <p><strong>Diagnostic :</strong> {consultation.diagnostic}</p>
              <p><strong>Notes :</strong> {consultation.notes || "Aucune note"}</p>

              {consultation.ordonnance ? (
                <div className="ordonnance-section">
                  <h4>Ordonnance</h4>
                  <ul>
                    {consultation.ordonnance.items?.map((m, i) => (
                      <li key={i}>💊 {m.name} - {m.dose} ({m.duration})</li>
                    ))}
                  </ul>
                  {consultation.ordonnance.instructions && <p><em>{consultation.ordonnance.instructions}</em></p>}
                </div>
              ) : (
                <p>Pas d’ordonnance associée.</p>
              )}
            </div>
          ))
        )
      )}

    </div>
  );
}