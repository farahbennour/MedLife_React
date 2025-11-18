
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "./StaffService.css";

// export default function StaffService() {
//   const location = useLocation();
//   const { serviceId } = location.state || {};

//   const [doctors, setDoctors] = useState([]);
//   const [receptionists, setReceptionists] = useState([]);
//   const [activeTab, setActiveTab] = useState("doctor");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStaff = async () => {
//       if (!serviceId) return;
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
//         return;
//       }

//       try {
//         // 🔹 Fetch doctors
//         const doctorsRes = await axios.get(
//           `http://localhost:3000/users/doctors?serviceId=${serviceId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setDoctors(doctorsRes.data || []);

//         // 🔹 Fetch receptionists
//         const recepRes = await axios.get(
//           `http://localhost:3000/users/receptionists?serviceId=${serviceId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setReceptionists(recepRes.data || []);
//       } catch (error) {
//         console.error("Erreur lors du chargement du staff:", error);
//         Swal.fire("Erreur", "Impossible de charger le staff ❌", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStaff();
//   }, [serviceId]);

//   const handleDelete = async (userId) => {
//     const confirmResult = await Swal.fire({
//       title: "Êtes-vous sûr ?",
//       text: "Cette action supprimera l'utilisateur définitivement.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Oui, supprimer",
//       cancelButtonText: "Annuler",
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//     });

//     if (!confirmResult.isConfirmed) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:3000/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Mise à jour des listes
//       setDoctors(doctors.filter((d) => d.id !== userId));
//       setReceptionists(receptionists.filter((r) => r.id !== userId));

//       Swal.fire("Supprimé !", "Utilisateur supprimé ✅", "success");
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Erreur", "Impossible de supprimer l'utilisateur ❌", "error");
//     }
//   };

//   if (loading) return <p>Chargement du staff...</p>;

//   const activeList = activeTab === "doctor" ? doctors : receptionists;
//   const emptyMsg =
//     activeTab === "doctor"
//       ? "Aucun docteur trouvé pour ce service."
//       : "Aucun réceptionniste trouvé pour ce service.";

//   return (
//     <div className="staff-page">
      
//       {/* --- HEADER --- */}
//       <div className="staff-header">
        
//         <h2 className="staff-title">Staff du Service</h2>
//         <div className="tab-container">
//           <button
//             className={`tab-btn ${activeTab === "doctor" ? "active" : ""}`}
//             onClick={() => setActiveTab("doctor")}
//           >
//             Doctors
//           </button>
//           <button
//             className={`tab-btn ${activeTab === "receptionist" ? "active" : ""}`}
//             onClick={() => setActiveTab("receptionist")}
//           >
//             Receptionists
//           </button>
//         </div>
//       </div>

//       {/* --- GRID DES CARTES --- */}
//       <div className="cards-grid">
//         {activeList.length === 0 ? (
//           <p className="no-staff">{emptyMsg}</p>
//         ) : (
//           activeList.map((user) => (
//             <div key={user.id} className="staff-card">
//               <img
//                 src={user.image ||  "/src/assets/doctorlist.png"}
//                 alt={user.username || user.name}
//                 className="staff-image"
//               />
//               <h3>{user.username || user.name}</h3>
              
//               <p className="staff-email">{user.email}</p>
//               <p className="staff-phone"> {user.phone || "N/A"}</p>
//               <button
//                 className="delete-btn"
//                 onClick={() => handleDelete(user.id)}
//               >
//                 Supprimer
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "./StaffService.css";

// export default function StaffService() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { clinicId, serviceId } = location.state || {};

//   const [doctors, setDoctors] = useState([]);
//   const [receptionists, setReceptionists] = useState([]);
//   const [activeTab, setActiveTab] = useState("doctor");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStaff = async () => {
//       if (!clinicId || !serviceId) {
//         setError("Aucune clinique ou service sélectionné.");
//         setLoading(false);
//         return;
//       }

//       const token = localStorage.getItem("token");
//       if (!token) {
//         Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
//         setError("Pas de token");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `http://localhost:3000/users/staff?clinicId=${clinicId}&serviceId=${serviceId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const data = res.data || {};
//         setDoctors(data.doctors || []);
//         setReceptionists(data.receptionists || []);
//         setError(null);
//       } catch (err) {
//         console.error("Erreur API:", err);
//         setError("Erreur lors du chargement du staff.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStaff();
//   }, [clinicId, serviceId]);

//   if (loading) return <p className="loading">Chargement du staff...</p>;
//   if (error) return <p className="error-message">{error}</p>;

//   const activeList = activeTab === "doctor" ? doctors : receptionists;
//   const emptyMsg =
//     activeTab === "doctor"
//       ? "Aucun docteur trouvé."
//       : "Aucun réceptionniste trouvé.";

//   const getInitials = (name = "") => {
//     const parts = name.trim().split(" ");
//     if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
//     return (parts[0][0] + parts[1][0]).toUpperCase();
//   };

//   return (
//     <div className="staff-page">
//       <div className="staff-header">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Retour
//         </button>
//         <h2 className="staff-title">Équipe du service</h2>
//         <div className="tab-container">
//           <button
//             className={`tab-btn ${activeTab === "doctor" ? "active" : ""}`}
//             onClick={() => setActiveTab("doctor")}
//           >
//             Doctors
//           </button>
//           <button
//             className={`tab-btn ${activeTab === "receptionist" ? "active" : ""}`}
//             onClick={() => setActiveTab("receptionist")}
//           >
//             Receptionists
//           </button>
//         </div>
//       </div>

//       <div className="cards-grid minimal">
//         {activeList.length > 0 ? (
//           activeList.map((item) => {
//             const user = item.user || item;
//             return (
//               <div key={item.id} className="staff-card minimal-card">
//                 {user.image ? (
//                   <img
//                     src={user.image}
//                     alt={user.name || user.username}
//                     className="staff-avatar"
//                   />
//                 ) : (
//                   <div className="staff-avatar avatar-initials">
//                     {getInitials(user.name || user.username || "U")}
//                   </div>
//                 )}

//                 <div className="staff-info-minimal">
//                   <h3>{user.name || user.username}</h3>
//                   <p className="staff-username">
//                     @{(user.username || user.email || "user").split("@")[0]}
//                   </p>
//                   <p className="staff-role-text">
//                     {activeTab === "doctor" ? "Doctor" : "Receptionist"}
//                   </p>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="no-staff">{emptyMsg}</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./StaffService.css";

export default function StaffService() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clinicId, serviceId } = location.state || {};

  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [activeTab, setActiveTab] = useState("doctor");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!clinicId || !serviceId) {
        setError("Aucune clinique ou service sélectionné.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Non autorisé", "Veuillez vous connecter !", "warning");
        setError("Pas de token");
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/users/staff?clinicId=${clinicId}&serviceId=${serviceId}`,

          { headers: { Authorization: `Bearer ${token}` } }
        );


        const data = res.data || {};
        setDoctors(data.doctors || []);
        setReceptionists(data.receptionists || []);
        setError(null);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Erreur lors du chargement du staff.");

      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [clinicId, serviceId]);

  if (loading) return <p className="loading">Chargement du staff...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const activeList = activeTab === "doctor" ? doctors : receptionists;
  const emptyMsg =
    activeTab === "doctor"
      ? "Aucun docteur trouvé."
      : "Aucun réceptionniste trouvé.";

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="staff-page">
     <div className="staff-header">
  <div className="header-top">
    <button className="back-arrow" onClick={() => navigate(-1)}>
      ←
    </button>
    <h2 className="staff-title">Équipe du service</h2>
  </div>

  <div className="tab-container">
    <button
      className={`tab-btn ${activeTab === "doctor" ? "active" : ""}`}
      onClick={() => setActiveTab("doctor")}
    >
      Doctors
    </button>
    <button
      className={`tab-btn ${activeTab === "receptionist" ? "active" : ""}`}
      onClick={() => setActiveTab("receptionist")}
    >
      Receptionists
    </button>
  </div>
</div>

      

    <div className="cards-grid large">
  {activeList.length > 0 ? (
    activeList.map((item) => {
      const user = item.user || item;
      const initials = (user.name || user.username || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div key={item.id} className="staff-card move-style">
          {/* Avatar */}
          {user.image ? (
            <img src={user.image} alt={user.name} className="avatar-move" />
          ) : (
            <div className="avatar-move avatar-initials">{initials}</div>
          )}

          {/* Info in same line */}
          <div className="info-row">
            <div><strong>Nom :</strong> {user.name || "—"}</div>
            <div><strong>Email :</strong> {user.email || "—"}</div>
            <div><strong>Téléphone :</strong> {user.phone || "—"}</div>
            <div><strong>Rôle :</strong> {activeTab === "doctor" ? "Doctor" : "Receptionist"}</div>
          </div>
        </div>
      );
    })
  ) : (
    <p className="no-staff">{emptyMsg}</p>
  )}
</div>


    </div>
  );
}


