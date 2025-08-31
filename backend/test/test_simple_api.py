"""
Simple test script for Report API
"""

import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/v1/health")
        print(f"Health check status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Health check passed!")
            return True
        else:
            print(f"❌ Health check failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_create_report():
    """Test creating a report with file uploads"""
    
    # Create test file content
    test_content = "This is a test document for startup analysis."
    
    # Test data
    test_data = {
        "startup_name": "TestStartup",
        "launch_date": "2024-01-15",
        "founder_name": "John Doe"
    }
    
    # Create form data
    form_data = {
        "startup_name": test_data["startup_name"],
        "launch_date": test_data["launch_date"],
        "founder_name": test_data["founder_name"],
        "file_types": "pitch deck"
    }
    
    # Create files
    files = {
        "files": ("test_document.txt", test_content, "text/plain")
    }
    
    try:
        print("Testing report creation...")
        print(f"API URL: {API_URL}")
        print(f"Test data: {test_data}")
        
        # Make the request
        response = requests.post(
            API_URL,
            data=form_data,
            files=files
        )
        
        print(f"Response status: {response.status_code}")
        
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

if __name__ == "__main__":
    print("🚀 Starting Simple Report API Tests")
    print("=" * 50)
    
    # Test health first
    if not test_health():
        print("❌ Health check failed. Make sure the server is running.")
        exit(1)
    
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
