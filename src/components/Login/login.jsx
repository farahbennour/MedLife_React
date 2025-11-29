import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertService from "../../Services/Alert.jsx";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 // Dans votre composant Login
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });

    const token = response.data.token;
    const user = response.data.user;

    if (!token || !user) {
      AlertService.error("Connexion échouée : données manquantes.");
      return;
    }

    // Stockage des informations
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("email", user.email);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("clinicId", user.clinicId || "");
    localStorage.setItem("serviceId", user.serviceId || "");

    // Stockage des IDs spécifiques selon le rôle
    const roleIds = {
      patient: 'patientId',
      doctor: 'doctorId', 
      receptionist: 'receptionistId',
      admin: 'adminId'
    };
    
    if (roleIds[user.role]) {
      localStorage.setItem(roleIds[user.role], user[roleIds[user.role]] || user.id);
    }

    AlertService.success("Succès", "Bienvenue dans votre espace.");

    // Redirection selon le rôle
    const redirectPaths = {
      admin: "/admin/dashboard",
      receptionist: "/receptionist/dashboard", 
      doctor: "/doctor/dashboard",
      patient: "/patient"
    };

    navigate(redirectPaths[user.role] || "/");
    
  } catch (err) {
    console.error(err);
    AlertService.error("Erreur", "Email ou mot de passe incorrect");
  }
};


  return (
    <div className="login-page">
      <img src="/src/assets/patient.png" alt="Décor haut" className="pill-top" />
      <img src="/src/assets/patient.png" alt="Décor bas" className="pill-bottom" />

      <div className="login-container">
        <div className="login-card">
          <img src="/src/assets/logo.png" className="image-login" alt="logo" />
          <h2>Connexion</h2>

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

            <button type="submit">Se connecter</button>
          </form>

          <p className="signup-link">
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
