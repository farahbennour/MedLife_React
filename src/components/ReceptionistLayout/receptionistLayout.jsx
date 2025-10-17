import { Outlet } from "react-router-dom";
import SidebarReceptionist from "../sidebarReceptionist/sidebarReceptionist";


export default function ReceptionistLayout(){
  return (
    <div className="flex">
      <SidebarReceptionist />
      <div className="flex-1 p-8 bg-white min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
