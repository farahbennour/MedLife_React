import { Route, Routes } from "react-router-dom";
import Cliniques from "./components/Admin/cliniques/cliniques.jsx";
import Dashboard from "./components/Admin/DashboardAdmin/dashboardadmin.jsx";
import Doctor from "./components/Admin/DoctorsList/Doctor.jsx";
import PatientListAdmin from "./components/Admin/PatientListAdmin/PatientListAdmin.jsx";
import PatientsDossiers from "./components/Admin/PatientsDossiers/PatientsDossiers.jsx";
import Receptionist from "./components/Admin/ReceptionistList/Receptionist.jsx";
import Services from "./components/Admin/Services-clinique/services.jsx";
import StaffService from "./components/Admin/Services-clinique/StaffService.jsx";
import UpdateProfileAdmin from "./components/Admin/update-profile-admin/update-profile-admin.jsx";
import DoctorCalendarWithList from "./components/Doctor/DoctorCalendarWithList/DoctorCalendarWithList.jsx";
import DoctorDashboard from "./components/Doctor/DoctorDashboard/DoctorDashboard.jsx";
import DoctorDossier from "./components/Doctor/DoctorDossier/DoctorDossier.jsx";
import DoctorPatientList from "./components/Doctor/DoctorPatientList/DoctorPatientList.jsx";
import UpdateProfileDoctor from "./components/Doctor/update-profile-doctor/update-profile-doctor.jsx";
import ForgotPassword from "./components/Forgot-password/forgot-password.jsx";
import Body from "./components/Home/Body/home.jsx";
import AdminLayout from "./components/Layouts/adminLayout/adminLayout.jsx";
import DoctorLayout from "./components/Layouts/DoctorLayout/doctorLayout.jsx";
import PatientLayout from "./components/Layouts/PatientLayout/PatientLayout.jsx";
import ReceptionistLayout from "./components/Layouts/ReceptionistLayout/receptionistLayout.jsx";
import Login from "./components/Login/login.jsx";
import DashbordPatient from "./components/Patient/DashbordPatient/DashbordPatient.jsx";
import PatientDossier from "./components/Patient/DossiersMedicaux/PatientDossier.jsx";
import PatientPayments from "./components/Patient/My-payments/my-payments.jsx";
import RendezVousList from "./components/Patient/Rendez-VousList/Rendez-VousList.jsx";
import UpdateProfilePatient from "./components/Patient/update-profile-patient/update-profile-patient.jsx";
import Patient from "./components/PatientList/Patient.jsx";
import DashboardReceptionist from "./components/Receptionist/DashboardReceptionist/DashboardReceptionist.jsx";
import EmitFactureView from "./components/Receptionist/Facture/EmitFacture.jsx";
import ReceptionistDoctors from "./components/Receptionist/ReceptionistDoctor/ReceptionistDoctor.jsx";
import ReceptionistRdvList from "./components/Receptionist/ReceptionistRdvList/ReceptionistRdvList.jsx";
import UpdateProfileReceptionist from "./components/Receptionist/update-profile-receptionist/update-profile-receptionist.jsx";
import ResetPassword from "./components/ResetPassword/resetPassword.jsx";
import ContactForm from "./components/contact/contact.jsx";
import ProtectedRoute from "./components/Guards/ProtectedRoute.jsx";
import About from "./components/à-propos/about.jsx";
import PaymentSuccess from "./components/Patient/payment-status/payment-success.jsx";
import PaymentCancel from "./components/Patient/payment-status/payment-cancel.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Body />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<ContactForm/>}/>
          <Route path="/a-propos" element={<About/>}/>
                    

          {/* Section ADMIN */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cliniques" element={<Cliniques/>} />
            <Route path="cliniques/services" element={<Services />} />
            <Route path="staffservice" element={<StaffService />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="receptionist" element={<Receptionist />} />
            <Route path="patientList" element={<PatientListAdmin />} />
            <Route path="update-profile-admin" element={<UpdateProfileAdmin/>}/>
            <Route path="DossiersList" element={<PatientsDossiers />} />
          </Route>

          {/* Section DOCTOR */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorLayout />
            </ProtectedRoute>
          }>
            <Route path="update-profile-doctor" element={<UpdateProfileDoctor/>}/>
            <Route path="rdvs" element={<DoctorCalendarWithList/>}/>
            <Route path="patients" element={<DoctorPatientList/>}/>
            <Route path="dashboard" element={<DoctorDashboard/>}/>
            <Route path="dossier/:patientId/:clinicId" element={<DoctorDossier/>}/>
          </Route>

          {/* Section RECEPTIONIST */}
          <Route path="/receptionist" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardReceptionist />} />
            <Route path="dashboard" element={<DashboardReceptionist />} />
            <Route path="patient" element={<Patient />} />
            <Route path="update-profile-receptionist" element={<UpdateProfileReceptionist />}/>
            <Route path="rdvs" element={<ReceptionistRdvList />} />
            <Route path="doctors" element={<ReceptionistDoctors/>}/>
            <Route path="emit-facture" element={<EmitFactureView/>}/>
          </Route>

          {/* Section PATIENT */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashbordPatient />} />
            <Route path="dashboard" element={<DashbordPatient />} />
            <Route path="rendezVousList" element={<RendezVousList />} />
            <Route path="update-profile" element={<UpdateProfilePatient />} />
            <Route path="dossier-medical" element={<PatientDossier />} />
            <Route path="my-payments" element={<PatientPayments/>} />
            <Route path="payment-success" element={<PaymentSuccess/>}/>
                    <Route path="payment-cancel" element={<PaymentCancel/>}/>
            
          </Route>
        </Routes>
      </main>
    </div>
  );
}