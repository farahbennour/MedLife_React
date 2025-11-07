import { Outlet } from "react-router-dom";
import Header from "../../Home/header/header.jsx";




export default function PatientLayout(){
  return (
     <div className="flex min-h-screen">
      {/* Sidebar - fixed width */}
      <div className="w-72 fixed left-0 top-0 h-screen z-40">
        <Header />
      </div>
      
      {/* Main Content - offset by sidebar width */}
      <div className="flex-1 ml-72 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}