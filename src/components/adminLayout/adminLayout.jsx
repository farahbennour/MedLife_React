import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";


export default function AdminLayout(){
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-white min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
