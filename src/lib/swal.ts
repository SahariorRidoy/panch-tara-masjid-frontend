import Swal from "sweetalert2";

const primary = process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? "#1a7a4a";
const accent = process.env.NEXT_PUBLIC_ACCENT_COLOR ?? "#d4a017";

export const swal = {
  success: (title: string, text?: string) =>
    Swal.fire({ icon: "success", title, text, confirmButtonColor: primary, timer: 2000, timerProgressBar: true, showConfirmButton: false }),

  error: (title: string, text?: string) =>
    Swal.fire({ icon: "error", title, text, confirmButtonColor: primary, allowOutsideClick: true, allowEnterKey: false }),

  confirmDelete: (itemName = "this item") =>
    Swal.fire({
      title: "Delete Confirmation",
      html: `Are you sure you want to delete <strong>${itemName}</strong>?<br/><small class="text-gray-500">This action cannot be undone.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    }),

  confirm: (title: string, text?: string) =>
    Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: primary,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Confirm",
    }),

  loading: (title = "Saving...") =>
    Swal.fire({ title, allowOutsideClick: false, didOpen: () => Swal.showLoading(), showConfirmButton: false }),

  close: () => Swal.close(),
};

export default swal;
