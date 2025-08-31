"""
Test CRUD operations
"""

import pytest
from datetime import datetime, timedelta

from app.crud import user_crud, report_crud, upload_crud
from app.schemas import UserCreate, ReportCreate, UploadCreate
from app.models.report import ReportStatus


class TestUserCRUD:
    """Test User CRUD operations"""

    def test_create_user(self, db_session):
        """Test creating a user"""
        user_data = UserCreate(
            user_firstname="John",
            user_lastname="Doe",
            user_email="john.doe@example.com"
        )
        
        user = user_crud.create(db_session, obj_in=user_data)
        
        assert user.user_firstname == "John"
        assert user.user_lastname == "Doe"
        assert user.user_email == "john.doe@example.com"
        assert user.user_id is not None
        assert user.created_at is not None

    def test_get_user(self, db_session, sample_user):
        """Test getting a user by ID"""
        user = user_crud.get(db_session, user_id=sample_user.user_id)
        
        assert user is not None
        assert user.user_id == sample_user.user_id
        assert user.user_email == sample_user.user_email

    def test_get_user_not_found(self, db_session):
        """Test getting a non-existent user"""
        user = user_crud.get(db_session, user_id="non-existent-id")
        assert user is None

    def test_get_multi_users(self, db_session):
        """Test getting multiple users"""
        # Create multiple users
        users_data = [
            UserCreate(user_firstname="John", user_lastname="Doe", user_email="john@example.com"),
            UserCreate(user_firstname="Jane", user_lastname="Smith", user_email="jane@example.com"),
            UserCreate(user_firstname="Bob", user_lastname="Johnson", user_email="bob@example.com")
        ]
        
        for user_data in users_data:
            user_crud.create(db_session, obj_in=user_data)
        
        # Test pagination
        users = user_crud.get_multi(db_session, skip=0, limit=2)
        assert len(users) == 2
        
        users = user_crud.get_multi(db_session, skip=2, limit=2)
        assert len(users) == 1

    def test_update_user(self, db_session, sample_user):
        """Test updating a user"""
        from app.schemas import UserUpdate
        
        update_data = UserUpdate(user_firstname="Updated John")
        updated_user = user_crud.update(db_session, db_obj=sample_user, obj_in=update_data)
        
        assert updated_user.user_firstname == "Updated John"
        assert updated_user.user_lastname == sample_user.user_lastname  # Unchanged

    def test_delete_user(self, db_session, sample_user):
        """Test deleting a user"""
        user = user_crud.remove(db_session, user_id=sample_user.user_id)
        
        assert user.user_id == sample_user.user_id
        
        # Verify user is deleted
        deleted_user = user_crud.get(db_session, user_id=sample_user.user_id)
        assert deleted_user is None


class TestReportCRUD:
    """Test Report CRUD operations"""

    def test_create_report(self, db_session):
        """Test creating a report"""
        report_data = ReportCreate(
            report_name="Test Startup Report",
            startup_name="Test Startup",
            founder_name="John Doe"
        )
        
        report = report_crud.create(db_session, obj_in=report_data)
        
        assert report.report_name == "Test Startup Report"
        assert report.startup_name == "Test Startup"
        assert report.founder_name == "John Doe"
        assert report.report_id is not None
        assert report.status == ReportStatus.PENDING
        assert report.is_delete is False
        assert report.is_pinned is False
        assert report.created_at is not None

    def test_get_report(self, db_session, sample_report):
        """Test getting a report by ID"""
        report = report_crud.get(db_session, report_id=sample_report.report_id)
        
        assert report is not None
        assert report.report_id == sample_report.report_id
        assert report.startup_name == sample_report.startup_name

    def test_get_report_not_found(self, db_session):
        """Test getting a non-existent report"""
        report = report_crud.get(db_session, report_id="non-existent-id")
        assert report is None

    def test_get_multi_reports(self, db_session):
        """Test getting multiple reports"""
        # Create multiple reports
        reports_data = [
            ReportCreate(report_name="Report 1", startup_name="Startup 1", founder_name="Founder 1"),
            ReportCreate(report_name="Report 2", startup_name="Startup 2", founder_name="Founder 2"),
            ReportCreate(report_name="Report 3", startup_name="Startup 3", founder_name="Founder 3")
        ]
        
        for report_data in reports_data:
            report_crud.create(db_session, obj_in=report_data)
        
        # Test pagination
        reports = report_crud.get_multi(db_session, skip=0, limit=2)
        assert len(reports) == 2
        
        reports = report_crud.get_multi(db_session, skip=2, limit=2)
        assert len(reports) == 1

    def test_get_by_status(self, db_session):
        """Test getting reports by status"""
        # Create reports with different statuses
        pending_report = report_crud.create(db_session, obj_in=ReportCreate(
            report_name="Pending Report", startup_name="Startup 1", founder_name="Founder 1"
        ))
        
        success_report = report_crud.create(db_session, obj_in=ReportCreate(
            report_name="Success Report", startup_name="Startup 2", founder_name="Founder 2"
        ))
        
        # Update success report status
        from app.schemas import ReportUpdate
        report_crud.update(db_session, db_obj=success_report, obj_in=ReportUpdate(status=ReportStatus.SUCCESS))
        
        # Test filtering by status
        pending_reports = report_crud.get_by_status(db_session, status=ReportStatus.PENDING)
        assert len(pending_reports) == 1
        assert pending_reports[0].report_id == pending_report.report_id
        
        success_reports = report_crud.get_by_status(db_session, status=ReportStatus.SUCCESS)
        assert len(success_reports) == 1
        assert success_reports[0].report_id == success_report.report_id

    def test_get_pinned_reports(self, db_session):
        """Test getting pinned reports"""
        # Create reports with different pin status
        pinned_report = report_crud.create(db_session, obj_in=ReportCreate(
            report_name="Pinned Report", startup_name="Startup 1", founder_name="Founder 1"
        ))
        
        unpinned_report = report_crud.create(db_session, obj_in=ReportCreate(
            report_name="Unpinned Report", startup_name="Startup 2", founder_name="Founder 2"
        ))
        
        # Pin the first report
        from app.schemas import ReportUpdate
        report_crud.update(db_session, db_obj=pinned_report, obj_in=ReportUpdate(is_pinned=True))
        
        # Test getting pinned reports
        pinned_reports = report_crud.get_pinned(db_session)
        assert len(pinned_reports) == 1
        assert pinned_reports[0].report_id == pinned_report.report_id

    def test_search_reports(self, db_session):
        """Test searching reports"""
        # Create reports with different names
        report_crud.create(db_session, obj_in=ReportCreate(
            report_name="Tech Startup Report", startup_name="TechCorp", founder_name="John Doe"
        ))
        
        report_crud.create(db_session, obj_in=ReportCreate(
            report_name="Finance Startup Report", startup_name="FinanceCorp", founder_name="Jane Smith"
        ))
        
        # Test search
        tech_reports = report_crud.search(db_session, search_term="Tech")
        assert len(tech_reports) == 1
        assert "Tech" in tech_reports[0].startup_name

    def test_soft_delete_report(self, db_session, sample_report):
        """Test soft deleting a report"""
        deleted_report = report_crud.soft_delete(db_session, report_id=sample_report.report_id)
        
        assert deleted_report.is_delete is True
        
        # Report should still exist but be marked as deleted
        report = report_crud.get(db_session, report_id=sample_report.report_id)
        assert report is not None
        assert report.is_delete is True

    def test_toggle_pin_report(self, db_session, sample_report):
        """Test toggling pin status"""
        # Pin the report
        pinned_report = report_crud.toggle_pin(db_session, report_id=sample_report.report_id)
        assert pinned_report.is_pinned is True
        
        # Unpin the report
        unpinned_report = report_crud.toggle_pin(db_session, report_id=sample_report.report_id)
        assert unpinned_report.is_pinned is False


class TestUploadCRUD:
    """Test Upload CRUD operations"""

    def test_create_upload(self, db_session, sample_report):
        """Test creating an upload"""
        upload_data = UploadCreate(
            user_id="test-user-123",
            report_id=sample_report.report_id,
            filename="test_document.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/test_document.pdf"
        )
        
        upload = upload_crud.create(db_session, obj_in=upload_data)
        
        assert upload.user_id == "test-user-123"
        assert upload.report_id == sample_report.report_id
        assert upload.filename == "test_document.pdf"
        assert upload.file_format == "pitch deck"
        assert upload.upload_path == "gs://test-bucket/uploads/test_document.pdf"
        assert upload.file_id is not None
        assert upload.created_at is not None

    def test_get_upload(self, db_session, sample_upload):
        """Test getting an upload by ID"""
        upload = upload_crud.get(db_session, file_id=sample_upload.file_id)
        
        assert upload is not None
        assert upload.file_id == sample_upload.file_id
        assert upload.filename == sample_upload.filename

    def test_get_upload_not_found(self, db_session):
        """Test getting a non-existent upload"""
        upload = upload_crud.get(db_session, file_id="non-existent-id")
        assert upload is None

    def test_get_by_report(self, db_session, sample_report):
        """Test getting uploads by report ID"""
        # Create multiple uploads for the same report
        uploads_data = [
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="document1.pdf",
                file_format="pitch deck",
                upload_path="gs://test-bucket/uploads/document1.pdf"
            ),
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="document2.pdf",
                file_format="call recording",
                upload_path="gs://test-bucket/uploads/document2.pdf"
            )
        ]
        
        for upload_data in uploads_data:
            upload_crud.create(db_session, obj_in=upload_data)
        
        # Test getting uploads by report
        uploads = upload_crud.get_by_report(db_session, report_id=sample_report.report_id)
        assert len(uploads) == 2

    def test_get_by_user(self, db_session, sample_report):
        """Test getting uploads by user ID"""
        # Create uploads for different users
        upload1_data = UploadCreate(
            user_id="user-1",
            report_id=sample_report.report_id,
            filename="user1_doc.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/user1_doc.pdf"
        )
        
        upload2_data = UploadCreate(
            user_id="user-2",
            report_id=sample_report.report_id,
            filename="user2_doc.pdf",
            file_format="pitch deck",
            upload_path="gs://test-bucket/uploads/user2_doc.pdf"
        )
        
        upload_crud.create(db_session, obj_in=upload1_data)
        upload_crud.create(db_session, obj_in=upload2_data)
        
        # Test getting uploads by user
        user1_uploads = upload_crud.get_by_user(db_session, user_id="user-1")
        assert len(user1_uploads) == 1
        assert user1_uploads[0].user_id == "user-1"

    def test_get_by_file_format(self, db_session, sample_report):
        """Test getting uploads by file format"""
        # Create uploads with different formats
        uploads_data = [
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="pitch_deck.pdf",
                file_format="pitch deck",
                upload_path="gs://test-bucket/uploads/pitch_deck.pdf"
            ),
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="call_recording.mp3",
                file_format="call recording",
                upload_path="gs://test-bucket/uploads/call_recording.mp3"
            )
        ]
        
        for upload_data in uploads_data:
            upload_crud.create(db_session, obj_in=upload_data)
        
        # Test getting uploads by format
        pitch_deck_uploads = upload_crud.get_by_file_format(db_session, file_format="pitch deck")
        assert len(pitch_deck_uploads) == 1
        assert pitch_deck_uploads[0].file_format == "pitch deck"

    def test_search_uploads(self, db_session, sample_report):
        """Test searching uploads by filename"""
        # Create uploads with different filenames
        uploads_data = [
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="tech_pitch_deck.pdf",
                file_format="pitch deck",
                upload_path="gs://test-bucket/uploads/tech_pitch_deck.pdf"
            ),
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="finance_pitch_deck.pdf",
                file_format="pitch deck",
                upload_path="gs://test-bucket/uploads/finance_pitch_deck.pdf"
            )
        ]
        
        for upload_data in uploads_data:
            upload_crud.create(db_session, obj_in=upload_data)
        
        # Test search
        tech_uploads = upload_crud.search(db_session, search_term="tech")
        assert len(tech_uploads) == 1
        assert "tech" in tech_uploads[0].filename.lower()

    def test_delete_upload(self, db_session, sample_upload):
        """Test deleting an upload"""
        upload = upload_crud.remove(db_session, file_id=sample_upload.file_id)
        
        assert upload.file_id == sample_upload.file_id
        
        # Verify upload is deleted
        deleted_upload = upload_crud.get(db_session, file_id=sample_upload.file_id)
        assert deleted_upload is None

    def test_delete_by_report(self, db_session, sample_report):
        """Test deleting all uploads for a report"""
        # Create multiple uploads for the report
        uploads_data = [
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="document1.pdf",
                file_format="pitch deck",
                upload_path="gs://test-bucket/uploads/document1.pdf"
            ),
            UploadCreate(
                user_id="test-user-123",
                report_id=sample_report.report_id,
                filename="document2.pdf",
                file_format="call recording",
                upload_path="gs://test-bucket/uploads/document2.pdf"
            )
        ]
        
        for upload_data in uploads_data:
            upload_crud.create(db_session, obj_in=upload_data)
        
        # Delete all uploads for the report
        deleted_uploads = upload_crud.delete_by_report(db_session, report_id=sample_report.report_id)
        assert len(deleted_uploads) == 2
        
        # Verify all uploads are deleted
        remaining_uploads = upload_crud.get_by_report(db_session, report_id=sample_report.report_id)
        assert len(remaining_uploads) == 0
