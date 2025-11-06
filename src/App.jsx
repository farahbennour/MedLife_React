import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/DashboardAdmin/dashboardadmin.jsx";
import DashboardReceptionist from "./components/DashboardReceptionist/DashboardReceptionist.jsx";
import DashbordPatient from "./components/DashbordPatient/DashbordPatient.jsx";
import DoctorLayout from "./components/DoctorLayout/doctorLayout.jsx";
import Doctor from "./components/DoctorsList/Doctor.jsx";
import ForgotPassword from "./components/Forgot-password/forgot-password.jsx";
import Login from "./components/Login/login.jsx";
import PatientLayout from "./components/PatientLayout/PatientLayout.jsx";
import Patient from "./components/PatientList/Patient.jsx";
import ReceptionistLayout from "./components/ReceptionistLayout/receptionistLayout.jsx";
import Receptionist from "./components/ReceptionistList/Receptionist.jsx";
import RendezVousList from "./components/RendezVousList/RendezVousList.jsx";
import ResetPassword from "./components/ResetPassword/resetPassword.jsx";
import StaffService from "./components/Services-clinique/StaffService.jsx";
import AdminLayout from "./components/adminLayout/adminLayout.jsx";
import Cliniques from "./components/cliniques/cliniques.jsx";
import Home from "./components/home/home.jsx";
import Services from "./components/Services-clinique/services.jsx";

import UpdateProfileAdmin from "./components/update-profile-admin/update-profile-admin.jsx";
import UpdateProfileDoctor from "./components/update-profile-doctor/update-profile-doctor.jsx";
import UpdateProfileReceptionist from "./components/update-profile-receptionist/update-profile-receptionist.jsx";
import UpdateProfilePatient from "./components/update-profile-patient/update-profile-patient.jsx";
import Header from "./components/header/header.jsx";

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
            <Route path="update-profile-admin" element={<UpdateProfileAdmin/>}/>{/* page de mise à jour de profil pour l'admin*/}
          </Route>

          {/* Doctor */}
          <Route path="/doctor" element={<DoctorLayout />}>
             <Route path="update-profile-doctor" element={<UpdateProfileDoctor/>}/>{/* page de mise à jour de profil pour le docteur*/}
          </Route>

          {/* Réceptionniste */}
         {/* Réceptionniste */}
          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route index element={<DashboardReceptionist />} /> {/*  Dashboard par défaut */}
             <Route path="dashboard" element={<DashbordPatient />} />
            <Route path="patient" element={<Patient />} />
            <Route path="update-profile-receptionist" element={<UpdateProfileReceptionist />}/>{/* page de mise à jour de profil pour le:la récéptioniiste*/}
         
          </Route>

          {/* Patient Dashboard */}
         
           {/* Patient */}
       
         <Route path="/" element={<Home />} />

          {/* Patient */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<DashbordPatient />} />           {/* Dashboard par défaut */}
            <Route path="dashboard" element={<DashbordPatient />} />
            <Route path="rendezVousList" element={<RendezVousList />} /> {/* Page rendez-vous */}
            <Route path="update-profile" element={<UpdateProfilePatient />} /> {/* Profil */}
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
