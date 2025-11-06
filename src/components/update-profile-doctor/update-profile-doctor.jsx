import axios from "axios"; // pour effectuer des requêtes HTTP vers ton backend
import { useEffect, useState } from "react"; // hooks React pour gérer l’état et les effets
import { FaEye, FaEyeSlash } from "react-icons/fa"; // icônes pour afficher/masquer les mots de passe
import AlertService from "../../Services/Alert.jsx"; // service personnalisé pour afficher des alertes
import "./update-profile-doctor.css"; // fichier CSS pour le style du composant

//  Composant principal
const UpdateProfileDoctor = () => {
  //  État local pour stocker les informations de l'utilisateur
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  });

  //  État local pour les champs de mot de passe
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  //  État pour contrôler la visibilité des mots de passe (icône œil)
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
  });

  //  États de chargement et de rôle
  const [isLoading, setIsLoading] = useState(true); // indique si les données du profil sont encore en cours de chargement
  const [isAdmin, setIsAdmin] = useState(false); // utilisé pour gérer l’affichage conditionnel si le user est admin

  //  Récupération des infos du user dans le localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  //  Hook useEffect : chargé une seule fois au montage du composant
  useEffect(() => {
    // Vérifie si l’utilisateur est un admin
    if (role === "admin") setIsAdmin(true);

    // Fonction pour récupérer les données du profil depuis le backend
    const fetchUser = async () => {
      try {
        // Requête GET vers l’API pour récupérer le profil utilisateur
        const res = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Si les données existent, les stocker dans l’état local
        const userData = res.data || {};
        console.log("👤 Utilisateur connecté :", userData);

        setUser({
          id: userData.id || "",
          username: userData.username ?? "",
          email: userData.email ?? "",
        });
      } catch (err) {
        // Gestion d’erreur : message si la requête échoue
        console.error("Erreur lors du chargement du profil :", err);
        AlertService.error("Erreur", "Impossible de charger le profil.");
      } finally {
        // Désactive le mode chargement une fois la requête terminée
        setIsLoading(false);
      }
    };

    // Exécute la récupération seulement si token + userId existent
    if (token && userId) fetchUser();
  }, [userId, token, role]); // dépendances pour relancer l’effet si ces valeurs changent

  //  Fonction pour mettre à jour les champs "username" et "email"
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Fonction pour mettre à jour les champs "oldPassword" et "newPassword"
  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Fonction exécutée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page

    try {
      // Construction de l’objet à envoyer au backend
      const data = {
        username: user.username,
        email: user.email,
        oldPassword: passwords.oldPassword || undefined,
        newPassword: passwords.newPassword || undefined,
      };

      // Requête PATCH vers l’API pour mettre à jour le profil
      const res = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //  Succès : afficher une alerte de confirmation
      AlertService.success(
        "Profil mis à jour",
        res.data.message || "Les informations ont été sauvegardées avec succès !"
      );

      // Réinitialiser les champs de mot de passe
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (error) {
      //  Erreur : afficher une alerte avec le message du backend
      console.error(error);
      AlertService.error(
        "Erreur",
        error.response?.data?.message || "Échec de la mise à jour."
      );
    }
  };

  //  Affiche un message pendant le chargement du profil
  if (isLoading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  //  Rendu principal du composant
  return (
    <div className="update-profiledoctor-container">
      <h2> Mon Profil </h2>

      {/* Formulaire de mise à jour */}
      <form onSubmit={handleSubmit} className="update-profile-form">
        {/* Champ Nom d’utilisateur */}
        <label>Nom d’utilisateur</label>
        <input
          type="text"
          name="username"
          value={user.username || ""}
          onChange={handleChange}
          required
        />

        {/* Champ Email */}
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
              type={showPassword.old ? "text" : "password"}
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
              type={showPassword.new ? "text" : "password"}
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

        {/* Bouton d’envoi */}
        <button type="submit"> Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateProfileDoctor;
