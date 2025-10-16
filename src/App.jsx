import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header.jsx";
import Home from "./components/home/home.jsx";
import AdminLayout from "./components/adminLayout/adminLayout.jsx";
import Footer from "./components/Footer/footer.jsx";


export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminLayout />}>
           
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
