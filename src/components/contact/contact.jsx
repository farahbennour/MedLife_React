import './contact.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AlertService from '../../Services/Alert';

export default function ContactForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setEmail(res.data.email || '');
      } catch (err) {
        console.error('Erreur récupération utilisateur:', err);
        AlertService.error('Impossible de récupérer les informations de l’utilisateur.');
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      AlertService.error('Utilisateur non identifié.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/contacts/${userId}`,
        { subject, message, email },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      AlertService.success('Message envoyé avec succès !');
      setSubject('');
      setMessage('');
      if (!user) setEmail('');
    } catch (err) {
      console.error('Erreur envoi message:', err);
      AlertService.error('Erreur lors de l\'envoi du message.');
    }
  };

  return (
    <div className="contact-container">
      {/* Titre principal */}
      <h2>Contactez-nous</h2>

      {/* Sous-conteneur pour les colonnes */}
      <div className="contact-columns">
        <div className="contact-info">
          <h3 className="email">Email : MedLifeDM@gmail.com</h3>
          <h3 className="phone">Téléphone : +216 ** *** ***</h3>
          <h3 className="copy">Copyright © 2025 MedLife</h3>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sujet</label>
            <input
              type="text"
              placeholder="Sujet"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!user}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
}
