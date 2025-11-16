import axios from 'axios';
import { useEffect, useState } from 'react';
import './EmitFacture.css';

export default function EmitFactureView() {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [items, setItems] = useState([{ description: '', amount: 0 }]);
  const [dueDate, setDueDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  // 🔹 Récupérer les consultations à l'initialisation
  useEffect(() => {
    async function fetchConsultations() {
      try {
        const res = await axios.get(
          'http://localhost:3000/consultation/my-service',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConsultations(res.data.consultations || []);
      } catch (err) {
        console.error('Erreur fetching consultations:', err.response?.data || err.message);
      }
    }
    fetchConsultations();
  }, [token]);

  const addItem = () => setItems([...items, { description: '', amount: 0 }]);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'amount' ? parseFloat(value) : value;
    setItems(newItems);
  };

  const handleEmitFacture = async () => {
    if (!selectedConsultation) return alert('Veuillez sélectionner une consultation');
    if (!items.length || items.some(i => !i.description || !i.amount)) {
      return alert('Veuillez remplir tous les items avec un montant valide');
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/consultation/${selectedConsultation.consultationId}/emit-facture`,
        { items, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Facture émise avec succès !');
      console.log(res.data);

      // Reset formulaire
      setSelectedConsultation(null);
      setItems([{ description: '', amount: 0 }]);
      setDueDate('');
      setModalOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Erreur lors de l'émission de la facture");
    }
  };
  const getStatusColor = (status) => {
  switch (status) {
    case 'Payé':
      return 'green';
    case 'En attente':
      return 'orange';
    case 'Annulé':
      return 'red';
    case 'Non émise':
    default:
      return 'gray';
  }
};


  return (
    <div className="facture-container">
      <div className="facture-header">
        <h2 className="facture-title">Les Consultations</h2>
      </div>

      {/* Consultation Cards */}
   
            <div className="facture-cards-container">
        {consultations.map(c => (
            <div className="facture-card" key={c.consultationId}>
            <h3>{c.patientName ?? 'Patient inconnu'}</h3>
            <p>Date: {c.consultationDate ? new Date(c.consultationDate).toLocaleDateString() : 'N/A'}</p>
            <p>Médecin: {c.doctorName ?? 'Médecin inconnu'}</p>
            <p>
                Statut du paiement:{' '}
                <strong style={{ color: getStatusColor(c.paymentStatus) }}>
                {c.paymentStatus ?? 'Non émise'}
                </strong>
            </p>
            {c.dueDate && <p>Date d'échéance: <strong>{new Date(c.dueDate).toLocaleDateString()}</strong></p>}
            <button
                className="facture-select-btn"
                onClick={() => {
                setSelectedConsultation(c);
                setModalOpen(true);
                }}
            >
                Émettre Facture
            </button>
            </div>
        ))}
        </div>
      


      {/* Modal */}
      {modalOpen && selectedConsultation && (
        <div className="facture-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="facture-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Émettre facture pour {selectedConsultation.patientName ?? 'Patient inconnu'}</h3>

            {/* Items */}
            {items.map((item, idx) => (
              <div className="facture-item" key={idx}>
                <label>Description :</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={e => updateItem(idx, 'description', e.target.value)}
                />
                <label>Montant :</label>
                <input
                  type="number"
                  placeholder="Montant"
                  value={item.amount}
                  onChange={e => updateItem(idx, 'amount', e.target.value)}
                />
              </div>
            ))}

            {/* Ajouter un item */}
            {/* <button className="facture-add-item-btn" onClick={addItem}>
              Ajouter un item
            </button> */}

            {/* Date d'échéance */}
            <div className="facture-item">
              <label>Date d'échéance :</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="facture-modal-actions">
              <button className="facture-submit-btn" onClick={handleEmitFacture}>
                Émettre Facture
              </button>
              <button className="facture-back-btn" onClick={() => setModalOpen(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
