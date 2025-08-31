import React from 'react';
import { 
  showConfirmDialog, 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast,
  showSuccessDialog,
  showErrorDialog,
  showInfoDialog
} from '../utils/notifications';

const NotificationTest: React.FC = () => {
  const handleTestConfirm = async () => {
    const confirmed = await showConfirmDialog(
      'Test Confirmation',
      'This is a test confirmation dialog. Do you want to proceed?',
      'Yes, Proceed',
      'No, Cancel'
    );
    
    if (confirmed) {
      showSuccessToast('You confirmed the action!');
    } else {
      showInfoToast('You cancelled the action.');
    }
  };

  const handleTestToasts = () => {
    showSuccessToast('This is a success toast notification!');
    setTimeout(() => showErrorToast('This is an error toast notification!'), 1000);
    setTimeout(() => showWarningToast('This is a warning toast notification!'), 2000);
    setTimeout(() => showInfoToast('This is an info toast notification!'), 3000);
  };

  const handleTestDialogs = () => {
    showSuccessDialog('Success!', 'This is a success dialog.');
    setTimeout(() => showErrorDialog('Error!', 'This is an error dialog.'), 2000);
    setTimeout(() => showInfoDialog('Info!', 'This is an info dialog.'), 4000);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Notification Test Component</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleTestConfirm}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Test Confirmation Dialog
        </button>
        
        <button
          onClick={handleTestToasts}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg ml-4"
        >
          Test Toast Notifications
        </button>
        
        <button
          onClick={handleTestDialogs}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg ml-4"
        >
          Test Alert Dialogs
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;
