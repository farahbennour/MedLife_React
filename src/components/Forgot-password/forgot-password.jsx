import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/users/request-password-reset", { email });

      // ✅ Alerte de succès
      Swal.fire({
        icon: "success",
        title: "Email envoyé",
        text: "Veuillez vérifier votre boîte mail pour réinitialiser votre mot de passe.",
        confirmButtonColor: "#1fa6a3",
      });

      setEmail(""); // Réinitialiser le champ email
    } catch (err) {
      console.error(err);

      // ❌ Alerte d’erreur
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l’envoi de l’email. Veuillez réessayer.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Mot de passe oublié</h2>
        <p className="instruction">
          Saisissez votre adresse e-mail ci-dessous et nous vous enverrons un lien
          pour réinitialiser votre mot de passe.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Entrez votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Envoyer le lien</button>
        </form>

        <div className="login-link">
          <a href="/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
