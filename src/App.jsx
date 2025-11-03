import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/home.jsx";
import AdminLayout from "./components/adminLayout/adminLayout.jsx";
import DoctorLayout from "./components/DoctorLayout/doctorLayout.jsx";
import ReceptionistLayout from "./components/ReceptionistLayout/receptionistLayout.jsx";
import Login from "./components/Login/login.jsx";
import ResetPassword from "./components/ResetPassword/resetPassword.jsx";
import ForgotPassword from "./components/Forgot-password/forgot-password.jsx";
import Dashboard from "./components/DashboardAdmin/dashboardadmin.jsx";
import Cliniques from "./components/cliniques/cliniques.jsx";
import StaffService from "./components/services/StaffService.jsx";
import Services from "./components/services/services.jsx";
import Doctor from "./components/DoctorsList/Doctor.jsx";
import Receptionist from "./components/ReceptionistList/Receptionist.jsx";
import Patient from "./components/PatientList/Patient.jsx";
import DashbordPatient from "./components/DashbordPatient/DashbordPatient.jsx"; 
import DashboardReceptionist from "./components/DashboardReceptionist/DashboardReceptionist.jsx";
import PatientLayout from "./components/PatientLayout/PatientLayout.jsx";
import RendezVousList from "./components/RendezVousList/RendezVousList.jsx";
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />

          {/* Section ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cliniques" element={<Cliniques />} />
            <Route path="cliniques/services" element={<Services />} />
            <Route path="staffservice" element={<StaffService />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="receptionist" element={<Receptionist />} />
            <Route path="patient" element={<Patient />} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor/*" element={<DoctorLayout />} />

          {/* Réceptionniste */}
         {/* Réceptionniste */}
          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route index element={<DashboardReceptionist />} /> {/*  Dashboard par défaut */}
             <Route path="dashboard" element={<DashbordPatient />} />
            <Route path="patient" element={<Patient />} />
          </Route>

          {/* Patient Dashboard */}
         
           {/* Patient */}
        <Route path="/patient/*" element={<PatientLayout />}>
          <Route index element={<DashbordPatient />} />
          <Route path="rendezVousList" element={<RendezVousList />} /> {/* page rendez-vous */}
          <Route path="profil" element={<Patient />} /> {/* page profil */}
        </Route>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    </div>
  );
}
