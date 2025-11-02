import React from 'react';
import './RendezVousList.css'; // Import du CSS spécifique à la liste des rendez-vous

export default function RendezVousList({ items = null }) {
  // ------------------- Données de démonstration -------------------
  const sample = [
    { id: 1, name: 'Mark Thompson', date: '08-04-2019', tag: 'Holiday request', status: 'open' },
    { id: 2, name: 'Tillie Carlson', date: '07-03-2019', tag: 'Certificate of employment', status: 'done' },
    { id: 3, name: 'Corey Gross', date: '04-17-2019', tag: 'Half-time application', status: 'pending' },
    { id: 4, name: 'Harriett McGuire', date: '07-07-2019', tag: 'Holiday request', status: 'open' },
    { id: 5, name: 'Larry Christensen', date: '04-18-2019', tag: 'Sick Leave', status: 'open' },
    { id: 6, name: 'Elnora Poole', date: '04-25-2019', tag: 'Certificate of employment', status: 'done' },
    { id: 7, name: 'Sally Rhodes', date: '03-11-2019', tag: 'Holiday request', status: 'done' },
    { id: 8, name: 'Phillip Ryan', date: '02-25-2019', tag: 'New Born', status: 'open' }
  ];

  // Si des items sont passés en props, on les utilise sinon on prend les données sample
  const list = items || sample;

  return (
    <div className="rv-container">
      <div className="rv-inner">
        {/* ------------------- Header de la liste ------------------- */}
        <div className="rv-header">
          <div className="nav">
            {/* Zone de navigation (vide ici) */}
          </div>

          <div className="meta">
            {/* Affichage du nombre de documents ouverts et bouton pour créer un nouveau cas */}
            <span>Open Documents</span>
            <button className="start-btn">Start new case</button>
          </div>
        </div>

        {/* ------------------- Liste des rendez-vous / documents ------------------- */}
        <div className="grid">
          {list.map((it) => (
            <article key={it.id} className="card">
              {/* Header de chaque carte */}
              <header className="top">
                <div className="date">{it.date}</div> {/* Date du rendez-vous ou document */}
                {/* Icône SVG représentant un élément graphique */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a4 4 0 000-8 5 5 0 00-9-2" />
                </svg>
              </header>

              {/* Nom du patient ou de la personne concernée */}
              <h3 className="name">{it.name}</h3>
              {/* Type de demande ou tag associé */}
              <p className="tag">{it.tag}</p>

              {/* Footer pour actions supplémentaires (vide ici) */}
              <footer className="footer">
                {/* Ici on pourrait ajouter des boutons ou statuts */}
              </footer>
            </article>
          ))}
        </div>

        {/* ------------------- Pagination / contrôle ------------------- */}
        <div className="pager">
          {/* Informations de pagination */}
          <div>Showing 1-8 of 12</div>
          <div className="controls">
            {/* Boutons de navigation */}
            <button className="btn">Previous</button>
            <button className="btn primary">Next</button>
            <button className="btn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
