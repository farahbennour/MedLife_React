import React, { useEffect, useState } from "react"; // Hooks React
import axios from "axios"; // Pour les requêtes HTTP
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icônes pour afficher/masquer le mot de passe
import "./update-profile-patient.css"; // Fichier CSS pour le style du composant
import AlertService from "../../../Services/Alert.jsx"; // Service d’alerte (succès/erreur)

// 🔹 Déclaration du composant principal
const UpdateProfilePatient = () => {

  // 🧩 État local du patient connecté
  const [patient, setPatient] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    dateNaissance: "",
  });

  // 🧩 État local pour gérer les mots de passe (ancien et nouveau)
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // 🧩 État pour afficher/masquer les mots de passe
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
  });

  // 🧩 Message d’alerte optionnel
  const [message, setMessage] = useState("");

  // 🔑 Récupération des données d'authentification stockées localement
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("userId"); // Sauvegardé lors du login

  // 🧠 Charger les informations du patient connecté
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Appel API GET pour récupérer les infos du patient
        const res = await axios.get(
          `http://localhost:3000/users/patient/user/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Authentification via token JWT
            },
          }
        );

        // Mise à jour du state avec les infos reçues
        setPatient({
          id: res.data.id,
          username: res.data.user.username,
          email: res.data.user.email,
          phone: res.data.user.phone,
          address: res.data.address || "",
          dateNaissance: res.data.dateNaissance
            ? res.data.dateNaissance.split("T")[0] // Formatage de la date
            : "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du profil patient :", err);
        AlertService.error("Erreur", "Erreur de chargement du profil.");
      }
    };

    // On ne charge les infos que si le token et l’ID existent
    if (token && patientId) fetchPatient();
  }, [patientId, token]);

  // 🖊️ Gestion des champs du profil (username, email, phone, etc.)
  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  // 🖊️ Gestion des champs du mot de passe
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Soumission du formulaire de mise à jour du profil patient
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Données à envoyer à l’API
      const data = {
        username: patient.username,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        dateNaissance: patient.dateNaissance,
      };

      // Requête PATCH vers l’API pour mettre à jour les informations du patient
      const res = await axios.patch(
        `http://localhost:3000/users/patient/${patient.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Notification de succès
      AlertService.success(
        "Succès",
        res.data.message || "Profil patient mis à jour !"
      );
    } catch (error) {
      console.error(error);
      // Notification d’erreur
      AlertService.error(
        "Erreur",
        error.response?.data?.message || "Erreur lors de la mise à jour."
      );
    }
  };

  // 🔐 Soumission du formulaire de changement de mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // Requête PATCH vers la même route mais avec les champs de mot de passe
      const res = await axios.patch(
        `http://localhost:3000/users/patient/${patient.id}`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Notification de succès
      AlertService.success(
        "Succès",
        res.data.message || "Mot de passe mis à jour !"
      );

      // Réinitialisation des champs de mot de passe
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error(error);
      // Notification d’erreur
      AlertService.error(
        "Erreur",
        error.response?.data?.message ||
          "Erreur lors du changement du mot de passe."
      );
    }
  };

  // 🧱 Interface utilisateur (rendue du composant)
  return (
    <div className="update-profile-container">
      <h2>Mon profil </h2>

      {/* Affichage du message si défini */}
      {message && <p className="update-profile-message">{message}</p>}

      {/* 🔹 Formulaire principal de mise à jour du profil */}
      <form onSubmit={handleSubmit} className="update-profile-form">
        <label>Nom d’utilisateur</label>
        <input
          type="text"
          name="username"
          value={patient.username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={patient.email}
          onChange={handleChange}
          required
        />

        <label>Téléphone</label>
        <input
          type="text"
          name="phone"
          value={patient.phone}
          onChange={handleChange}
        />

        <label>Adresse</label>
        <input
          type="text"
          name="address"
          value={patient.address}
          onChange={handleChange}
        />

        <label>Date de naissance</label>
        <input
          type="date"
          name="dateNaissance"
          value={patient.dateNaissance}
          onChange={handleChange}
        />

        <button type="submit">Mettre à jour</button>
      </form>

      {/* 🔐 Section dédiée au changement de mot de passe */}
      <div className="password-section">
        <h3>Changer le mot de passe</h3>

        <form onSubmit={handlePasswordSubmit} className="update-profile-form">
          {/* Champ ancien mot de passe */}
          <label>Ancien mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword.old ? "text" : "password"} // Toggle affichage
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            {/* Icône d’affichage du mot de passe */}
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, old: !prev.old }))
              }
            >
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Champ nouveau mot de passe */}
          <label>Nouveau mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword.new ? "text" : "password"} // Toggle affichage
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
            {/* Icône d’affichage du mot de passe */}
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Changer le mot de passe</button>
        </form>
      </div>
    </div>
  );
};

// Export du composant pour utilisation ailleurs dans le projet
export default UpdateProfilePatient;