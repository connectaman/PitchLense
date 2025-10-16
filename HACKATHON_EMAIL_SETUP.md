# Hackathon Email Setup - Centralized Email Server

## 🎯 Perfect for Hackathon Demos!

This email integration uses a **single shared email account** (`contact@amanulla.in`) for all users. No database changes, no user credentials needed!

## How It Works

### Centralized Architecture
```
┌─────────────────────────────────────────────────┐
│           PitchLense Users                       │
├──────────┬──────────┬──────────┬─────────────────┤
│ user1@   │ user2@   │ user3@   │ ...              │
│ email.com│ email.com│ email.com│                  │
└────┬─────┴────┬─────┴────┬─────┴──────────────┘
     │          │          │
     └──────────┴──────────┘
              │
              ▼
     ┌────────────────────┐
     │  contact@amanulla.in│ ← Single Shared Email
     │  (IMAP/SMTP Server) │
     └────────────────────┘
              │
              ▼
     ┌────────────────────┐
     │    Recipients       │
     └────────────────────┘
```

### Features

✅ **All emails sent from**: `contact@amanulla.in`
✅ **Sender shown as**: `user@email.com via PitchLense`
✅ **No user credentials**: Just one password in `.env`
✅ **No database changes**: Zero schema modifications
✅ **Perfect for demos**: Simple, fast setup

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install imap mailparser nodemailer
```

### 2. Configure Environment
Create a `.env` file in the project root:

```env
# Email Server Configuration
EMAIL_USERNAME=contact@amanulla.in
EMAIL_PASSWORD=your_password_here

# Server Settings (Hostinger)
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

**Important**: Replace `your_password_here` with the actual password for `contact@amanulla.in`

### 3. Restart Server
```bash
cd backend
npm start
```

### 4. Test It Out!
1. Go to `/email.html` in your app
2. Click Settings to see the configuration
3. The email server is ready to use!

## How Users Interact

### Sending Email

**User Action**: Alice (alice@company.com) sends email to bob@client.com

**What Happens**:
1. Email sent from `contact@amanulla.in`
2. From header shows: `"alice@company.com via PitchLense" <contact@amanulla.in>`
3. Email body includes: `[Sent by: alice@company.com]`
4. Bob receives email from `contact@amanulla.in`
5. Bob sees Alice's email in the sender info

**Email Format**:
```
From: alice@company.com via PitchLense <contact@amanulla.in>
To: bob@client.com
Subject: Meeting Request

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent by: alice@company.com via PitchLense
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi Bob,

I'd like to schedule a meeting...

Best regards,
Alice
```

### Receiving Email

**All users see the same inbox**: `contact@amanulla.in`
- Perfect for testing demo scenarios
- Users can see all emails sent to the shared account
- Great for showcasing email threading and management

## Use Cases

### 1. Hackathon Demo
Perfect for showing off features without complex multi-user setup:
- Quick setup (5 minutes)
- No credential management needed
- Focus on features, not infrastructure

### 2. Testing Environment
Great for development and testing:
- Single test account
- Easy to debug
- No spam in personal inboxes

### 3. Contact Form Alternative
Use as a contact form backend:
- All inquiries go to one place
- Easy to manage responses
- Professional email handling

## Email Templates

The system includes pre-built templates:
- **Follow Up**: Professional follow-up template
- **Meeting Request**: Schedule meetings
- **Thank You**: Post-meeting thank you
- **Proposal**: Send business proposals

## Security Considerations

### ✅ Suitable For:
- Hackathons and demos
- Development environments
- Internal testing
- Proof of concepts

### ⚠️ Not Recommended For:
- Production with real users
- Sensitive communications
- Multi-tenant production apps
- Compliance-required systems

### Production Alternative
For production, switch to per-user email accounts:
```javascript
// Store each user's email credentials
// Use database or encrypted storage
// Separate IMAP/SMTP connections per user
```

## Advantages

✅ **Zero Database Changes**: No schema modifications needed
✅ **Simple Setup**: One password in `.env`
✅ **Fast Demo**: Ready in 5 minutes
✅ **No User Onboarding**: Users don't enter credentials
✅ **Easy Maintenance**: Single account to manage
✅ **Cost Effective**: One email account for everyone

## Limitations

⚠️ **Shared Inbox**: All users see all emails
⚠️ **Single Password**: Must be kept secure
⚠️ **Rate Limits**: Email provider limits apply to all users
⚠️ **Identity Management**: Recipients see shared email address

## Technical Details

### Backend Implementation
```javascript
// All users share the same IMAP/SMTP config
function getEmailConfig() {
  return {
    imap: {
      user: 'contact@amanulla.in',
      password: process.env.EMAIL_PASSWORD,
      host: 'imap.hostinger.com',
      port: 993
    },
    smtp: {
      host: 'smtp.hostinger.com',
      port: 465,
      auth: {
        user: 'contact@amanulla.in',
        pass: process.env.EMAIL_PASSWORD
      }
    }
  };
}

// User identity added to email
const mailOptions = {
  from: `"${userEmail} via PitchLense" <contact@amanulla.in>`,
  to: recipient,
  subject: subject,
  text: `[Sent by: ${userEmail}]\n\n${body}`
};
```

### Frontend Display
- Settings show shared email server (read-only)
- User's PitchLense email displayed as identity
- Clear hackathon demo mode indicator
- Test connection button for server status

## Troubleshooting

### Error: "Email server not configured"
**Solution**: Add `EMAIL_PASSWORD` to your `.env` file

### Error: "Connection failed"
**Solutions**:
- Check password is correct
- Verify Hostinger account is active
- Ensure ports 993 (IMAP) and 465 (SMTP) are not blocked

### Emails not sending
**Solutions**:
- Test connection in Settings
- Check server logs for SMTP errors
- Verify recipient email address is valid

### Emails not receiving
**Solutions**:
- Check IMAP connection
- Verify emails exist in `contact@amanulla.in` inbox
- Refresh the email list

## Environment Variables

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `EMAIL_USERNAME` | contact@amanulla.in | Yes | Shared email address |
| `EMAIL_PASSWORD` | (your password) | Yes | Email account password |
| `IMAP_HOST` | imap.hostinger.com | No | IMAP server (default set) |
| `IMAP_PORT` | 993 | No | IMAP port (default set) |
| `SMTP_HOST` | smtp.hostinger.com | No | SMTP server (default set) |
| `SMTP_PORT` | 465 | No | SMTP port (default set) |

## Quick Start Checklist

- [ ] Install npm packages: `npm install imap mailparser nodemailer`
- [ ] Create `.env` file with EMAIL_PASSWORD
- [ ] Restart backend server
- [ ] Open `/email.html` in browser
- [ ] Click Settings to verify configuration
- [ ] Send a test email
- [ ] Check inbox for received emails

## Summary

Perfect hackathon solution:
- ✅ 5-minute setup
- ✅ No database changes
- ✅ No user credential management
- ✅ Professional email features
- ✅ Great for demos and testing

Focus on your hackathon features, not email infrastructure! 🚀

