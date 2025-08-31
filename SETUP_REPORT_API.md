# Report API Setup Guide

This guide will help you set up and test the Report API for the PitchLense application.

## Prerequisites

1. Python 3.8+ installed
2. Node.js and npm installed
3. GCP account with Cloud Storage bucket
4. GCP service account key file

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Copy the template
cp env.template .env
```

Update the `.env` file with your configuration:

```env
# Environment
NODE_ENV=local

# Database (for local development, uses SQLite)
DATABASE_URL=sqlite:///./pitchlense.db

# GCP Configuration
BUCKET=your-gcp-bucket-name
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Google AI
GEMINI_API_KEY=your-gemini-api-key

# Security
SECRET_KEY=your-secret-key-here
```

### 3. Initialize Database

```bash
cd backend
python app/core/init_db.py
```

This will create the SQLite database with all required tables.

### 4. Test Database Operations

```bash
cd backend
python test_db.py
```

This will test the basic CRUD operations for all entities.

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_BACKEND_API_URL=http://localhost:8000
```

## Running the Application

### 1. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend Development Server

```bash
cd frontend
npm start
```

## API Testing

### 1. Test Report API

```bash
cd backend
python test_report_api.py
```

### 2. Manual API Testing

You can also test the API manually using curl or Postman:

#### Create a Report

```bash
curl -X POST "http://localhost:8000/api/v1/reports/" \
  -H "Content-Type: multipart/form-data" \
  -F "startup_name=TestStartup" \
  -F "launch_date=2024-01-15" \
  -F "founder_name=John Doe" \
  -F "files=@test_document.txt" \
  -F "file_types=pitch deck"
```

#### Get Reports

```bash
curl -X GET "http://localhost:8000/api/v1/reports/"
```

#### Get Specific Report

```bash
curl -X GET "http://localhost:8000/api/v1/reports/{report_id}"
```

## API Endpoints

### Reports

- `POST /api/v1/reports/` - Create a new report with file uploads
- `GET /api/v1/reports/` - Get list of reports with pagination and search
- `GET /api/v1/reports/{report_id}` - Get specific report
- `DELETE /api/v1/reports/{report_id}` - Soft delete a report
- `PATCH /api/v1/reports/{report_id}/pin` - Toggle pin status

### Health Check

- `GET /api/v1/health` - Health check endpoint

## File Upload Process

1. **Form Validation**: Validates required fields and file types
2. **Report Creation**: Creates report record in database with timestamp
3. **File Upload**: Uploads files to GCP Cloud Storage bucket
4. **Database Storage**: Saves file metadata in Upload table
5. **Response**: Returns created report with details

## Supported File Types

- **Documents**: PDF, DOC, DOCX, TXT, CSV
- **Audio**: MP3, MPEG
- **Video**: MP4
- **Images**: JPEG, PNG

## File Type Categories

- pitch deck
- call recording
- meeting recording
- founder profile
- news report
- company document

## Database Schema

### Reports Table
- `report_id`: UUID primary key
- `report_name`: Auto-generated (startup_name + timestamp)
- `startup_name`: From form
- `founder_name`: From form
- `status`: Enum (pending, success, failed)
- `is_delete`: Boolean (soft delete)
- `is_pinned`: Boolean
- `created_at`: Timestamp

### Uploads Table
- `file_id`: UUID primary key
- `user_id`: Hardcoded to "1"
- `report_id`: Foreign key to Reports
- `filename`: Original filename
- `file_format`: File type category
- `upload_path`: GCP bucket URL
- `created_at`: Timestamp

## Error Handling

The API includes comprehensive error handling for:

- Missing required fields
- Invalid file types
- File size limits
- GCP upload failures
- Database errors

## Development Notes

- User ID is hardcoded to "1" as requested
- Files are uploaded to GCP bucket with unique names
- Report names are auto-generated with timestamps
- Soft delete is implemented for reports
- All file uploads are validated for type and size

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure SQLite file is writable
2. **GCP Upload Error**: Check service account credentials and bucket permissions
3. **CORS Error**: Ensure backend is running on correct port
4. **File Upload Error**: Check file size and type restrictions

### Debug Mode

Enable debug mode by setting `DEBUG=true` in your `.env` file for detailed error messages.
