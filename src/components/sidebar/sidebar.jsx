import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaHospital, FaUserMd, FaUsers, FaSignOutAlt } from "react-icons/fa";

const menu = [
  {to: "/admin", label: "Dashboard", icon: <FaTachometerAlt />},
  {to: "/admin/cliniques", label: "Cliniques", icon: <FaHospital />},
  {to: "/admin/medecins", label: "Médecins", icon: <FaUserMd />},
  {to: "/admin/patients", label: "Patients", icon: <FaUsers />},
];

export default function Sidebar(){
  return (
    <aside className="w-72 bg-sky-100 p-6 min-h-screen rounded-tr-2xl rounded-br-2xl shadow">
      <div className="mb-8">
        <img src="/assets/logo.png" alt="logo" className="h-12"/>
      </div>
      <nav className="flex flex-col gap-4">
        {menu.map(m => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-sky-300 font-bold" : "bg-sky-200"}`}
          >
            <div className="text-xl">{m.icon}</div>
            <span>{m.label}</span>
          </NavLink>
        ))}

        <button className="mt-6 flex items-center gap-3 p-3 bg-sky-200 rounded-lg">
          <FaSignOutAlt/> Déconnexion
        </button>
      </nav>
    </aside>
  );
}
