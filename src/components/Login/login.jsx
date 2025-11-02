import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook pour navigation
import axios from "axios"; // Pour les requêtes HTTP
import "./login.css";

export default function Login() {
  // ---------------------------
  // States pour les inputs et messages d'erreur
  // ---------------------------
  const [email, setEmail] = useState(""); // Email saisi
  const [password, setPassword] = useState(""); // Mot de passe saisi
  const [error, setError] = useState(""); // Message d'erreur affiché à l'utilisateur

  const navigate = useNavigate(); // Hook pour naviguer vers d'autres pages

  // ---------------------------
  // Fonction appelée à la soumission du formulaire
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialiser le message d'erreur

    try {
      // Appel à l'API pour authentification
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = response.data.token; // Token JWT
      const user = response.data.user; // Infos utilisateur

      // Vérification si les données sont présentes
      if (!token || !user) {
        setError("Connexion échouée : données manquantes.");
        return;
      }

      // Stocker le token et le rôle dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      // Redirection selon le rôle de l'utilisateur
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "receptionist") {
        navigate("/receptionist");
      } else if (user.role === "doctor") {
        navigate("/doctor");
      } else if (user.role === "patient") {
        navigate("/patient"); // Redirection vers dashboard patient
      } else {
        setError("Rôle inconnu");
      }

    } catch (err) {
      console.error(err); // Log dans la console pour le développeur
      setError("Email ou mot de passe incorrect."); // Message utilisateur
    }
  };

  // ---------------------------
  // JSX / Structure de la page de login
  // ---------------------------
  return (
    <div className="login-page">
      {/* Décor haut et bas */}
      <img src="/src/assets/patient.png" alt="Décor haut" className="pill-top" />
      <img src="/src/assets/patient.png" alt="Décor bas" className="pill-bottom" />

      {/* Container principal du formulaire */}
      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <img src="/src/assets/logo.png" className="image-login" alt="logo" />
          <h2>Connexion</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Affichage du message d'erreur si présent */}
            {error && <p className="error-message">{error}</p>}

            <button type="submit">Se connecter</button>
          </form>

          {/* Lien vers la page de mot de passe oublié */}
          <p className="signup-link">
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
