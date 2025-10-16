@echo off
REM Email Integration Installation Script for PitchLense (Windows)
REM This script installs the required npm packages for email functionality

echo =========================================
echo PitchLense Email Integration Installer
echo =========================================
echo.

REM Check if we're in the project root
if not exist package.json (
    echo Error: Please run this script from the PitchLense project root directory
    exit /b 1
)

echo Installing email dependencies...
echo.

REM Navigate to backend and install packages
cd backend

echo Installing backend dependencies:
echo   - imap (IMAP email fetching^)
echo   - mailparser (Email parsing^)
echo   - nodemailer (SMTP email sending^)
echo.

call npm install imap@^0.8.19 mailparser@^3.7.1 nodemailer@^6.9.15

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Email dependencies installed successfully!
    echo.
    echo Next steps:
    echo 1. Update your .env file with email server settings (see EMAIL_SETUP.md^)
    echo 2. Run the database migration to add email columns (see setup-database.sql^)
    echo 3. Restart your backend server: npm start
    echo 4. Configure your email credentials in the app settings
    echo.
    echo For detailed setup instructions, see EMAIL_SETUP.md
) else (
    echo.
    echo ❌ Failed to install dependencies. Please check the error messages above.
    cd ..
    exit /b 1
)

cd ..

