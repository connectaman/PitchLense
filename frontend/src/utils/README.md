# Notification System

This project uses a combination of SweetAlert2 for dialogs and react-hot-toast for toast notifications to provide a modern and user-friendly notification experience.

## Features

- **SweetAlert2**: Beautiful, responsive, customizable and accessible replacement for JavaScript's popup boxes
- **React Hot Toast**: Lightweight toast notifications
- **Consistent Styling**: All notifications follow the project's design system
- **TypeScript Support**: Full type safety for all notification functions

## Usage

### Import the notification functions

```typescript
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
```

### Toast Notifications

Toast notifications appear in the top-right corner and automatically disappear after 4 seconds.

#### Success Toast
```typescript
showSuccessToast('Operation completed successfully!');
```

#### Error Toast
```typescript
showErrorToast('Something went wrong. Please try again.');
```

#### Warning Toast
```typescript
showWarningToast('Please check your input before proceeding.');
```

#### Info Toast
```typescript
showInfoToast('This is an informational message.');
```

### Confirmation Dialogs

Confirmation dialogs are modal popups that require user interaction.

#### Basic Confirmation
```typescript
const confirmed = await showConfirmDialog(
  'Delete Item',
  'Are you sure you want to delete this item?',
  'Delete',
  'Cancel'
);

if (confirmed) {
  // User clicked "Delete"
  deleteItem();
} else {
  // User clicked "Cancel"
  console.log('Operation cancelled');
}
```

### Alert Dialogs

Alert dialogs are modal popups that display information and require acknowledgment.

#### Success Dialog
```typescript
showSuccessDialog('Success!', 'Your changes have been saved successfully.');
```

#### Error Dialog
```typescript
showErrorDialog('Error!', 'Failed to save your changes. Please try again.');
```

#### Info Dialog
```typescript
showInfoDialog('Information', 'This feature is currently in beta.');
```

## Configuration

### Toast Configuration

Toasts are configured with:
- **Duration**: 4 seconds
- **Position**: Top-right corner
- **Style**: Dark background with white text

### SweetAlert2 Configuration

SweetAlert2 dialogs are configured with:
- **Confirm Button**: Blue color (#3B82F6)
- **Cancel Button**: Red color (#EF4444)
- **Border Radius**: 12px for popup, 8px for buttons
- **Font**: Inter font family

## Examples in Components

### ViewReports Component

```typescript
// Delete confirmation
const handleDeleteReport = async (e: React.MouseEvent, reportId: string) => {
  e.stopPropagation();
  
  const isConfirmed = await showConfirmDialog(
    'Delete Report',
    'Are you sure you want to delete this report? This action cannot be undone.',
    'Delete',
    'Cancel'
  );
  
  if (isConfirmed) {
    try {
      await reportService.deleteReport(reportId);
      showSuccessToast('Report deleted successfully');
      fetchReports();
    } catch (err: any) {
      showErrorToast(err.response?.data?.detail || 'Failed to delete report. Please try again.');
    }
  }
};
```

### CreateReport Component

```typescript
// Form validation
if (!startupName || !launchDate || !founderName || documents.length === 0) {
  showErrorToast('Please fill in all required fields and upload at least one document');
  return;
}

// Success notification
showSuccessToast('Report created successfully!');
```

## Testing

You can test all notification types using the `NotificationTest` component:

```typescript
import NotificationTest from '../components/NotificationTest';

// Add to any page for testing
<NotificationTest />
```

## Best Practices

1. **Use toasts for non-critical messages**: Success confirmations, info updates, warnings
2. **Use dialogs for critical actions**: Deletions, important confirmations
3. **Keep messages concise**: Toast messages should be short and clear
4. **Provide actionable feedback**: Tell users what happened and what they can do next
5. **Use appropriate types**: Success for positive outcomes, error for failures, warning for potential issues
