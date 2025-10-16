#!/bin/bash

# Email Integration Installation Script for PitchLense
# This script installs the required npm packages for email functionality

echo "========================================="
echo "PitchLense Email Integration Installer"
echo "========================================="
echo ""

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the PitchLense project root directory"
    exit 1
fi

echo "Installing email dependencies..."
echo ""

# Navigate to backend and install packages
cd backend

echo "Installing backend dependencies:"
echo "  - imap (IMAP email fetching)"
echo "  - mailparser (Email parsing)"
echo "  - nodemailer (SMTP email sending)"
echo ""

npm install imap@^0.8.19 mailparser@^3.7.1 nodemailer@^6.9.15

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Email dependencies installed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with email server settings (see EMAIL_SETUP.md)"
    echo "2. Run the database migration to add email columns (see setup-database.sql)"
    echo "3. Restart your backend server: npm start"
    echo "4. Configure your email credentials in the app settings"
    echo ""
    echo "For detailed setup instructions, see EMAIL_SETUP.md"
else
    echo ""
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

cd ..

