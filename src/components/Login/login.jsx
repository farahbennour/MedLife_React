import { useState } from "react";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="login-page">
      
         <img src="/src/assets/patient.png" alt="Décor haut" className="pill-top" />
      <img src="/src/assets/patient.png" alt="Décor bas" className="pill-bottom" />
      
     

      {/* Partie droite avec formulaire */}
      <div className="login-container">
        
        <div className="login-card">
              <img src="/src/assets/logo.png" className="image-login"></img>
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
            <a href="/forgot-password">  Mot de passe Oublié ?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
