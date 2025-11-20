import axios from "axios";
import { useEffect, useState } from "react";
import AlertService from "../../../Services/Alert.jsx";
import { generateInvoicePDF } from "../../../Services/facture.jsx";
import "./my-payments.css";

export default function PatientPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const patientId = localStorage.getItem("patientId");
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");
   const [modalData, setModalData] = useState(null);

  // Fonction pour ouvrir le modal de paiement en espèces
  const showCashPaymentModal = (payment) => {
    setModalData({
      title: "💵 Paiement en espèces",
      message: `
            🆔 Facture ID      : ${payment.paymentId}
            👤 Patient         : ${payment.patientName || "—"}
            🏥 Clinique        : ${payment.clinicName || "Clinique Exemple"}
            📍 Adresse         : ${payment.clinicAddress || "Adresse N/A"}
            📞 Téléphone       : ${payment.clinicPhone || "Tél N/A"}
            📅 Date Consultation: ${payment.rendezvousDate ? new Date(payment.rendezvousDate).toLocaleDateString() : "N/A"}
            💰 Montant         : ${payment.totalAmount} TND
            ⏰ Date d'échéance : ${payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "N/A"}
            📝 Créé le         : ${new Date(payment.createdAt).toLocaleDateString()}

            💵 Merci de présenter cette facture lors du paiement en espèces.`,
    });
  };

  useEffect(() => {
    if (!patientId || !token) return;

    async function fetchPayments() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:3000/payments/patient/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPayments(res.data.payments || []);
      } catch (err) {
        setError("Erreur lors de la récupération des paiements.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [patientId, token]);

  async function handlePayment(payment) {
    try {
      if (payment.status === "Payé") {
        AlertService.error("Cette facture est déjà payée.");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/payments/create-checkout-session",
        {
          amount: payment.totalAmount * 100,
          currency: "usd",
          customerEmail: userEmail,
          paymentId: payment.paymentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Erreur paiement", err);
      if (err.response?.data?.message) {
        AlertService.error(err.response.data.message);
      } else {
        AlertService.error("Erreur lors de l’initiation du paiement.");
      }
    }
  }

  

  return (
    <div className="payments-container">
      <h2>💳 Mes Factures</h2>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && payments.length === 0 && <p>Aucune facture trouvée.</p>}

      <div className="payments-list">
        {payments.map((p) => (
          <div className="invoice-card" key={p.paymentId}>
            <div className="invoice-header">
              <h3>🧾 Facture #{p.paymentId.slice(0, 6)}</h3>
              <span
                className={`status-badge ${
                  p.status?.replace(" ", "-").toLowerCase()
                }`}
              >
                {p.status ?? "Non émise"}
              </span>
            </div>
<div className="invoice-body">
  <p>🏥 <strong>Clinique:</strong> {p.clinicName || "Clinique Exemple"}</p>
  <p>📍 <strong>Adresse:</strong> {p.clinicAddress || "Adresse N/A"}</p>
  <p>📞 <strong>Téléphone:</strong> {p.clinicPhone || "Tél N/A"}</p>
  
  {/* Nouveau champ : nom du patient */}
  <p>👤 <strong>Patient:</strong> {p.patientName || "—"}</p>

  <p>📅 <strong>Date de Consultation:</strong> {p.rendezvousDate ? new Date(p.rendezvousDate).toLocaleDateString() : "N/A"}</p>
  <p>💰 <strong>Montant:</strong> {p.totalAmount} TND</p>
  {p.dueDate && (
    <p>⏰ <strong>Date d'échéance:</strong> {new Date(p.dueDate).toLocaleDateString()}</p>
  )}
  <p>📝 <strong>Créé le:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
</div>


            <div className="invoice-footer">
  {p.status === "Payé" ? (
    <button
      className="download-btn"
      onClick={() =>
        generateInvoicePDF(p, {
          id: p.payment,
          name: p.clinicName,
          address: p.clinicAddress,
          phone: p.clinicPhone,
          patientName: p.patientName,
        })
      }
    >
      📄 Télécharger la facture
    </button>
  ) : (
    <>
      <button onClick={() => handlePayment(p)}>💳 Payer En Ligne</button>
      <button
  onClick={() => showCashPaymentModal(p)}

>
  💵 Payer en espèces
</button>

    </>
  )}
</div>

          </div>
        ))}
         {/* Modal personnalisé */}
      {/* Modal personnalisé 3D avec icônes */}
{modalData && (
  <div
    className="facture-patient-modal-overlay"
    onClick={() => setModalData(null)}
  >
    <div
      className="facture-patient-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header avec icône */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
        <h2>
           {modalData.title}
        </h2>
      </div>

      {/* Contenu texte du modal */}
      <pre>{modalData.message}</pre>

      {/* Footer avec bouton fermer */}
     <div className="facture-patient-modal-footer">
        <button
          className="facture-patient-modal-btn facture-patient-modal-btn-close"
          onClick={() => setModalData(null)}
        >
          ✅ <span>Fermer</span>
        </button>
      </div>

    </div>
  </div>
)}

      </div>
    </div>
  );
}
