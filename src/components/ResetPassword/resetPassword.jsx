import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import AlertService from "../../Services/Alert.jsx"; // Service d'alerte (SweetAlert2)

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifications avant envoi
    if (!newPassword || !confirmPassword) {
      AlertService.error("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      AlertService.error("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    if (!token) {
      AlertService.error("Erreur", "Lien invalide ou token manquant.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users/reset-password", {
        token,
        newPassword,
      });

      AlertService.success(
        "Succès",
        "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter."
      );

      // Redirection après un court délai
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      AlertService.error(
        "Erreur",
        err.response?.data?.message ||
          "Une erreur est survenue lors de la réinitialisation du mot de passe."
      );
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2>Réinitialiser le mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">Nouveau mot de passe</label>
          <input
            type="password"
            id="new-password"
            placeholder="Entrez votre nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Réinitialiser</button>
        </form>

        <div className="login-link">
          <a href="/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
