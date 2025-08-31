"""
Test GCS upload functionality
"""

import pytest
import tempfile
import os
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from io import BytesIO

from app.main import app
from app.utils.gcs_utils import (
    get_gcs_client,
    gcs_path_to_download_url,
    delete_gcs_file,
    file_exists_in_gcs
)


class TestGCSUpload:
    """Test GCS upload functionality"""

    @patch('app.utils.gcs_utils.storage.Client')
    def test_get_gcs_client_with_credentials(self, mock_client):
        """Test getting GCS client with service account credentials"""
        with patch('app.core.config.settings.GOOGLE_APPLICATION_CREDENTIALS', '/path/to/credentials.json'):
            with patch('app.core.config.settings.GOOGLE_CLOUD_PROJECT', 'test-project'):
                client = get_gcs_client()
                mock_client.from_service_account_json.assert_called_once_with('/path/to/credentials.json')

    @patch('app.utils.gcs_utils.storage.Client')
    def test_get_gcs_client_without_credentials(self, mock_client):
        """Test getting GCS client without service account credentials"""
        with patch('app.core.config.settings.GOOGLE_APPLICATION_CREDENTIALS', None):
            with patch('app.core.config.settings.GOOGLE_CLOUD_PROJECT', 'test-project'):
                client = get_gcs_client()
                mock_client.assert_called_once_with(project='test-project')

    def test_gcs_path_to_download_url_invalid_format(self):
        """Test gcs_path_to_download_url with invalid path format"""
        with pytest.raises(ValueError, match="Invalid GCS path format"):
            gcs_path_to_download_url("invalid-path")

    def test_gcs_path_to_download_url_missing_blob_path(self):
        """Test gcs_path_to_download_url with missing blob path"""
        with pytest.raises(ValueError, match="Invalid GCS path format"):
            gcs_path_to_download_url("gs://bucket-name")

    @patch('app.utils.gcs_utils.get_gcs_client')
    def test_gcs_path_to_download_url_success(self, mock_get_client):
        """Test successful gcs_path_to_download_url generation"""
        # Mock the GCS client and blob
        mock_client = Mock()
        mock_bucket = Mock()
        mock_blob = Mock()
        
        mock_get_client.return_value = mock_client
        mock_client.bucket.return_value = mock_bucket
        mock_bucket.blob.return_value = mock_blob
        mock_blob.generate_signed_url.return_value = "https://signed-url.com/file"
        
        result = gcs_path_to_download_url("gs://test-bucket/path/to/file.pdf")
        
        assert result == "https://signed-url.com/file"
        mock_blob.generate_signed_url.assert_called_once()

    @patch('app.utils.gcs_utils.get_gcs_client')
    def test_delete_gcs_file_success(self, mock_get_client):
        """Test successful file deletion from GCS"""
        # Mock the GCS client and blob
        mock_client = Mock()
        mock_bucket = Mock()
        mock_blob = Mock()
        
        mock_get_client.return_value = mock_client
        mock_client.bucket.return_value = mock_bucket
        mock_bucket.blob.return_value = mock_blob
        
        result = delete_gcs_file("gs://test-bucket/path/to/file.pdf")
        
        assert result is True
        mock_blob.delete.assert_called_once()

    @patch('app.utils.gcs_utils.get_gcs_client')
    def test_delete_gcs_file_failure(self, mock_get_client):
        """Test file deletion failure from GCS"""
        mock_get_client.side_effect = Exception("GCS error")
        
        result = delete_gcs_file("gs://test-bucket/path/to/file.pdf")
        
        assert result is False

    @patch('app.utils.gcs_utils.get_gcs_client')
    def test_file_exists_in_gcs_true(self, mock_get_client):
        """Test file existence check when file exists"""
        # Mock the GCS client and blob
        mock_client = Mock()
        mock_bucket = Mock()
        mock_blob = Mock()
        
        mock_get_client.return_value = mock_client
        mock_client.bucket.return_value = mock_bucket
        mock_bucket.blob.return_value = mock_blob
        mock_blob.exists.return_value = True
        
        result = file_exists_in_gcs("gs://test-bucket/path/to/file.pdf")
        
        assert result is True

    @patch('app.utils.gcs_utils.get_gcs_client')
    def test_file_exists_in_gcs_false(self, mock_get_client):
        """Test file existence check when file doesn't exist"""
        # Mock the GCS client and blob
        mock_client = Mock()
        mock_bucket = Mock()
        mock_blob = Mock()
        
        mock_get_client.return_value = mock_client
        mock_client.bucket.return_value = mock_bucket
        mock_bucket.blob.return_value = mock_blob
        mock_blob.exists.return_value = False
        
        result = file_exists_in_gcs("gs://test-bucket/path/to/file.pdf")
        
        assert result is False


class TestReportUploadWithGCS:
    """Test report creation with GCS upload"""

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_create_report_with_gcs_upload(self, mock_upload, client, db_session):
        """Test creating a report with GCS upload"""
        # Mock the GCS upload function
        mock_upload.return_value = "gs://test-bucket/uploads/test-report-123/test_document.pdf"
        
        # Create test file
        test_file_content = b"Test file content"
        test_file = BytesIO(test_file_content)
        
        # Test data
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck"]
        }
        
        files = [
            ("files", ("test_document.pdf", test_file, "application/pdf"))
        ]
        
        # Make request
        response = client.post("/api/v1/reports/", data=data, files=files)
        
        # Assert response
        assert response.status_code == 200
        result = response.json()
        
        # Verify GCS upload was called with correct path
        mock_upload.assert_called_once()
        call_args = mock_upload.call_args[0]
        assert "uploads/" in call_args[1]  # file_path argument
        assert result["report_id"] in call_args[1]
        assert "test_document.pdf" in call_args[1]
        
        # Verify the upload path in database is GCS path
        from app.crud import upload_crud
        uploads = upload_crud.get_by_report(db_session, report_id=result["report_id"])
        assert len(uploads) == 1
        assert uploads[0].upload_path.startswith("gs://")
        assert uploads[0].upload_path.endswith("test_document.pdf")
        
        # Verify report_path is set correctly
        assert result["report_path"] == f"gs://test-bucket/runs/{result['report_id']}.json"
        
        # Verify report_path is saved in database
        from app.crud import report_crud
        db_report = report_crud.get(db_session, report_id=result["report_id"])
        assert db_report.report_path == f"gs://test-bucket/runs/{result['report_id']}.json"

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_create_report_gcs_upload_failure(self, mock_upload, client):
        """Test report creation when GCS upload fails"""
        # Mock the GCS upload function to fail
        mock_upload.side_effect = Exception("GCS upload failed")
        
        # Create test file
        test_file_content = b"Test file content"
        test_file = BytesIO(test_file_content)
        
        # Test data
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck"]
        }
        
        files = [
            ("files", ("test_document.pdf", test_file, "application/pdf"))
        ]
        
        # Make request
        response = client.post("/api/v1/reports/", data=data, files=files)
        
        # Assert response
        assert response.status_code == 500
        assert "Failed to create report" in response.json()["detail"]


class TestUploadEndpoints:
    """Test upload-related endpoints"""

    def test_get_file_download_url_not_found(self, client, db_session):
        """Test getting download URL for non-existent file"""
        response = client.get("/api/v1/uploads/non-existent-file/download-url")
        assert response.status_code == 404

    @patch('app.api.v1.endpoints.uploads.file_exists_in_gcs')
    @patch('app.api.v1.endpoints.uploads.gcs_path_to_download_url')
    def test_get_file_download_url_success(self, mock_generate_url, mock_exists, client, sample_upload):
        """Test getting download URL for existing file"""
        # Mock GCS functions
        mock_exists.return_value = True
        mock_generate_url.return_value = "https://signed-url.com/file"
        
        response = client.get(f"/api/v1/uploads/{sample_upload.file_id}/download-url")
        
        assert response.status_code == 200
        result = response.json()
        assert "download_url" in result
        assert result["download_url"] == "https://signed-url.com/file"

    def test_delete_file_not_found(self, client, db_session):
        """Test deleting non-existent file"""
        response = client.delete("/api/v1/uploads/non-existent-file")
        assert response.status_code == 404

    @patch('app.api.v1.endpoints.uploads.delete_gcs_file')
    def test_delete_file_success(self, mock_delete_gcs, client, sample_upload):
        """Test deleting existing file"""
        # Mock GCS deletion
        mock_delete_gcs.return_value = True
        
        response = client.delete(f"/api/v1/uploads/{sample_upload.file_id}")
        
        assert response.status_code == 200
        result = response.json()
        assert result["message"] == "File deleted successfully"
        assert result["gcs_deleted"] is True

    def test_get_report_files(self, client, sample_report, sample_upload):
        """Test getting files for a report"""
        response = client.get(f"/api/v1/uploads/report/{sample_report.report_id}")
        
        assert response.status_code == 200
        result = response.json()
        assert result["report_id"] == sample_report.report_id
        assert len(result["files"]) == 1
        assert result["files"][0]["file_id"] == sample_upload.file_id
