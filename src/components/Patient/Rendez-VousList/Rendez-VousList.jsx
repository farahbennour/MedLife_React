import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./Rendez-VousList.css";

export default function RendezVousList() {
  const [rendezvous, setRendezvous] = useState([]);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  // Récupérer l'ID utilisateur depuis le token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();
    if (!userId) return;

    axios
      .get(`http://localhost:3000/rendezvous/patient/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRendezvous(res.data))
      .catch((err) => console.error("Erreur chargement RDV :", err));
  }, []);

  const handleMouseLeave = (cardRef) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
  };



  return (
    <div className="rv-section">
      <div className="rv-header">
        <h2>Mes Rendez-vous</h2>
        <p className="rv-sub">Voici la liste de vos rendez-vous</p>
      </div>

      <div className="rv-grid" ref={containerRef}>
        {rendezvous.map((r) => {
          const cardRef = React.createRef();
          const date = new Date(r.date);

          return (
            <div
              key={r.id}
              className={`rv-card ${r.status === "Annulé" ? "rv-cancel" : ""}`}
              onMouseMove={(e) => handleMouseMove(e, cardRef)}
              onMouseLeave={() => handleMouseLeave(cardRef)}
              onClick={() => setSelected(r)}
            >
              <div className="rv-card-inner" ref={cardRef}>
                <div className="rv-card-top">
                  <div className="rv-date">
                    <div className="rv-day">
                      {date.toLocaleDateString("fr-FR", { day: "2-digit" })}
                    </div>
                    <div className="rv-month">
                      {date.toLocaleDateString("fr-FR", { month: "short" })}
                    </div>
                  </div>

                  <div className="rv-meta">
                    <div className="rv-clinic">{r.clinic?.name || "—"}</div>
                    <div className="rv-service">{r.service?.name || "—"}</div>
                  </div>
                </div>

                <div className="rv-body">
                  <h3 className="rv-doctor">
                    Dr. {r.doctor?.user?.username || "Non assigné"}
                  </h3>
                </div>

                <div className="rv-footer">
                  <span
                    className={`rv-status rv-${r.status
                      ?.toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {r.status}
                  </span>
                  <span className="rv-time">
                    {date.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="rv-shadow rv-shadow-1" />
              <div className="rv-shadow rv-shadow-2" />
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="rv-modal" onClick={() => setSelected(null)}>
          <div className="rv-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Détails du rendez-vous</h3>
            <p>
              <strong>Date :</strong>{" "}
              {new Date(selected.date).toLocaleString("fr-FR")}
            </p>
            <p>
              <strong>Clinique :</strong> {selected.clinic?.name || "—"}
            </p>
            <p>
              <strong>Service :</strong> {selected.service?.name || "—"}
            </p>
            <p>
              <strong>Docteur :</strong>{" "}
              {selected.doctor?.user?.username || "Non assigné"}
            </p>
            <p>
              <strong>Statut :</strong>{" "}
              <span
                className={`rv-status rv-${selected.status
                  ?.toLowerCase()
                  .replace(/\s/g, "-")}`}
              >
                {selected.status}
              </span>
            </p>
            

            <div className="rv-modal-actions">
              <button className="btn primary">Annuler le RDV</button>
              <button className="btn" onClick={() => setSelected(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
