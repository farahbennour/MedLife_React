# MedLife — Plateforme intelligente pour la gestion des cliniques

> **MedLife** est une plateforme web complète permettant de digitaliser la gestion des cliniques, depuis la prise de rendez-vous jusqu’à la facturation, tout en offrant une interface fluide et sécurisée pour chaque acteur du système médical.

---

## 🌍 Vision du projet

Le projet **MedLife** vise à simplifier et automatiser la gestion quotidienne des cliniques, souvent marquée par des tâches administratives chronophages, des erreurs humaines et une faible communication entre les différents services.
Grâce à MedLife, toutes les opérations – création de comptes, gestion des patients, rendez-vous, consultations, ordonnances et paiements – sont regroupées dans une plateforme unifiée, intuitive et accessible.

Notre vision : **un environnement de soin connecté, efficace et sans papier.**

---

## ⚕️ Problématique

Les cliniques rencontrent souvent les problèmes suivants :

* Multiplication des registres et traitements manuels des données.
* Difficulté de coordination entre réceptionnistes, médecins et patients.
* Manque de visibilité sur les rendez-vous et les paiements.
* Absence de centralisation des dossiers médicaux et des ordonnances.

**MedLife** répond à ces défis par une approche numérique intégrée, fiable et évolutive.

---

## 💡 Solution proposée

La plateforme permet à chaque acteur d’interagir dans un environnement sécurisé :

* **L’administrateur** gère les services, médecins, réceptionnistes et supervise la clinique.
* **La réceptionniste** gère les patients et les factures, et supervise la bonne exécution des rendez-vous.
* **Le médecin** consulte les dossiers, effectue les consultations et rédige les ordonnances.
* **Le patient** prend lui-même ses rendez-vous, consulte ses ordonnances, paie ses factures et suit son historique médical.

Chaque action clé est accompagnée d’un **email automatique** : confirmation de rendez-vous, création de compte, paiement ou désactivation du compte en cas d’impayé.

---
## Logo

<p align="center">
  <img width="408" height="250" alt="logoFinal" src="https://github.com/user-attachments/assets/be81b10e-ddb5-425f-8c58-04fc2e4e2a10" />
</p>



## 🧩 Fonctionnalités principales

### 🔐 Authentification et rôles

* Connexion / Déconnexion sécurisée.
* Réinitialisation du mot de passe par email.
* Gestion des rôles (Admin, Médecin, Réceptionniste, Patient) avec guards côté frontend.

### 🏥 Administration (Admin)

* Création et configuration d’une clinique.
* Ajout, modification et suppression des médecins et réceptionnistes.
* Supervision globale des dossiers médicaux et des rendez-vous.

### 👩‍💼 Réceptionniste

* Ajout et affichage des patients dans le service concerné.
* Supervision de la liste des rendez-vous créés par les patients.
* Validation et affectation des rendez-vous au médecin concerné.
* Génération des factures selon les consultations effectuées.
* Envoi d’un **email de paiement** contenant le lien vers le règlement en ligne.
* Suivi des paiements et désactivation/réactivation des comptes selon l’état de paiement.

### 👨‍⚕️ Médecin

* Accès à la liste des rendez-vous affectés.
* Acceptation ou refus des rendez-vous selon disponibilité.
* Réalisation des consultations et saisie du diagnostic.
* Gestion des dossiers médicaux (Ajout / Modification / Suppression).
* Création et téléchargement des ordonnances (PDF).

### 👤 Patient

* Reçoit un **email automatique** avec ses identifiants après ajout par la réceptionniste.
* Se connecte à son espace personnel.
* **Crée ses propres rendez-vous** en choisissant un service et un médecin disponible.
* Reçoit un **email de confirmation** une fois le rendez-vous validé.
* Consulte la liste de ses rendez-vous et ordonnances.
* Télécharge ses documents médicaux et règle ses factures en ligne.
* Accède à son **historique de paiements** et de visites.

---

## 🧭 Parcours utilisateur global

1. Le **patient** reçoit un email de la réceptionniste contenant ses identifiants de connexion après enregistrement dans la base de données.
2. Le **patient** se connecte et choisit un service ainsi qu’un médecin disponible pour créer son rendez-vous.
3. La **réceptionniste** valide le rendez-vous et notifie le médecin concerné.
4. Le **médecin** consulte le dossier du patient, effectue la consultation et rédige l’ordonnance.
5. La **réceptionniste** émet une **facture** liée à cette consultation.
6. Le **patient** reçoit un **email de paiement**, règle sa facture et télécharge ses documents.
7. En cas de non-paiement, le compte du patient est **temporairement désactivé**, puis **réactivé automatiquement** après règlement.

---

## 🧠 Technologies utilisées

| Catégorie               | Technologie / Outil | Description                                                                                                   |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend**            | **React.js**        | Interface utilisateur dynamique et réactive.                                                                  |
| **Backend**             | **NestJS**          | Framework Node.js pour la création d’API REST sécurisées et modulaires.                                       |
| **Base de données**     | **MySQL**           | Système de gestion de base de données relationnelle.                                                          |
| **Outil de conception** | **Visual Paradigm** | Utilisé pour la modélisation UML, la conception de la base de données et les diagrammes de cas d’utilisation. |
| **Gestion de code**     | **GitHub**          | Plateforme de partage, versionnement et collaboration sur le code source.                                     |

---

## 📅 Planification des sprints

### **Sprint 1 : Authentification & Gestion de base**

* Login / Logout.
* Gestion des rôles et guards.
* Email de réinitialisation du mot de passe.
* Création d’une clinique (par Admin).
* CRUD Médecins et Réceptionnistes.
* Ajout et affichage des patients (par Réceptionniste).

### **Sprint 2 : Gestion des rendez-vous & consultations**

* Création d’un rendez-vous (par le Patient → choix service → médecin disponible).
* Validation et affectation des rendez-vous (Réceptionniste).
* Envoi d’un email de confirmation de rendez-vous.
* Agenda du médecin : accepter / refuser les rendez-vous.
* Consultation par le médecin sur les rendez-vous affectés.
* CRUD Dossiers médicaux.
* CRUD Ordonnances.

### **Sprint 3 : Profil, facturation et paiements**

* Mise à jour du profil pour tous les utilisateurs.
* Affichage des dossiers médicaux (Admin & Patient).
* Téléchargement des ordonnances (Patient).
* Génération et envoi de factures par la Réceptionniste.
* Paiement en ligne et gestion de l’historique (Patient).
* Système automatique de désactivation / réactivation selon paiement.

---

## 🔒 Sécurité et confidentialité

* Authentification par rôle avec guards frontend et backend.
* Gestion des accès selon les privilèges.
* Données médicales chiffrées et protégées.
* Notifications email sécurisées.

---

## 🌱 Impact du projet

* Réduction des tâches administratives.
* Meilleure coordination entre les membres du personnel médical.
* Amélioration de la qualité du suivi patient.
* Gain de temps et d’efficacité pour la clinique.
* Expérience utilisateur moderne et intuitive.

---

## 🔭 Évolutions futures

* Intégration d’un module de **messagerie interne sécurisée**.
* Ajout d’un **module analytique** pour statistiques et performance clinique.
* Application mobile (React Native) pour patients et médecins.
* Intégration d’un module de **notifications en temps réel**.

---

## 👥 Équipe projet

Le projet **MedLife** est développé par une équipe d’étudiants en informatique dans le cadre d’un projet académique.
L’objectif est d’appliquer des compétences techniques (React, NestJS, MySQL, GitHub, modélisation Visual Paradigm) à un cas d’usage réel du domaine médical.

---

## 📞 Contact

* **Projet** : MedLife — Plateforme de gestion clinique
* **Équipe** : BENNOUR Farah, ELKOUT Chayma et MANSOUR Abir
* **Encadrant** : BEN RHOUMA Mohamed Amine


---

