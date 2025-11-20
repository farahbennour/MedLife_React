import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./reactivate-account.css"; // Copie ton CSS reset/blur mais avec .reactivate-page/.reactivate-card

const ReactivateAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide");
      return;
    }

    const activate = async () => {
      try {
        const res = await axios.post(`http://localhost:3000/payments/activate?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Erreur lors de l'activation");
      }
    };

    activate();
  }, [token]);

  return (
    <div className="reactivate-page">
      <div className="reactivate-card">
        {status === "loading" && <p>Activation en cours...</p>}
        {status === "success" && (
          <>
            <h2>Compte activé !</h2>
            <p>{message}</p>
                <button className="reactivate-link"
                onClick={() => navigate('/login')}>
                Aller à la page de connexion
                </button>          
                </>
        )}
        {status === "error" && (
          <>
            <h2>Erreur</h2>
            <p>{message}</p>
             <button className="reactivate-link"
                onClick={() => navigate('/login')}>
                Aller à la page de connexion
                </button>   
          </>
        )}
      </div>
    </div>
  );
};

export default ReactivateAccount;
