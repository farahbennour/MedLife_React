// src/services/alertService.js
import Swal from "sweetalert2";

const AlertService = {
  // ✅ Alerte de succès
  success: (title, text) => {
    Swal.fire({
      icon: "success",
      title: title || "Succès",
      text: text || "",
      confirmButtonColor: "#007BAE",
    });
  },

  // ❌ Alerte d’erreur
  error: (title, text) => {
    Swal.fire({
      icon: "error",
      title: title || "Erreur",
      text: text || "",
      confirmButtonColor: "#d33",
    });
  },

  // ⚠️ Alerte d’avertissement
  warning: (title, text) => {
    Swal.fire({
      icon: "warning",
      title: title || "Attention",
      text: text || "",
      confirmButtonColor: "#f39c12",
    });
  },

  // ℹ️ Alerte d’information
  info: (title, text) => {
    Swal.fire({
      icon: "info",
      title: title || "Information",
      text: text || "",
      confirmButtonColor: "#3085d6",
    });
  },

  // 🟢 Boîte de confirmation
  confirm: async (title, text) => {
    const result = await Swal.fire({
      title: title || "Êtes-vous sûr ?",
      text: text || "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007BAE",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    });
    return result.isConfirmed;
  },
};

export default AlertService;
