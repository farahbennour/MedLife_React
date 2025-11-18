import React from "react";
import "./payment-status.css"; 

export default function PaymentSuccess() {
  return (
    <div className="payment-status-container success">
      <div className="payment-status-card">
        <h2>Paiement Réussi 🎉</h2>
        <p>Votre paiement a été traité avec succès. Merci pour votre confiance !</p>

        <div className="status-icon success-icon">
          ✔
        </div>

        <a href="/patient/my-payments" className="return-btn">
          Retour à mes paiements
        </a>
      </div>
    </div>
  );
}
