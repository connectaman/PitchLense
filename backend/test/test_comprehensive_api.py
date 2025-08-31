"""
Comprehensive test script for Reports API
"""

import requests
import json
import time

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
        "startup_name": "FilterTestStartup",
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

def test_search_reports():
    """Test searching reports"""
    
    try:
        print("\nTesting search reports...")
        
        response = requests.get(f"{API_URL}/?search=FilterTestStartup")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Search reports successful!")
            print(f"Total reports found: {result.get('total', 0)}")
            return result
        else:
            print(f"❌ Failed to search reports")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during search test: {e}")
        return None

def test_filter_by_status():
    """Test filtering by status"""
    
    try:
        print("\nTesting filter by status...")
        
        response = requests.get(f"{API_URL}/?status=pending")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Filter by status successful!")
            print(f"Total pending reports: {result.get('total', 0)}")
            return result
        else:
            print(f"❌ Failed to filter by status")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during status filter test: {e}")
        return None

def test_pinned_filter():
    """Test filtering by pinned status"""
    
    try:
        print("\nTesting pinned filter...")
        
        response = requests.get(f"{API_URL}/?pinned_only=true")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Pinned filter successful!")
            print(f"Total pinned reports: {result.get('total', 0)}")
            return result
        else:
            print(f"❌ Failed to filter by pinned status")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during pinned filter test: {e}")
        return None

def test_toggle_pin(report_id):
    """Test toggling pin status"""
    
    try:
        print(f"\nTesting toggle pin for report {report_id}...")
        
        response = requests.patch(f"{API_URL}/{report_id}/pin")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Toggle pin successful!")
            print(f"Message: {result.get('message')}")
            return result
        else:
            print(f"❌ Failed to toggle pin")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during toggle pin test: {e}")
        return None

def test_delete_report(report_id):
    """Test deleting a report"""
    
    try:
        print(f"\nTesting delete report {report_id}...")
        
        response = requests.delete(f"{API_URL}/{report_id}")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Delete report successful!")
            print(f"Message: {result.get('message')}")
            return result
        else:
            print(f"❌ Failed to delete report")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during delete test: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Starting Comprehensive Reports API Tests")
    print("=" * 60)
    
    # Test health first
    if not test_health():
        print("❌ Health check failed. Make sure the server is running.")
        exit(1)
    
    # Test report creation
    report = test_create_report()
    
    if not report:
        print("❌ Report creation failed. Cannot continue with other tests.")
        exit(1)
    
    report_id = report.get('report_id')
    
    # Wait a moment for the report to be processed
    print("Waiting 2 seconds for report processing...")
    time.sleep(2)
    
    # Test getting reports
    reports = test_get_reports()
    
    # Test searching reports
    search_results = test_search_reports()
    
    # Test filtering by status
    status_filter = test_filter_by_status()
    
    # Test filtering by pinned status
    pinned_filter = test_pinned_filter()
    
    # Test toggling pin status
    pin_result = test_toggle_pin(report_id)
    
    # Wait a moment
    time.sleep(1)
    
    # Test toggling pin status again (should unpin)
    pin_result2 = test_toggle_pin(report_id)
    
    # Test deleting the report
    delete_result = test_delete_report(report_id)
    
    print("\n" + "=" * 60)
    print("🏁 Comprehensive test completed!")
    
    if report and reports and search_results:
        print("✅ All core tests passed!")
    else:
        print("❌ Some tests failed!")
    
    print(f"✅ Created and tested report: {report_id}")
