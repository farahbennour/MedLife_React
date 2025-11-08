//  Importation des modules nécessaires
import axios from "axios"; // Pour faire des requêtes HTTP vers l'API
import { useEffect, useState } from "react"; // Hooks React : useState (état local) et useEffect (effet au chargement)
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icônes pour afficher/masquer le mot de passe
import AlertService from "../../../Services/Alert.jsx"; // Service personnalisé pour afficher des alertes
import "./update-profile-admin.css"; // Fichier CSS pour le style du composant

//  Définition du composant principal
const UpdateProfileAdmin = () => {
  //  État pour les informations de base de l'utilisateur
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });

  //  État pour les mots de passe (ancien et nouveau)
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  //  État pour afficher ou masquer les mots de passe
  const [showPassword, setShowPassword] = useState({
    old: false, // pour l'ancien mot de passe
    new: false, // pour le nouveau mot de passe
  });

  //  État de chargement et indicateur du rôle admin
  const [isLoading, setIsLoading] = useState(true); // indique si le profil est encore en cours de chargement
  const [isAdmin, setIsAdmin] = useState(false); // indique si l'utilisateur est un administrateur

  //  Récupération des infos depuis le localStorage
  const token = localStorage.getItem("token"); // Token JWT pour l’authentification
  const userId = localStorage.getItem("userId"); // ID de l'utilisateur connecté
  const role = localStorage.getItem("role"); // Rôle (ex: admin, doctor, etc.)

  //  useEffect : se déclenche au montage du composant
  useEffect(() => {
    // Vérifie si l'utilisateur connecté est un admin
    if (role === "admin") setIsAdmin(true);

    // 🔍 Fonction interne pour charger le profil utilisateur
    const fetchUser = async () => {
      try {
        // Appel API pour récupérer les infos du user connecté
        const res = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Authentification par token
        });

        const userData = res.data || {}; // Données récupérées
        console.log("👤 Utilisateur connecté :", userData);

        // Mise à jour de l'état local avec les infos du profil
        setUser({
          id: userData.id || "",
          username: userData.username ?? "",
          email: userData.email ?? "",
        });
      } catch (err) {
        //  En cas d'erreur, message d'alerte
        console.error("Erreur lors du chargement du profil :", err);
        AlertService.error("Erreur", "Impossible de charger le profil.");
      } finally {
        // Arrête le chargement quoi qu’il arrive
        setIsLoading(false);
      }
    };

    // Exécute la récupération du profil seulement si on a un token et un userId
    if (token && userId) fetchUser();
  }, [userId, token, role]); // 🔁 Dépendances : si une change, le useEffect se relance

  //  Gère le changement des champs de base (username, email)
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Gère le changement des champs de mot de passe
  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Soumission du formulaire (mise à jour du profil)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      // Prépare les données à envoyer au backend
      const data = {
        username: user.username,
        email: user.email,
        oldPassword: passwords.oldPassword || undefined,
        newPassword: passwords.newPassword || undefined,
      };

      // Requête PATCH vers l'API pour mettre à jour les infos
      const res = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //  En cas de succès : alerte et message
      AlertService.success(
        "Profil mis à jour",
        res.data.message || "Les informations ont été sauvegardées avec succès !"
      );

      // Réinitialise les champs mot de passe
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (error) {
      //  Gestion d'erreur
      console.error(error);
      AlertService.error(
        "Erreur",
        error.response?.data?.message || "Échec de la mise à jour."
      );
    }
  };



  //  Rendu principal du composant
  return (
    <div className="update-profileadmin-container">
      {/* 🔹 Titre dynamique : affiche "Administrateur" si admin */}
      <h2>Mon profil {isAdmin ? "Administrateur" : "Utilisateur"}</h2>

      {/* Formulaire de mise à jour */}
      <form onSubmit={handleSubmit} className="update-profile-form">
        {/*  Champ Nom d’utilisateur */}
        <label>Nom d’utilisateur</label>
        <input
          type="text"
          name="username"
          value={user.username || ""}
          onChange={handleChange}
          required
        />

        {/*  Champ Email */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          required
        />

        {/*  Section de changement de mot de passe */}
        <div className="password-section">
          <h3>Changer le mot de passe</h3>

          {/* Ancien mot de passe */}
          <label>Ancien mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword.old ? "text" : "password"} // Affiche ou masque selon l’état
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Entrez votre ancien mot de passe"
            />
            {/* Icône pour afficher/masquer */}
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, old: !prev.old }))
              }
            >
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Nouveau mot de passe */}
          <label>Nouveau mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword.new ? "text" : "password"} // Affiche ou masque selon l’état
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="Entrez votre nouveau mot de passe"
            />
            {/* Icône pour afficher/masquer */}
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/*  Bouton de validation */}
        <button type="submit"> Mettre à jour</button>
      </form>
    </div>
  );
};

//  Export du composant
export default UpdateProfileAdmin;