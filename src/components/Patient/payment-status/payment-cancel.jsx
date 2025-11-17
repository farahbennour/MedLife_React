import React from "react";
import "./payment-status.css";

export default function PaymentCancel() {
  return (
    <div className="payment-status-container cancel">
      <div className="payment-status-card">
        <h2>Paiement Annulé ❌</h2>
        <p>Le paiement n'a pas été finalisé. Vous pouvez réessayer à tout moment.</p>

        <div className="status-icon cancel-icon">
          ✖
        </div>

        <a href="/patient/my-payments" className="return-btn">
          Retour à mes paiements
        </a>
      </div>
    </div>
  );
}
