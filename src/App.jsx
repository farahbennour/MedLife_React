import { Route, Routes } from "react-router-dom";
import UpdateProfileAdmin from "./components/Admin/update-profile-admin/update-profile-admin.jsx";
import DashboardReceptionist from "./components/Receptionist/DashboardReceptionist/DashboardReceptionist.jsx";
import DashbordPatient from "./components/Patient/DashbordPatient/DashbordPatient.jsx";
import UpdateProfileDoctor from "./components/Doctor/update-profile-doctor/update-profile-doctor.jsx";
import Doctor from "./components/Admin/DoctorsList/Doctor.jsx";
import ForgotPassword from "./components/Forgot-password/forgot-password.jsx";
import AdminLayout from "./components/Layouts/adminLayout/adminLayout.jsx";
import PatientLayout from "./components/Layouts/PatientLayout/PatientLayout.jsx";
import Login from "./components/Login/login.jsx";
import UpdateProfilePatient from "./components/Patient/update-profile-patient/update-profile-patient.jsx";
import Patient from "./components/PatientList/Patient.jsx";
import Receptionist from "./components/Admin/ReceptionistList/Receptionist.jsx";
import RendezVousList from "./components/Patient/Rendez-VousList/Rendez-VousList.jsx";
import ResetPassword from "./components/ResetPassword/resetPassword.jsx";
import Services from "./components/Admin/Services-clinique/services.jsx";
import StaffService from "./components/Admin/Services-clinique/StaffService.jsx";
import Body from "./components/Home/Body/home.jsx";
import Dashboard from "./components/Admin/DashboardAdmin/dashboardadmin.jsx";
import Cliniques from "./components/Admin/cliniques/cliniques.jsx";
import DoctorLayout from "./components/Layouts/DoctorLayout/doctorLayout.jsx";
import ReceptionistLayout from "./components/Layouts/ReceptionistLayout/receptionistLayout.jsx";
import UpdateProfileReceptionist from "./components/Receptionist/update-profile-receptionist/update-profile-receptionist.jsx";
import ReceptionistRdvList from "./components/Receptionist/ReceptionistRdvList/ReceptionistRdvList.jsx";
import ReceptionistDoctors from "./components/Receptionist/ReceptionistDoctor/ReceptionistDoctor.jsx";
import DoctorCalendarWithList from "./components/Doctor/DoctorCalendarWithList/DoctorCalendarWithList.jsx";
import DoctorDossier from "./components/Doctor/DoctorDossier/DoctorDossier.jsx";
import DoctorPatientList from "./components/Doctor/DoctorPatientList/DoctorPatientList.jsx";
import PatientDossier from "./components/Patient/DossiersMedicaux/PatientDossier.jsx";
import PatientsDossiers from "./components/Admin/PatientsDossiers/PatientsDossiers.jsx";
import EmitFactureView from "./components/Receptionist/Facture/EmitFacture.jsx";
import PatientPayments from "./components/Patient/My-payments/my-payments.jsx";
import DoctorDashboard from "./components/Doctor/DoctorDashboard/DoctorDashboard.jsx";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Body />} />

          {/* Section ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cliniques" element={<Cliniques/>} />
            <Route path="cliniques/services" element={<Services />} />
            <Route path="staffservice" element={<StaffService />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="receptionist" element={<Receptionist />} />
            <Route path="patient" element={<Patient />} />
            <Route path="update-profile-admin" element={<UpdateProfileAdmin/>}/>{/* page de mise à jour de profil pour l'admin*/}
            <Route path="DossiersList" element={<PatientsDossiers />} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor" element={<DoctorLayout />}>
             <Route path="update-profile-doctor" element={<UpdateProfileDoctor/>}/>{/* page de mise à jour de profil pour le docteur*/}
             <Route path="rdvs" element={<DoctorCalendarWithList/>}/>
             <Route path="patients" element={<DoctorPatientList/>}/>
             <Route path="dashboard" element={<DoctorDashboard/>}/>
             <Route path="dossier/:patientId/:clinicId" element={<DoctorDossier/>}/>
          </Route>

        
         {/* Réceptionniste */}
          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route index element={<DashboardReceptionist />} /> {/*  Dashboard par défaut */}
            <Route path="dashboard" element={<DashbordPatient />} />
            <Route path="patient" element={<Patient />} />
            <Route path="update-profile-receptionist" element={<UpdateProfileReceptionist />}/>{/* page de mise à jour de profil pour le:la récéptioniiste*/}
            <Route path="rdvs" element={<ReceptionistRdvList />} />
            <Route path="doctors" element={<ReceptionistDoctors/>}/>
            <Route path="emit-facture" element={<EmitFactureView/>}/>
          </Route>

          {/* Patient Dashboard */}
         
           {/* Patient */}
       
         <Route path="/" element={<Body />} />

          {/* Patient */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<DashbordPatient />} />           {/* Dashboard par défaut */}
            <Route path="dashboard" element={<DashbordPatient />} />
            <Route path="rendezVousList" element={<RendezVousList />} /> {/* Page rendez-vous */}
            <Route path="update-profile" element={<UpdateProfilePatient />} /> {/* Profil */}
            <Route path="dossier-medical" element={<PatientDossier />} /> {/* Dossier Médical */}
            <Route path="my-payments" element={<PatientPayments/>} /> {/* Mes Paiements */ }
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