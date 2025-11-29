// src/components/Guards/RootGuard.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function RootGuard({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // Routes publiques (accessibles sans connexion)
  const publicRoutes = [
    "/", 
    "/login", 
    "/forgot-password", 
    "/reset-password"
  ];
  
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Si l'utilisateur est connecté et tente d'accéder à une route publique
  if (user && isPublicRoute) {
    // Redirection vers le dashboard selon le rôle
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "doctor":
        return <Navigate to="/doctor/dashboard" replace />;
      case "patient":
        return <Navigate to="/patient/dashboard" replace />;
      case "receptionist":
        return <Navigate to="/receptionist/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
  if (!user && !isPublicRoute) {
    // Stocker la route demandée pour redirection après login
    return <Navigate to="/login" replace state={{ 
      from: location.pathname,
      message: "Vous n'avez pas accès à cet espace. Veuillez vous connecter."
    }} />;
  }

  return children;
}