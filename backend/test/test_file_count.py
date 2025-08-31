"""
Test script to verify file count functionality
"""

import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_create_report_with_files():
    """Create a report with multiple files"""
    
    # Create test file content
    test_content1 = "This is test document 1 for startup analysis."
    test_content2 = "This is test document 2 for startup analysis."
    test_content3 = "This is test document 3 for startup analysis."
    
    # Test data
    test_data = {
        "startup_name": "FileCountTestStartup",
        "launch_date": "2024-01-15",
        "founder_name": "File Count Test Founder"
    }
    
    # Create form data
    form_data = {
        "startup_name": test_data["startup_name"],
        "launch_date": test_data["launch_date"],
        "founder_name": test_data["founder_name"],
        "file_types": ["pitch deck", "call recording", "meeting recording"]
    }
    
    # Create files
    files = [
        ("files", ("test_document1.txt", test_content1, "text/plain")),
        ("files", ("test_document2.txt", test_content2, "text/plain")),
        ("files", ("test_document3.txt", test_content3, "text/plain"))
    ]
    
    try:
        print("Creating test report with 3 files...")
        
        # Create the report
        response = requests.post(
            API_URL,
            data=form_data,
            files=files
        )
        
        if response.status_code == 200:
            result = response.json()
            report_id = result.get('report_id')
            print(f"✅ Report created successfully! ID: {report_id}")
            return report_id
        else:
            print(f"❌ Failed to create report: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_reports_with_file_count():
    """Test getting reports with file count"""
    
    try:
        print("\nTesting get reports with file count...")
        
        response = requests.get(API_URL)
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Reports retrieved successfully!")
            print(f"Total reports: {result.get('total', 0)}")
            
            # Check each report for file count
            for i, report in enumerate(result.get('reports', [])):
                print(f"  Report {i+1}: {report.get('startup_name')}")
                print(f"    - File count: {report.get('file_count', 'Not available')}")
                print(f"    - Report ID: {report.get('report_id')}")
            
            return result
        else:
            print(f"❌ Failed to get reports")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        return None

def test_get_single_report_with_file_count(report_id):
    """Test getting a single report with file count"""
    
    try:
        print(f"\nTesting get single report {report_id} with file count...")
        
        response = requests.get(f"{API_URL}/{report_id}")
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Single report retrieved successfully!")
            print(f"  Report: {result.get('startup_name')}")
            print(f"  File count: {result.get('file_count', 'Not available')}")
            print(f"  Report ID: {result.get('report_id')}")
            
            return result
        else:
            print(f"❌ Failed to get single report")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Testing File Count Functionality")
    print("=" * 50)
    
    # Create a report with multiple files
    report_id = test_create_report_with_files()
    
    if not report_id:
        print("❌ Could not create report. Exiting.")
        exit(1)
    
    # Wait a moment for processing
    print("Waiting 2 seconds for processing...")
    time.sleep(2)
    
    # Test getting all reports with file count
    all_reports = test_get_reports_with_file_count()
    
    # Test getting single report with file count
    single_report = test_get_single_report_with_file_count(report_id)
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")
    
    if all_reports and single_report:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
