import React from "react";
import "./footer.css";

export default function Footer(){
  return (
    <footer className="bg-sky-100">
      <div className="container mx-auto px-4 py-8 flex justify-between">
        <div className="contact-info">
          <h3>Email : MedLifeDM@gmail.com</h3>
          <h3>Téléphone : +216 ** *** ***</h3>
          <h3>Copyright © 2025 MedLife</h3>
        </div>
        <div>
          <h4 className="reseau">Réseaux Sociaux</h4>
          <div className="flex gap-3 mt-2">
           <img src="/src/assets/facebook.png" alt="Facebook" className="h-8 w-8"/>
              <img src="/src/assets/instagram.png" alt="Instagram" className="h-8 w-8"/>
                <img src="/src/assets/youtube.png" alt="YouTube" className="h-8 w-8"/>
                    <img src="/src/assets/linkedin.png" alt="LinkedIn" className="h-8 w-8"/>
          </div>
        </div>
      </div>
    </footer>
  );
}
