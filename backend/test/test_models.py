"""
Test database models
"""

import pytest
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.models.report import Report, ReportStatus
from app.models.upload import Upload


class TestUserModel:
    """Test User model"""

    def test_create_user(self, db_session):
        """Test creating a user"""
        user = User(
            user_id="test-user-123",
            user_firstname="John",
            user_lastname="Doe",
            user_email="john.doe@example.com"
        )
        
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        assert user.user_id == "test-user-123"
        assert user.user_firstname == "John"
        assert user.user_lastname == "Doe"
        assert user.user_email == "john.doe@example.com"
        assert user.created_at is not None

    def test_user_repr(self, db_session):
        """Test user string representation"""
        user = User(
            user_id="test-user-123",
            user_firstname="John",
            user_lastname="Doe",
            user_email="john.doe@example.com"
        )
        
        db_session.add(user)
        db_session.commit()
        
        assert "test-user-123" in str(user)
        assert "John Doe" in str(user)

    def test_user_unique_email(self, db_session):
        """Test that email must be unique"""
        user1 = User(
            user_id="user-1",
            user_firstname="John",
            user_lastname="Doe",
            user_email="john.doe@example.com"
        )
        
        user2 = User(
            user_id="user-2",
            user_firstname="Jane",
            user_lastname="Doe",
            user_email="john.doe@example.com"  # Same email
        )
        
        db_session.add(user1)
        db_session.commit()
        
        db_session.add(user2)
        with pytest.raises(IntegrityError):
            db_session.commit()


class TestReportModel:
    """Test Report model"""

    def test_create_report(self, db_session):
        """Test creating a report"""
        report = Report(
            report_id="test-report-123",
            report_name="Test Startup Report",
            startup_name="Test Startup",
            founder_name="John Doe",
            status=ReportStatus.PENDING,
            is_delete=False,
            is_pinned=False
        )
        
        db_session.add(report)
        db_session.commit()
        db_session.refresh(report)
        
        assert report.report_id == "test-report-123"
        assert report.report_name == "Test Startup Report"
        assert report.startup_name == "Test Startup"
        assert report.founder_name == "John Doe"
        assert report.status == ReportStatus.PENDING
        assert report.is_delete is False
        assert report.is_pinned is False
        assert report.created_at is not None

    def test_report_repr(self, db_session):
        """Test report string representation"""
        report = Report(
            report_id="test-report-123",
            report_name="Test Startup Report",
            startup_name="Test Startup",
            founder_name="John Doe",
            status=ReportStatus.PENDING,
            is_delete=False,
            is_pinned=False
        )
        
        db_session.add(report)
        db_session.commit()
        
        assert "test-report-123" in str(report)
        assert "Test Startup" in str(report)

    def test_report_status_enum(self, db_session):
        """Test report status enum values"""
        # Test all status values
        statuses = [ReportStatus.PENDING, ReportStatus.SUCCESS, ReportStatus.FAILED]
        
        for i, status in enumerate(statuses):
            report = Report(
                report_id=f"test-report-{i}",
                report_name=f"Test Report {i}",
                startup_name=f"Test Startup {i}",
                founder_name="John Doe",
                status=status,
                is_delete=False,
                is_pinned=False
            )
            
            db_session.add(report)
        
        db_session.commit()
        
        # Verify all reports were created with correct statuses
        reports = db_session.query(Report).all()
        assert len(reports) == 3
        assert reports[0].status == ReportStatus.PENDING
        assert reports[1].status == ReportStatus.SUCCESS
        assert reports[2].status == ReportStatus.FAILED

    def test_report_default_values(self, db_session):
        """Test report default values"""
        report = Report(
            report_id="test-report-123",
            report_name="Test Report",
            startup_name="Test Startup",
            founder_name="John Doe"
        )
        
        db_session.add(report)
        db_session.commit()
        db_session.refresh(report)
        
        # Check default values
        assert report.status == ReportStatus.PENDING
        assert report.is_delete is False
        assert report.is_pinned is False
        assert report.created_at is not None


class TestUploadModel:
    """Test Upload model"""

    def test_create_upload(self, db_session, sample_report):
        """Test creating an upload"""
        upload = Upload(
            file_id="test-file-123",
            user_id="test-user-123",
            report_id=sample_report.report_id,
            filename="test_document.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/test_document.pdf"
        )
        
        db_session.add(upload)
        db_session.commit()
        db_session.refresh(upload)
        
        assert upload.file_id == "test-file-123"
        assert upload.user_id == "test-user-123"
        assert upload.report_id == sample_report.report_id
        assert upload.filename == "test_document.pdf"
        assert upload.file_format == "pitch deck"
        assert upload.upload_path == "gs://test-bucket/uploads/test_document.pdf"
        assert upload.created_at is not None

    def test_upload_repr(self, db_session, sample_report):
        """Test upload string representation"""
        upload = Upload(
            file_id="test-file-123",
            user_id="test-user-123",
            report_id=sample_report.report_id,
            filename="test_document.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/test_document.pdf"
        )
        
        db_session.add(upload)
        db_session.commit()
        
        assert "test-file-123" in str(upload)
        assert "test_document.pdf" in str(upload)

    def test_upload_file_extension_property(self, db_session, sample_report):
        """Test upload file_extension property"""
        upload = Upload(
            file_id="test-file-123",
            user_id="test-user-123",
            report_id=sample_report.report_id,
            filename="test_document.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/test_document.pdf"
        )
        
        db_session.add(upload)
        db_session.commit()
        
        assert upload.file_extension == "pdf"

    def test_upload_file_extension_no_extension(self, db_session, sample_report):
        """Test upload file_extension property with no extension"""
        upload = Upload(
            file_id="test-file-123",
            user_id="test-user-123",
            report_id=sample_report.report_id,
            filename="test_document",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/test_document"
        )
        
        db_session.add(upload)
        db_session.commit()
        
        assert upload.file_extension == ""

    def test_upload_foreign_key_constraint(self, db_session):
        """Test upload foreign key constraint"""
        upload = Upload(
            file_id="test-file-123",
            user_id="test-user-123",
            report_id="non-existent-report-id",  # Invalid report ID
            filename="test_document.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/test_document.pdf"
        )
        
        db_session.add(upload)
        with pytest.raises(IntegrityError):
            db_session.commit()


class TestModelRelationships:
    """Test model relationships"""

    def test_report_upload_relationship(self, db_session):
        """Test relationship between Report and Upload models"""
        # Create a report
        report = Report(
            report_id="test-report-123",
            report_name="Test Report",
            startup_name="Test Startup",
            founder_name="John Doe"
        )
        db_session.add(report)
        db_session.commit()
        
        # Create uploads for the report
        upload1 = Upload(
            file_id="test-file-1",
            user_id="test-user-123",
            report_id=report.report_id,
            filename="document1.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/document1.pdf"
        )
        
        upload2 = Upload(
            file_id="test-file-2",
            user_id="test-user-123",
            report_id=report.report_id,
            filename="document2.pdf",
            file_format="call recording",
            upload_path="gs://test-bucket/uploads/document2.pdf"
        )
        
        db_session.add_all([upload1, upload2])
        db_session.commit()
        
        # Test relationship
        assert len(report.uploads) == 2
        assert upload1.report == report
        assert upload2.report == report

    def test_cascade_delete(self, db_session):
        """Test cascade delete behavior"""
        # Create a report
        report = Report(
            report_id="test-report-123",
            report_name="Test Report",
            startup_name="Test Startup",
            founder_name="John Doe"
        )
        db_session.add(report)
        db_session.commit()
        
        # Create uploads for the report
        upload = Upload(
            file_id="test-file-1",
            user_id="test-user-123",
            report_id=report.report_id,
            filename="document1.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/document1.pdf"
        )
        db_session.add(upload)
        db_session.commit()
        
        # Delete the report
        db_session.delete(report)
        db_session.commit()
        
        # Check that upload was also deleted
        remaining_uploads = db_session.query(Upload).all()
        assert len(remaining_uploads) == 0
