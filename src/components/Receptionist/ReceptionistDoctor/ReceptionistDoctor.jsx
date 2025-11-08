import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReceptionistDoctor.css';  

const ReceptionistDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token'); // your JWT
        const res = await axios.get('http://localhost:3000/rendezvous/receptionist/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des docteurs');
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="receptionist-doctors-container">
      <h1>Liste des Docteurs</h1>

      {error && <p className="receptionist-doctors-message error">{error}</p>}

      <div className="receptionist-doctors-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className="receptionist-doctor-card">
              <div className="receptionist-doctor-header">
                <h2>{doctor.user?.username || 'Docteur'}</h2>
                <p className="receptionist-doctor-specialty">{doctor.specialty}</p>
              </div>
              <div className="receptionist-doctor-body">
                <p><strong>Email:</strong> {doctor.user?.email}</p>
                <p><strong>Clinique:</strong> {doctor.clinic?.name}</p>
                <p><strong>Service:</strong> {doctor.service?.name}</p>
              </div>
            </div>
          ))
        ) : (
          !error && <p className="receptionist-doctors-message">Aucun docteur trouvé</p>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDoctors;
