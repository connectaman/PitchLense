"""
Test script for Report API
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json
from pathlib import Path

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_create_report():
    """Test creating a report with file uploads"""
    
    # Test data
    test_data = {
        "startup_name": "TestStartup",
        "launch_date": "2024-01-15",
        "founder_name": "John Doe"
    }
    
    # Create test files
    test_files = []
    file_types = []
    
    # Create a test text file
    test_file_path = "test_document.txt"
    with open(test_file_path, "w") as f:
        f.write("This is a test document for startup analysis.")
    
    test_files.append(("files", (test_file_path, open(test_file_path, "rb"), "text/plain")))
    file_types.append("pitch deck")
    
    # Add form data
    form_data = {
        "startup_name": test_data["startup_name"],
        "launch_date": test_data["launch_date"],
        "founder_name": test_data["founder_name"],
        "file_types": json.dumps(file_types)  # Send as JSON string
    }
    
    try:
        print("Testing report creation...")
        print(f"API URL: {API_URL}")
        print(f"Test data: {test_data}")
        
        # Make the request
        response = requests.post(
            API_URL,
            data=form_data,
            files=test_files
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Report created successfully!")
            print(f"Report ID: {result.get('report_id')}")
            print(f"Report Name: {result.get('report_name')}")
            print(f"Status: {result.get('status')}")
            return result
        else:
            print(f"❌ Failed to create report")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during API test: {e}")
        return None
    finally:
        # Clean up test file
        if os.path.exists(test_file_path):
            os.remove(test_file_path)


def test_get_reports():
    """Test getting list of reports"""
    
    try:
        print("\nTesting get reports...")
        
        response = requests.get(API_URL)
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Reports retrieved successfully!")
            print(f"Total reports: {result.get('total', 0)}")
            print(f"Reports: {len(result.get('reports', []))}")
            return result
        else:
            print(f"❌ Failed to get reports")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during API test: {e}")
        return None


def test_health_check():
    """Test health endpoint"""
    
    try:
        print("\nTesting health check...")
        
        response = requests.get(f"{BASE_URL}/api/v1/health")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Health check passed!")
            return True
        else:
            print(f"❌ Health check failed")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during health check: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Starting Report API Tests")
    print("=" * 50)
    
    # Test health first
    if not test_health_check():
        print("❌ Health check failed. Make sure the server is running.")
        sys.exit(1)
    
    # Test report creation
    report = test_create_report()
    
    # Test getting reports
    reports = test_get_reports()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")
    
    if report and reports:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
