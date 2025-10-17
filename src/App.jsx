import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home.jsx";
import AdminLayout from "./components/adminLayout/adminLayout.jsx";
import DoctorLayout from "./components/DoctorLayout/doctorLayout.jsx";
import ReceptionistLayout from "./components/ReceptionistLayout/receptionistLayout.jsx";
import Login from "./components/Login/login.jsx";


export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
  
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/doctor/*" element={<DoctorLayout />} />
          <Route path="/receptionist/*" element={<ReceptionistLayout />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </main>
    
    </div>
  );
}
