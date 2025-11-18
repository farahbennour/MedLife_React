import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./DoctorCalendarWithList.css";
import AlertService from "../../../Services/Alert";
import frLocale from "@fullcalendar/core/locales/fr";


export default function DoctorCalendarWithList() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredRendezvous, setFilteredRendezvous] = useState([]);
  const token = localStorage.getItem("token");

  const rdvListRef = useRef(null);

  const translateStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmé";
    case "refused":
      return "Refusé";
    default:
      return status;
  }
};

  // Fetch doctor's rendezvous on mount
  useEffect(() => {
    const fetchRendezvous = async () => {
      try {
        const res = await axios.get("http://localhost:3000/rendezvous/doctor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Group RDVs by date to count them
        const rdvsByDate = res.data.reduce((acc, rdv) => {
        const dateStr = rdv.date.split("T")[0];
          if (!acc[dateStr]) {
            acc[dateStr] = [];
          }
          acc[dateStr].push(
            {
              ...rdv,
              id: rdv._id ?? rdv.id
            }
          );
          return acc;
        }, {});

        // Create events showing RDV count instead of patient names
        const formatted = Object.entries(rdvsByDate).map(([dateStr, rdvs]) => ({
          id: `event-${dateStr}`,
          title: `${rdvs.length} RDV${rdvs.length > 1 ? 's' : ''}`,
          start: dateStr,
          extendedProps: {
            rdvs: rdvs, // Store all RDVs for this date
            count: rdvs.length
          },
        }));

        setEvents(formatted);
      } catch (error) {
        console.error("Erreur lors du chargement des RDVs", error);
      }
    };
    fetchRendezvous();
  }, []);

  // Handle date click
  const handleDateClick = (info) => {
    const clickedDateStr = info.dateStr;  
    const clickedDate = new Date(clickedDateStr); 
    setSelectedDate(clickedDate);

    const sameDayEvent = events.find((e) => e.start === clickedDateStr);

    setFilteredRendezvous(sameDayEvent ? sameDayEvent.extendedProps.rdvs : []);
  };


  // Scroll to RDV list when selectedDate changes
  useEffect(() => {
    if (selectedDate && rdvListRef.current) {
      rdvListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDate]);

  // Handle accept/refuse
  const handleDecision = async (id, decision) => {
    try {
      await axios.patch(
        `http://localhost:3000/rendezvous/respond/${id}`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update both filteredRendezvous and events
      setFilteredRendezvous((prev) =>
        prev.map((rdv) =>
          rdv.id === id
            ? { ...rdv, status: decision === "accept" ? "confirmed" : "refused" }
            : rdv
        )
      );

      // Also update the events to reflect the count change
      setEvents(prevEvents => 
        prevEvents.map(event => {
          const updatedRdvs = event.extendedProps.rdvs.map(rdv =>
            rdv.id === id
              ? { ...rdv, status: decision === "accept" ? "confirmed" : "refused" }
              : rdv
          );
          
          return {
            ...event,
            title: `${updatedRdvs.length} RDV${updatedRdvs.length > 1 ? 's' : ''}`,
            extendedProps: {
              ...event.extendedProps,
              rdvs: updatedRdvs,
              count: updatedRdvs.length
            }
          };
        })
      );

      AlertService.success(
        "Succès",
        `Le rendez-vous a été ${decision === "accept" ? "accepté" : "refusé"} avec succès.`
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      AlertService.error(
        "Erreur", "Une erreur est survenue lors de la mise à jour du rendez-vous."
      );
    }
  };

  const handleCancelConsultation = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/rendezvous/${id}/cancelled`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFilteredRendezvous(prev =>
        prev.map(rdv =>
          rdv.id === id
            ? { ...rdv, consultationStatus: "cancelled" }
            : rdv
        )
      );

      AlertService.success("Succès", "La consultation a été annulée avec succès.");
    } catch (err) {
      console.error(err);
      AlertService.error("Erreur", "Impossible d’annuler la consultation.");
    }
  };


  return (
    <div className="doctor-calendar-page">
      <h2>🩺 Calendrier des Rendez-vous</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventColor="#1e40af"
        height="auto"
        locale={frLocale} 
      />

      {selectedDate && (
        <div className="rdv-list-container" ref={rdvListRef}>
          <h3>
            Rendez-vous du {selectedDate.toLocaleDateString("fr-FR")}
          </h3>

          {filteredRendezvous.length === 0 ? (
            <p>Aucun rendez-vous ce jour-là.</p>
          ) : (
            <table className="rdv-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Clinique</th>
                  <th>Heure</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRendezvous.map((rdv) => {
                  const time = new Date(rdv.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={rdv.id}>
                      <td>{rdv.patient?.user?.username || "Patient inconnu"}</td>
                      <td>{rdv.service?.name}</td>
                      <td>{rdv.clinic?.name}</td>
                      <td>{time}</td>
                      <td className={`status ${rdv.status}`}>
                        {translateStatus(rdv.status)}
                      </td>
                      <td>
                        {rdv.status === "pending" && (
                          <>
                            <button
                              className="accept-btn"
                              onClick={async () => {
                                const confirmed = await AlertService.confirm(
                                  "Confirmer l’acceptation",
                                  "Voulez-vous vraiment accepter ce rendez-vous ?"
                                );
                                if (confirmed) handleDecision(rdv.id, "accept");
                              }}
                            >
                              ✅ Accepter
                            </button>

                            <button
                              className="refuse-btn"
                              onClick={async () => {
                                const confirmed = await AlertService.confirm(
                                  "Confirmer le refus",
                                  "Voulez-vous vraiment refuser ce rendez-vous ?"
                                );
                                if (confirmed) handleDecision(rdv.id, "refuse");
                              }}
                            >
                              ❌ Refuser
                            </button>

                          </>
                        )}

                      {rdv.status === "confirmed" && (
                        <>
                          <button
                            className="accept-btn"
                            onClick={() =>
                              window.location.href = `/doctor/dossier/${rdv.patient.id}/${rdv.clinic.id}?rendezvousId=${rdv.id}`
                            }
                          >
                            🔍 Consulter
                          </button>
                          <button
                            className="refuse-btn"
                            onClick={async () => {
                              const confirmed = await AlertService.confirm(
                                "Annuler la consultation",
                                "Voulez-vous vraiment annuler cette consultation ?"
                              );
                              if (confirmed) handleCancelConsultation(rdv.id);  // ✅ CORRECT
                            }}
                          >
                            ❌ Annuler
                          </button>

                        </>
                      )}

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}