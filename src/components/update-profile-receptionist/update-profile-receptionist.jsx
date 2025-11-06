// Importation des modules nécessaires
import axios from "axios"; // pour faire des requêtes HTTP vers le backend
import { useEffect, useState } from "react"; // hooks React
import { FaEye, FaEyeSlash } from "react-icons/fa"; // icônes pour afficher/masquer le mot de passe
import AlertService from "../../Services/Alert.jsx"; // service d’alertes (succès/erreur)
import "./update-profile-receptionist.css"; // fichier CSS pour le style du composant

//  Composant principal
const UpdateProfileReceptionist = () => {

  //  État local pour stocker les informations utilisateur
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });

  //  État local pour gérer les anciens et nouveaux mots de passe
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // 🧩 État pour afficher ou masquer les champs de mot de passe
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
  });

  //  États supplémentaires pour le chargement et le rôle
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  //  Récupération des infos depuis le localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  //  Chargement du profil utilisateur au montage du composant
  useEffect(() => {
    // Vérifie si le rôle est admin
    if (role === "admin") setIsAdmin(true);

    // Fonction interne pour charger les données utilisateur
    const fetchUser = async () => {
      try {
        // Appel API GET pour récupérer les infos utilisateur
        const res = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data || {};
        console.log("👤 Utilisateur connecté :", userData);

        // Mise à jour du state utilisateur
        setUser({
          id: userData.id || "",
          username: userData.username ?? "",
          email: userData.email ?? "",
          phone: userData.phone ?? "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        AlertService.error("Erreur", "Impossible de charger le profil.");
      } finally {
        // Fin du chargement
        setIsLoading(false);
      }
    };

    // Exécution de la requête seulement si le token et l’ID existent
    if (token && userId) fetchUser();
  }, [userId, token, role]);

  //  Gestion des champs de texte (nom, email, téléphone)
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Gestion des champs de mot de passe
  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page

    try {
      // Données à envoyer à l’API
      const data = {
        username: user.username,
        email: user.email,
        phone: user.phone,
        oldPassword: passwords.oldPassword || undefined,
        newPassword: passwords.newPassword || undefined,
      };

      // Appel API PATCH pour mettre à jour le profil
      const res = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Afficher une alerte de succès
      AlertService.success(
        "Profil mis à jour",
        res.data.message || "Les informations ont été sauvegardées avec succès !"
      );

      // Réinitialisation des champs de mot de passe
      setPasswords({ oldPassword: "", newPassword: "" });

    } catch (error) {
      console.error(error);
      // Afficher une alerte d’erreur
      AlertService.error(
        "Erreur",
        error.response?.data?.message || "Échec de la mise à jour."
      );
    }
  };

  //  Affichage d’un message de chargement pendant la récupération du profil
  if (isLoading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  //  Interface utilisateur
  return (
    <div className="update-profilereceptionist-container">
      <h2>Mon Profil</h2>

      <form onSubmit={handleSubmit} className="update-profile-form">

        {/* Champ nom d’utilisateur */}
        <label>Nom d’utilisateur</label>
        <input
          type="text"
          name="username"
          value={user.username || ""}
          onChange={handleChange}
          required
        />

        {/* Champ email */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          required
        />

        {/* Champ téléphone */}
        <label>Téléphone</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />

        {/* 🔐 Section changement du mot de passe */}
        <div className="password-section">
          <h3>Changer le mot de passe</h3>

          {/* Ancien mot de passe */}
          <label>Ancien mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Entrez votre ancien mot de passe"
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, old: !prev.old }))
              }
            >
              {/* Icône afficher/masquer */}
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Nouveau mot de passe */}
          <label>Nouveau mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="Entrez votre nouveau mot de passe"
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
            >
              {/* Icône afficher/masquer */}
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Bouton de soumission */}
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateProfileReceptionist;
