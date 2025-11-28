// components/ProtectedRoute/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      // Vider le localStorage et rediriger vers login avec SweetAlert
      localStorage.clear();
      Swal.fire({
        icon: 'warning',
        title: 'Accès non autorisé',
        text: 'Vous devez être connecté pour accéder à cette page',
        confirmButtonText: 'Se connecter',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      // Vider le localStorage et rediriger vers login avec SweetAlert
      localStorage.clear();
      Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: "Vous n'êtes pas autorisé à accéder à cet espace",
        confirmButtonText: 'Compris',
        confirmButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
  }, [navigate, allowedRoles]);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;