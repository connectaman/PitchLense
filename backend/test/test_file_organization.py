"""
Test file organization structure
"""

import pytest
from unittest.mock import patch, Mock
from io import BytesIO

from app.api.v1.endpoints.reports import create_report
from app.core.database import get_db


class TestFileOrganization:
    """Test file organization with report_id-based paths"""

    @patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket')
    def test_file_organization_structure(self, mock_upload, client, db_session):
        """Test that files are organized by report_id and original filename"""
        # Mock the GCS upload function
        def mock_upload_side_effect(file, file_path):
            return f"gs://test-bucket/{file_path}"
        
        mock_upload.side_effect = mock_upload_side_effect
        
        # Create test files
        test_file1 = BytesIO(b"Test file 1 content")
        test_file2 = BytesIO(b"Test file 2 content")
        
        # Test data
        data = {
            "startup_name": "Test Startup",
            "launch_date": "2024-01-15",
            "founder_name": "John Doe",
            "file_types": ["pitch deck", "call recording"]
        }
        
        files = [
            ("files", ("pitch_deck.pdf", test_file1, "application/pdf")),
            ("files", ("call_recording.mp3", test_file2, "audio/mpeg"))
        ]
        
        # Make request
        response = client.post("/api/v1/reports/", data=data, files=files)
        
        # Assert response
        assert response.status_code == 200
        result = response.json()
        report_id = result["report_id"]
        
        # Verify GCS upload was called twice with correct paths
        assert mock_upload.call_count == 2
        
        # Check first file upload
        first_call_args = mock_upload.call_args_list[0][0]
        assert first_call_args[1] == f"uploads/{report_id}/pitch_deck.pdf"
        
        # Check second file upload
        second_call_args = mock_upload.call_args_list[1][0]
        assert second_call_args[1] == f"uploads/{report_id}/call_recording.mp3"
        
        # Verify database records
        from app.crud import upload_crud
        uploads = upload_crud.get_by_report(db_session, report_id=report_id)
        assert len(uploads) == 2
        
        # Check first upload record
        assert uploads[0].filename == "pitch_deck.pdf"
        assert uploads[0].upload_path == f"gs://test-bucket/uploads/{report_id}/pitch_deck.pdf"
        assert uploads[0].file_format == "pitch deck"
        
        # Check second upload record
        assert uploads[1].filename == "call_recording.mp3"
        assert uploads[1].upload_path == f"gs://test-bucket/uploads/{report_id}/call_recording.mp3"
        assert uploads[1].file_format == "call recording"
        
        # Verify report_path is set correctly
        assert result["report_path"] == f"gs://test-bucket/runs/{report_id}.json"
        
        # Verify report_path is saved in database
        from app.crud import report_crud
        db_report = report_crud.get(db_session, report_id=report_id)
        assert db_report.report_path == f"gs://test-bucket/runs/{report_id}.json"

    def test_multiple_reports_file_organization(self, client, db_session):
        """Test that different reports have separate file organization"""
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            def mock_upload_side_effect(file, file_path):
                return f"gs://test-bucket/{file_path}"
            
            mock_upload.side_effect = mock_upload_side_effect
            
            # Create first report
            test_file1 = BytesIO(b"Test file 1 content")
            data1 = {
                "startup_name": "Startup 1",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files1 = [("files", ("document1.pdf", test_file1, "application/pdf"))]
            
            response1 = client.post("/api/v1/reports/", data=data1, files=files1)
            assert response1.status_code == 200
            result1 = response1.json()
            report_id1 = result1["report_id"]
            
            # Create second report
            test_file2 = BytesIO(b"Test file 2 content")
            data2 = {
                "startup_name": "Startup 2",
                "launch_date": "2024-01-16",
                "founder_name": "Jane Smith",
                "file_types": ["pitch deck"]
            }
            files2 = [("files", ("document2.pdf", test_file2, "application/pdf"))]
            
            response2 = client.post("/api/v1/reports/", data=data2, files=files2)
            assert response2.status_code == 200
            result2 = response2.json()
            report_id2 = result2["report_id"]
            
            # Verify different report IDs
            assert report_id1 != report_id2
            
            # Verify different file paths
            assert mock_upload.call_count == 2
            
            first_call_path = mock_upload.call_args_list[0][0][1]
            second_call_path = mock_upload.call_args_list[1][0][1]
            
            assert first_call_path == f"uploads/{report_id1}/document1.pdf"
            assert second_call_path == f"uploads/{report_id2}/document2.pdf"
            
            # Verify different report paths
            assert result1["report_path"] == f"gs://test-bucket/runs/{report_id1}.json"
            assert result2["report_path"] == f"gs://test-bucket/runs/{report_id2}.json"
            
            # Verify report paths are saved in database
            from app.crud import report_crud
            db_report1 = report_crud.get(db_session, report_id=report_id1)
            db_report2 = report_crud.get(db_session, report_id=report_id2)
            assert db_report1.report_path == f"gs://test-bucket/runs/{report_id1}.json"
            assert db_report2.report_path == f"gs://test-bucket/runs/{report_id2}.json"

    def test_same_filename_different_reports(self, client, db_session):
        """Test that same filename in different reports doesn't conflict"""
        with patch('app.api.v1.endpoints.reports.upload_to_gcp_bucket') as mock_upload:
            def mock_upload_side_effect(file, file_path):
                return f"gs://test-bucket/{file_path}"
            
            mock_upload.side_effect = mock_upload_side_effect
            
            # Create first report with "document.pdf"
            test_file1 = BytesIO(b"Test file 1 content")
            data1 = {
                "startup_name": "Startup 1",
                "launch_date": "2024-01-15",
                "founder_name": "John Doe",
                "file_types": ["pitch deck"]
            }
            files1 = [("files", ("document.pdf", test_file1, "application/pdf"))]
            
            response1 = client.post("/api/v1/reports/", data=data1, files=files1)
            assert response1.status_code == 200
            result1 = response1.json()
            report_id1 = result1["report_id"]
            
            # Create second report with same filename "document.pdf"
            test_file2 = BytesIO(b"Test file 2 content")
            data2 = {
                "startup_name": "Startup 2",
                "launch_date": "2024-01-16",
                "founder_name": "Jane Smith",
                "file_types": ["pitch deck"]
            }
            files2 = [("files", ("document.pdf", test_file2, "application/pdf"))]
            
            response2 = client.post("/api/v1/reports/", data=data2, files=files2)
            assert response2.status_code == 200
            result2 = response2.json()
            report_id2 = result2["report_id"]
            
            # Verify both uploads succeeded with different paths
            assert mock_upload.call_count == 2
            
            first_call_path = mock_upload.call_args_list[0][0][1]
            second_call_path = mock_upload.call_args_list[1][0][1]
            
            # Same filename but different report_id paths
            assert first_call_path == f"uploads/{report_id1}/document.pdf"
            assert second_call_path == f"uploads/{report_id2}/document.pdf"
            assert first_call_path != second_call_path

    def test_report_path_structure(self, client, db_session):
        """Test that report_path follows the correct structure"""
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
            
            response = client.post("/api/v1/reports/", data=data, files=files)
            assert response.status_code == 200
            result = response.json()
            
            # Verify report_path structure
            assert result["report_path"] == f"gs://test-bucket/runs/{result['report_id']}.json"
            assert result["report_path"].startswith("gs://test-bucket/runs/")
            assert result["report_path"].endswith(".json")
            assert result["report_id"] in result["report_path"]
            
            # Verify report_path is saved in database
            from app.crud import report_crud
            db_report = report_crud.get(db_session, report_id=result["report_id"])
            assert db_report.report_path == f"gs://test-bucket/runs/{result['report_id']}.json"
