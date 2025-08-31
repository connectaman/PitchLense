import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

// SweetAlert2 configurations
const swalConfig = {
  confirmButtonColor: '#3B82F6', // Blue
  cancelButtonColor: '#EF4444', // Red
  confirmButtonText: 'Yes',
  cancelButtonText: 'Cancel',
};

// Toast configurations
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#363636',
    color: '#fff',
  },
};

// Success toast
export const showSuccessToast = (message: string) => {
  toast.success(message, toastConfig);
};

// Error toast
export const showErrorToast = (message: string) => {
  toast.error(message, toastConfig);
};

// Warning toast
export const showWarningToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: '⚠️',
  });
};

// Info toast
export const showInfoToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: 'ℹ️',
  });
};

// Confirmation dialog
export const showConfirmDialog = async (
  title: string,
  text: string,
  confirmText: string = 'Yes',
  cancelText: string = 'Cancel'
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: swalConfig.confirmButtonColor,
    cancelButtonColor: swalConfig.cancelButtonColor,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
};

// Success dialog
export const showSuccessDialog = (title: string, text: string) => {
  Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: swalConfig.confirmButtonColor,
  });
};

// Error dialog
export const showErrorDialog = (title: string, text: string) => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: swalConfig.confirmButtonColor,
  });
};

// Info dialog
export const showInfoDialog = (title: string, text: string) => {
  Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: swalConfig.confirmButtonColor,
  });
};
