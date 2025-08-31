"""
Test report_path persistence in database
"""

import pytest
from unittest.mock import patch
from io import BytesIO


class TestReportPathPersistence:
    """Test that report_path is properly saved to database"""

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_report_path_saved_to_database(self, mock_upload, client, db_session):
        """Test that report_path is saved to database after report creation"""
        # Mock the GCS upload function
        mock_upload.return_value = "gs://test-bucket/uploads/test-report-123/document.pdf"
        
        # Create test file
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck"]
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]
        
        # Create report
        response = client.post("/api/v1/reports/", data=data, files=files)
        assert response.status_code == 200
        result = response.json()
        report_id = result["report_id"]
        
        # Verify report_path in response
        expected_path = f"gs://test-bucket/runs/{report_id}.json"
        assert result["report_path"] == expected_path
        
        # Verify report_path is saved in database
        from app.crud import report_crud
        db_report = report_crud.get(db_session, report_id=report_id)
        assert db_report is not None
        assert db_report.report_path == expected_path
        
        # Verify the path follows the correct structure
        assert db_report.report_path.startswith("gs://test-bucket/runs/")
        assert db_report.report_path.endswith(".json")
        assert report_id in db_report.report_path

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_report_path_persistence_across_sessions(self, mock_upload, client, db_session):
        """Test that report_path persists across database sessions"""
        # Mock the GCS upload function
        mock_upload.return_value = "gs://test-bucket/uploads/test-report-123/document.pdf"
        
        # Create test file
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck"]
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]
        
        # Create report
        response = client.post("/api/v1/reports/", data=data, files=files)
        assert response.status_code == 200
        result = response.json()
        report_id = result["report_id"]
        expected_path = f"gs://test-bucket/runs/{report_id}.json"
        
        # Verify report_path is saved in database
        from app.crud import report_crud
        db_report = report_crud.get(db_session, report_id=report_id)
        assert db_report.report_path == expected_path
        
        # Simulate a new database session by refreshing
        db_session.refresh(db_report)
        assert db_report.report_path == expected_path
        
        # Get the report again to simulate a completely new session
        db_report2 = report_crud.get(db_session, report_id=report_id)
        assert db_report2.report_path == expected_path

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_multiple_reports_different_paths(self, mock_upload, client, db_session):
        """Test that multiple reports have different report_paths saved in database"""
        # Mock the GCS upload function
        mock_upload.return_value = "gs://test-bucket/uploads/test-path/document.pdf"
        
        report_paths = []
        
        # Create multiple reports
        for i in range(3):
            test_file = BytesIO(b"Test file content")
            data = {
                "startup_name": f"Test Startup {i}",
                "launch_date": "2024-01-15",
                "founder_name": f"John Doe {i}",
                "file_types": ["pitch deck"]
            }
            files = [("files", (f"document{i}.pdf", test_file, "application/pdf"))]
            
            response = client.post("/api/v1/reports/", data=data, files=files)
            assert response.status_code == 200
            result = response.json()
            report_id = result["report_id"]
            expected_path = f"gs://test-bucket/runs/{report_id}.json"
            report_paths.append(expected_path)
            
            # Verify each report has correct path in database
            from app.crud import report_crud
            db_report = report_crud.get(db_session, report_id=report_id)
            assert db_report.report_path == expected_path
        
        # Verify all paths are different
        assert len(set(report_paths)) == 3
        assert len(report_paths) == 3

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_report_path_format_consistency(self, mock_upload, client, db_session):
        """Test that report_path format is consistent across all reports"""
        # Mock the GCS upload function
        mock_upload.return_value = "gs://test-bucket/uploads/test-path/document.pdf"
        
        # Create test file
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck"]
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]
        
        # Create report
        response = client.post("/api/v1/reports/", data=data, files=files)
        assert response.status_code == 200
        result = response.json()
        report_id = result["report_id"]
        
        # Verify report_path format in database
        from app.crud import report_crud
        db_report = report_crud.get(db_session, report_id=report_id)
        
        # Check format: gs://bucket/runs/{report_id}.json
        assert db_report.report_path.startswith("gs://test-bucket/runs/")
        assert db_report.report_path.endswith(".json")
        assert db_report.report_path.count("/") == 3  # gs://bucket/runs/file
        assert db_report.report_path.count(".") == 1   # Only one dot
        
        # Extract report_id from path and verify it matches
        path_parts = db_report.report_path.split("/")
        assert len(path_parts) == 4  # gs:, , bucket, runs, file.json
        assert path_parts[0] == "gs:"
        assert path_parts[2] == "test-bucket"
        assert path_parts[3].startswith("runs")
        
        json_parts = path_parts[3].split(".")
        assert len(json_parts) == 2
        assert json_parts[0] == report_id
        assert json_parts[1] == "json"

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_report_path_retrieval_via_api(self, mock_upload, client, db_session):
        """Test that report_path is correctly returned when retrieving report via API"""
        # Mock the GCS upload function
        mock_upload.return_value = "gs://test-bucket/uploads/test-path/document.pdf"
        
        # Create test file
        test_file = BytesIO(b"Test file content")
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck"]
        }
        files = [("files", ("document.pdf", test_file, "application/pdf"))]
        
        # Create report
        create_response = client.post("/api/v1/reports/", data=data, files=files)
        assert create_response.status_code == 200
        create_result = create_response.json()
        report_id = create_result["report_id"]
        expected_path = f"gs://test-bucket/runs/{report_id}.json"
        
        # Verify report_path in creation response
        assert create_result["report_path"] == expected_path
        
        # Retrieve the report via GET API
        get_response = client.get(f"/api/v1/reports/{report_id}")
        assert get_response.status_code == 200
        get_result = get_response.json()
        
        # Verify report_path is returned in GET response
        assert get_result["report_path"] == expected_path
        
        # Verify report_path in database matches
        from app.crud import report_crud
        db_report = report_crud.get(db_session, report_id=report_id)
        assert db_report.report_path == expected_path
