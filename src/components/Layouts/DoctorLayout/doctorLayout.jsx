import { Outlet } from "react-router-dom";
import SidebarDoctor from "../sidebarDoctor/sidebarDoctor.jsx";


export default function DoctorLayout(){
  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="flex-1 p-8 bg-white min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}