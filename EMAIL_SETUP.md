# Email Integration Setup Guide

This guide will help you set up the email client integration in PitchLense.

## Prerequisites

- Node.js and npm installed
- Access to an email server (Hostinger or compatible IMAP/SMTP server)
- Email account credentials

## Installation Steps

### 1. Install Required npm Packages

Navigate to the backend directory and install the email dependencies:

```bash
cd backend
npm install imap mailparser nodemailer
```

These packages provide:
- **imap**: For fetching emails from IMAP servers
- **mailparser**: For parsing email content
- **nodemailer**: For sending emails via SMTP

### 2. Update Database Schema

Run the SQL migration to add email columns to the users table:

```sql
ALTER TABLE pitchlense.users 
ADD COLUMN IF NOT EXISTS email_username VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_password TEXT;
```

Or run the full setup script:

```bash
mysql -u your_user -p pitchlense < setup-database.sql
```

### 3. Configure Environment Variables

Update your `.env` file with the email server configuration:

```bash
# Email Server Configuration (Hostinger)
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
IMAP_ENCRYPTION=SSL

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_ENCRYPTION=SSL

POP_HOST=pop.hostinger.com
POP_PORT=995
POP_ENCRYPTION=SSL

# Optional: Set default credentials (can be overridden per user)
EMAIL_USERNAME=
EMAIL_PASSWORD=
```

### 4. Restart the Server

After installing dependencies and updating configuration:

```bash
cd backend
npm start
# or for development
npm run dev
```

## User Configuration

### First-Time Setup

1. Navigate to `/email.html` in your application
2. Click the **Settings** icon (⚙️) in the header
3. Enter your email credentials:
   - **Email Username**: Your full email address (e.g., user@yourdomain.com)
   - **Email Password**: Your email password or app password
4. Click **Test Connection** to verify the settings
5. Click **Save Settings** to store your credentials

### Security Notes

- Email passwords are stored encrypted in the database
- Credentials are sent over HTTPS
- Each user has their own email configuration
- The app uses secure SSL/TLS connections to email servers

## Features

### Email Fetching (IMAP)
- Automatically fetches emails from your inbox
- Shows unread indicators
- Displays attachments
- Preserves email threading

### Email Sending (SMTP)
- Compose new emails
- Reply to emails
- Forward emails
- Use pre-built templates
- Attach files (planned)

### Email Templates
Available templates:
- **Follow Up**: Professional follow-up email
- **Meeting Request**: Request a meeting with someone
- **Thank You**: Thank you email after a meeting
- **Proposal**: Send a business proposal

### Search & Filter
- Search by sender, subject, or content
- Real-time filtering
- Case-insensitive search

## API Endpoints

The following API endpoints are available:

### GET `/api/emails`
Fetch emails from the server
- **Auth**: Required (cookie-based)
- **Query Params**: 
  - `limit` (optional): Number of emails to fetch (default: 50)

### POST `/api/emails/send`
Send an email
- **Auth**: Required
- **Body**:
  ```json
  {
    "to": "recipient@example.com",
    "subject": "Email Subject",
    "body": "Email body content",
    "replyTo": "message-id" (optional),
    "useLlm": false (optional)
  }
  ```

### POST `/api/emails/settings`
Update email credentials
- **Auth**: Required
- **Body**:
  ```json
  {
    "email_username": "your@email.com",
    "email_password": "your_password"
  }
  ```

### GET `/api/emails/settings`
Get current email configuration
- **Auth**: Required
- **Returns**: `{ email_username, configured }`

### POST `/api/emails/test-connection`
Test email server connection
- **Auth**: Required
- **Returns**: Success or error message

## Troubleshooting

### Connection Failed
- Verify your email credentials are correct
- Check that your email provider allows IMAP/SMTP access
- Some providers require app-specific passwords (Gmail, Outlook)
- Ensure firewall isn't blocking ports 993 (IMAP) or 465 (SMTP)

### No Emails Loading
- Check that email credentials are configured in settings
- Verify the IMAP server is accessible
- Check console for error messages
- Try refreshing the page

### Can't Send Emails
- Verify SMTP credentials are correct
- Check that port 465 is not blocked
- Some providers have rate limits on sending
- Check if your email provider requires additional authentication

### SSL/TLS Errors
- Ensure `tlsOptions: { rejectUnauthorized: false }` is set for self-signed certificates
- Update to the latest Node.js version
- Check if your email provider supports SSL/TLS

## Custom Email Providers

To use a different email provider, update the environment variables:

### Gmail
```bash
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```
**Note**: Gmail requires app-specific passwords. Enable 2FA and generate an app password.

### Outlook/Office 365
```bash
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
```

### Yahoo
```bash
IMAP_HOST=imap.mail.yahoo.com
IMAP_PORT=993
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
```

## Future Enhancements

- [ ] Email attachment download support
- [ ] Rich text (HTML) email composition
- [ ] Email threading and conversations
- [ ] Email folders (Sent, Drafts, Trash)
- [ ] Mark as read/unread
- [ ] Delete emails
- [ ] Email labels/tags
- [ ] LLM processing integration for email content analysis
- [ ] Email scheduling
- [ ] Email signatures
- [ ] Auto-reply/Out of office

## Support

For issues or questions, please refer to:
- Main README.md
- CONTRIBUTING.md
- Create an issue on GitHub

---

**Note**: This email integration is designed for business use within PitchLense. Always follow email best practices and respect privacy regulations (GDPR, CAN-SPAM, etc.) when using automated email systems.

