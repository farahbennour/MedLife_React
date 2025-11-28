// src/components/Guards/RoleRoute.jsx
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ allowedRoles, children }) {
  return (
    <ProtectedRoute>
      {(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          return <Navigate to="/login" replace />;
        }

        const user = JSON.parse(userStr);

        if (!user || !user.role || !allowedRoles.includes(user.role)) {
          // Redirection vers le dashboard approprié si l'utilisateur n'a pas les droits
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
              return <Navigate to="/login" replace />;
          }
        }

        return children;
      })()}
    </ProtectedRoute>
  );
}