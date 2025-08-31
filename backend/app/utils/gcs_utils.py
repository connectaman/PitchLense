"""
Google Cloud Storage utility functions
"""

from google.cloud import storage
from app.core.config import settings
from typing import Optional


def get_gcs_client():
    """
    Get GCS client with proper authentication
    
    Returns:
        storage.Client: Authenticated GCS client
    """
    if settings.GOOGLE_APPLICATION_CREDENTIALS:
        return storage.Client.from_service_account_json(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )
    else:
        return storage.Client(project=settings.GOOGLE_CLOUD_PROJECT)


def gcs_path_to_public_url(gcs_path: str) -> str:
    """
    Convert GCS path to public URL
    
    Args:
        gcs_path: GCS path in format gs://bucket-name/path/to/file
        
    Returns:
        Public URL for the file
    """
    try:
        # Parse GCS path
        if not gcs_path.startswith('gs://'):
            raise ValueError(f"Invalid GCS path format: {gcs_path}")
        
        # Remove gs:// prefix
        path_without_prefix = gcs_path[5:]
        
        # Split into bucket and blob path
        if '/' not in path_without_prefix:
            raise ValueError(f"Invalid GCS path format: {gcs_path}")
        
        bucket_name = path_without_prefix.split('/')[0]
        blob_path = '/'.join(path_without_prefix.split('/')[1:])
        
        # Get client and bucket
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        
        # Generate signed URL (expires in 1 hour)
        url = blob.generate_signed_url(
            version="v4",
            expiration=3600,  # 1 hour
            method="GET"
        )
        
        return url
        
    except Exception as e:
        raise ValueError(f"Failed to generate public URL for {gcs_path}: {str(e)}")


def gcs_path_to_download_url(gcs_path: str, expiration: int = 3600) -> str:
    """
    Convert GCS path to signed download URL
    
    Args:
        gcs_path: GCS path in format gs://bucket-name/path/to/file
        expiration: URL expiration time in seconds (default: 1 hour)
        
    Returns:
        Signed download URL
    """
    try:
        # Parse GCS path
        if not gcs_path.startswith('gs://'):
            raise ValueError(f"Invalid GCS path format: {gcs_path}")
        
        # Remove gs:// prefix
        path_without_prefix = gcs_path[5:]
        
        # Split into bucket and blob path
        if '/' not in path_without_prefix:
            raise ValueError(f"Invalid GCS path format: {gcs_path}")
        
        bucket_name = path_without_prefix.split('/')[0]
        blob_path = '/'.join(path_without_prefix.split('/')[1:])
        
        # Get client and bucket
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        
        # Generate signed URL for download
        url = blob.generate_signed_url(
            version="v4",
            expiration=expiration,
            method="GET"
        )
        
        return url
        
    except Exception as e:
        raise ValueError(f"Failed to generate download URL for {gcs_path}: {str(e)}")


def delete_gcs_file(gcs_path: str) -> bool:
    """
    Delete file from GCS
    
    Args:
        gcs_path: GCS path in format gs://bucket-name/path/to/file
        
    Returns:
        True if deleted successfully, False otherwise
    """
    try:
        # Parse GCS path
        if not gcs_path.startswith('gs://'):
            raise ValueError(f"Invalid GCS path format: {gcs_path}")
        
        # Remove gs:// prefix
        path_without_prefix = gcs_path[5:]
        
        # Split into bucket and blob path
        if '/' not in path_without_prefix:
            raise ValueError(f"Invalid GCS path format: {gcs_path}")
        
        bucket_name = path_without_prefix.split('/')[0]
        blob_path = '/'.join(path_without_prefix.split('/')[1:])
        
        # Get client and bucket
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        
        # Delete the blob
        blob.delete()
        
        return True
        
    except Exception as e:
        print(f"Failed to delete GCS file {gcs_path}: {str(e)}")
        return False


def file_exists_in_gcs(gcs_path: str) -> bool:
    """
    Check if file exists in GCS
    
    Args:
        gcs_path: GCS path in format gs://bucket-name/path/to/file
        
    Returns:
        True if file exists, False otherwise
    """
    try:
        # Parse GCS path
        if not gcs_path.startswith('gs://'):
            return False
        
        # Remove gs:// prefix
        path_without_prefix = gcs_path[5:]
        
        # Split into bucket and blob path
        if '/' not in path_without_prefix:
            return False
        
        bucket_name = path_without_prefix.split('/')[0]
        blob_path = '/'.join(path_without_prefix.split('/')[1:])
        
        # Get client and bucket
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        
        # Check if blob exists
        return blob.exists()
        
    except Exception:
        return False


def get_file_size_from_gcs(gcs_path: str) -> Optional[int]:
    """
    Get file size from GCS
    
    Args:
        gcs_path: GCS path in format gs://bucket-name/path/to/file
        
    Returns:
        File size in bytes, or None if file doesn't exist
    """
    try:
        # Parse GCS path
        if not gcs_path.startswith('gs://'):
            return None
        
        # Remove gs:// prefix
        path_without_prefix = gcs_path[5:]
        
        # Split into bucket and blob path
        if '/' not in path_without_prefix:
            return None
        
        bucket_name = path_without_prefix.split('/')[0]
        blob_path = '/'.join(path_without_prefix.split('/')[1:])
        
        # Get client and bucket
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        
        # Get blob metadata
        blob.reload()
        
        return blob.size
        
    except Exception:
        return None
