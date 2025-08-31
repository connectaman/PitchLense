"""
Test API endpoints
"""

import pytest
from unittest.mock import patch, Mock
from io import BytesIO

from app.main import app


class TestReportEndpoints:
    """Test report-related API endpoints"""

    def test_create_report_success(self, client, db_session):
        """Test successful report creation"""
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-report-123/document.pdf"
            
            test_file = BytesIO(b"Test file content")
            data = {
                "startup_name": "Test Startup",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files = [("files", ("document.pdf", test_file, "application/pdf"))]
            
            response = client.post("/api/v1/reports/", data=data, files=files)
            
            assert response.status_code == 200
            result = response.json()
            
            assert result["startup_name"] == "Test Startup"
            assert result["founder_name"] == "John Doe"
            assert result["report_path"] == f"gs://test-bucket/runs/{result['report_id']}.json"
            assert result["status"] == "pending"

    def test_create_report_missing_fields(self, client):
        """Test report creation with missing required fields"""
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            # Missing launch_date and founder_name
            "file_types": ["pitch deck"]
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]
        
        response = client.post("/api/v1/reports/", data=data, files=files)
        
        assert response.status_code == 400
        assert "required" in response.json()["detail"]

    def test_create_report_no_files(self, client):
        """Test report creation without files"""
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": []
        }
        
        response = client.post("/api/v1/reports/", data=data)
        
        assert response.status_code == 400
        assert "file must be uploaded" in response.json()["detail"]

    def test_create_report_mismatched_files_types(self, client):
        """Test report creation with mismatched files and types"""
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck", "call recording"]  # 2 types
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]  # 1 file
        
        response = client.post("/api/v1/reports/", data=data, files=files)
        
        assert response.status_code == 400
        assert "must match" in response.json()["detail"]

    def test_create_report_invalid_file_type(self, client):
        """Test report creation with invalid file type"""
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["invalid_type"]
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]
        
        response = client.post("/api/v1/reports/", data=data, files=files)
        
        assert response.status_code == 400
        assert "Invalid file type" in response.json()["detail"]

    def test_get_reports_list(self, client, db_session):
        """Test getting list of reports"""
        # Create some test reports first
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            for i in range(3):
                test_file = BytesIO(b"Test file content")
                data = {
                    "startup_name": f"Startup {i}",
                    "launch_date": "2024-01-15",
                    "founder_name": f"Founder {i}",
                    "file_types": ["pitch deck"]
                }
                files = [("files", (f"document{i}.pdf", test_file, "application/pdf"))]
                
                client.post("/api/v1/reports/", data=data, files=files)
        
        # Get reports list
        response = client.get("/api/v1/reports/")
        
        assert response.status_code == 200
        result = response.json()
        
        assert len(result["reports"]) == 3
        assert result["total"] == 3
        assert result["skip"] == 0
        assert result["limit"] == 100

    def test_get_reports_with_pagination(self, client, db_session):
        """Test getting reports with pagination"""
        # Create test reports first
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            for i in range(5):
                test_file = BytesIO(b"Test file content")
                data = {
                    "startup_name": f"Startup {i}",
                    "launch_date": "2024-01-15",
                    "founder_name": f"Founder {i}",
                    "file_types": ["pitch deck"]
                }
                files = [("files", (f"document{i}.pdf", test_file, "application/pdf"))]
                
                client.post("/api/v1/reports/", data=data, files=files)
        
        # Get first page
        response = client.get("/api/v1/reports/?skip=0&limit=2")
        assert response.status_code == 200
        result = response.json()
        assert len(result["reports"]) == 2
        
        # Get second page
        response = client.get("/api/v1/reports/?skip=2&limit=2")
        assert response.status_code == 200
        result = response.json()
        assert len(result["reports"]) == 2

    def test_get_single_report(self, client, db_session):
        """Test getting a single report by ID"""
        # Create a test report first
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            test_file = BytesIO(b"Test file content")
            data = {
                "startup_name": "Test Startup",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files = [("files", ("document.pdf", test_file, "application/pdf"))]
            
            create_response = client.post("/api/v1/reports/", data=data, files=files)
            report_id = create_response.json()["report_id"]
        
        # Get the report
        response = client.get(f"/api/v1/reports/{report_id}")
        
        assert response.status_code == 200
        result = response.json()
        
        assert result["report_id"] == report_id
        assert result["startup_name"] == "Test Startup"
        assert result["founder_name"] == "John Doe"
        assert "file_count" in result

    def test_get_nonexistent_report(self, client):
        """Test getting a non-existent report"""
        response = client.get("/api/v1/reports/non-existent-id")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    @patch('app.api.v1.endpoints.reports.delete_gcs_file')
    def test_delete_report(self, mock_delete_gcs, client, db_session):
        """Test deleting a report"""
        # Create a test report first
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            mock_delete_gcs.return_value = True
            
            test_file = BytesIO(b"Test file content")
            data = {
                "startup_name": "Test Startup",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files = [("files", ("document.pdf", test_file, "application/pdf"))]
            
            create_response = client.post("/api/v1/reports/", data=data, files=files)
            report_id = create_response.json()["report_id"]
        
        # Delete the report
        response = client.delete(f"/api/v1/reports/{report_id}")
        
        assert response.status_code == 200
        result = response.json()
        
        assert "deleted successfully" in result["message"]
        assert "files_deleted" in result

    def test_delete_nonexistent_report(self, client):
        """Test deleting a non-existent report"""
        response = client.delete("/api/v1/reports/non-existent-id")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    def test_toggle_pin_report(self, client, db_session):
        """Test toggling pin status of a report"""
        # Create a test report first
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            test_file = BytesIO(b"Test file content")
            data = {
                "startup_name": "Test Startup",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files = [("files", ("document.pdf", test_file, "application/pdf"))]
            
            create_response = client.post("/api/v1/reports/", data=data, files=files)
            report_id = create_response.json()["report_id"]
        
        # Toggle pin status
        response = client.patch(f"/api/v1/reports/{report_id}/pin")
        
        assert response.status_code == 200
        result = response.json()
        
        assert "pinned" in result["message"] or "unpinned" in result["message"]

    def test_toggle_pin_nonexistent_report(self, client):
        """Test toggling pin status of a non-existent report"""
        response = client.patch("/api/v1/reports/non-existent-id/pin")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestUploadEndpoints:
    """Test upload-related API endpoints"""

    def test_get_file_download_url(self, client, db_session, sample_upload):
        """Test getting download URL for a file"""
        with patch('app.api.v1.endpoints.uploads.file_exists_in_gcs') as mock_exists:
            with patch('app.api.v1.endpoints.uploads.gcs_path_to_download_url') as mock_generate:
                mock_exists.return_value = True
                mock_generate.return_value = "https://signed-url.com/file"
                
                response = client.get(f"/api/v1/uploads/{sample_upload.file_id}/download-url")
                
                assert response.status_code == 200
                result = response.json()
                
                assert result["file_id"] == sample_upload.file_id
                assert result["filename"] == sample_upload.filename
                assert result["download_url"] == "https://signed-url.com/file"
                assert result["expires_in"] == "1 hour"

    def test_get_file_download_url_not_found(self, client):
        """Test getting download URL for non-existent file"""
        response = client.get("/api/v1/uploads/non-existent-id/download-url")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    def test_get_file_download_url_file_not_in_gcs(self, client, db_session, sample_upload):
        """Test getting download URL when file doesn't exist in GCS"""
        with patch('app.api.v1.endpoints.uploads.file_exists_in_gcs') as mock_exists:
            mock_exists.return_value = False
            
            response = client.get(f"/api/v1/uploads/{sample_upload.file_id}/download-url")
            
            assert response.status_code == 404
            assert "not found in storage" in response.json()["detail"]

    @patch('app.api.v1.endpoints.uploads.delete_gcs_file')
    def test_delete_file(self, mock_delete_gcs, client, db_session, sample_upload):
        """Test deleting a file"""
        mock_delete_gcs.return_value = True
        
        response = client.delete(f"/api/v1/uploads/{sample_upload.file_id}")
        
        assert response.status_code == 200
        result = response.json()
        
        assert result["message"] == "File deleted successfully"
        assert result["gcs_deleted"] is True

    def test_delete_nonexistent_file(self, client):
        """Test deleting a non-existent file"""
        response = client.delete("/api/v1/uploads/non-existent-id")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    def test_get_report_files(self, client, db_session, sample_report, sample_upload):
        """Test getting all files for a report"""
        with patch('app.api.v1.endpoints.uploads.gcs_path_to_download_url') as mock_generate:
            mock_generate.return_value = "https://signed-url.com/file"
            
            response = client.get(f"/api/v1/uploads/report/{sample_report.report_id}")
            
            assert response.status_code == 200
            result = response.json()
            
            assert result["report_id"] == sample_report.report_id
            assert len(result["files"]) == 1
            assert result["total_files"] == 1
            assert result["files"][0]["file_id"] == sample_upload.file_id
            assert result["files"][0]["download_url"] == "https://signed-url.com/file"

    def test_get_report_files_with_error(self, client, db_session, sample_report, sample_upload):
        """Test getting report files when GCS URL generation fails"""
        with patch('app.api.v1.endpoints.uploads.gcs_path_to_download_url') as mock_generate:
            mock_generate.side_effect = Exception("GCS error")
            
            response = client.get(f"/api/v1/uploads/report/{sample_report.report_id}")
            
            assert response.status_code == 200
            result = response.json()
            
            assert len(result["files"]) == 1
            assert result["files"][0]["download_url"] is None
            assert "error" in result["files"][0]


class TestReportFiltering:
    """Test report filtering and search functionality"""

    def test_filter_reports_by_status(self, client, db_session):
        """Test filtering reports by status"""
        # Create reports with different statuses
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            for i, status in enumerate(["pending", "success", "failed"]):
                test_file = BytesIO(b"Test file content")
                data = {
                    "startup_name": f"Startup {i}",
                    "launch_date": "2024-01-15",
                    "founder_name": f"Founder {i}",
                    "file_types": ["pitch deck"]
                }
                files = [("files", (f"document{i}.pdf", test_file, "application/pdf"))]
                
                response = client.post("/api/v1/reports/", data=data, files=files)
                report_id = response.json()["report_id"]
                
                # Update status if not pending
                if status != "pending":
                    from app.crud import report_crud
                    from app.schemas import ReportUpdate
                    from app.models.report import ReportStatus
                    
                    report = report_crud.get(db_session, report_id=report_id)
                    status_enum = ReportStatus.SUCCESS if status == "success" else ReportStatus.FAILED
                    report_crud.update(db_session, db_obj=report, obj_in=ReportUpdate(status=status_enum))
        
        # Filter by pending status
        response = client.get("/api/v1/reports/?status=pending")
        assert response.status_code == 200
        result = response.json()
        assert len(result["reports"]) == 1
        assert result["reports"][0]["status"] == "pending"

    def test_filter_reports_pinned_only(self, client, db_session):
        """Test filtering to show only pinned reports"""
        # Create reports and pin one
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            for i in range(2):
                test_file = BytesIO(b"Test file content")
                data = {
                    "startup_name": f"Startup {i}",
                    "launch_date": "2024-01-15",
                    "founder_name": f"Founder {i}",
                    "file_types": ["pitch deck"]
                }
                files = [("files", (f"document{i}.pdf", test_file, "application/pdf"))]
                
                response = client.post("/api/v1/reports/", data=data, files=files)
                report_id = response.json()["report_id"]
                
                # Pin the first report
                if i == 0:
                    client.patch(f"/api/v1/reports/{report_id}/pin")
        
        # Filter pinned only
        response = client.get("/api/v1/reports/?pinned_only=true")
        assert response.status_code == 200
        result = response.json()
        assert len(result["reports"]) == 1
        assert result["reports"][0]["is_pinned"] is True

    def test_search_reports(self, client, db_session):
        """Test searching reports"""
        # Create reports with different names
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            mock_upload.return_value = "gs://test-bucket/uploads/test-path/file.pdf"
            
            test_file = BytesIO(b"Test file content")
            data = {
                "startup_name": "TechCorp",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files = [("files", ("document.pdf", test_file, "application/pdf"))]
            
            client.post("/api/v1/reports/", data=data, files=files)
        
        # Search for "Tech"
        response = client.get("/api/v1/reports/?search=Tech")
        assert response.status_code == 200
        result = response.json()
        assert len(result["reports"]) == 1
        assert "Tech" in result["reports"][0]["startup_name"]
