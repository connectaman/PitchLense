"""
Test script to create a report, pin it, and test the filter
"""

import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_create_and_pin_report():
    """Create a report and pin it"""
    
    # Create test file content
    test_content = "This is a test document for pinning."
    
    # Test data
    test_data = {
        "startup_name": "PinTestStartup",
        "launch_date": "2024-01-15",
        "founder_name": "Pin Test Founder"
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
        print("Creating test report...")
        
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
            
            # Wait a moment
            time.sleep(1)
            
            # Pin the report
            print(f"Pinning report {report_id}...")
            pin_response = requests.patch(f"{API_URL}/{report_id}/pin")
            
            if pin_response.status_code == 200:
                print("✅ Report pinned successfully!")
                return report_id
            else:
                print(f"❌ Failed to pin report: {pin_response.text}")
                return None
        else:
            print(f"❌ Failed to create report: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_pinned_filter():
    """Test the pinned filter"""
    
    try:
        print("\nTesting pinned filter...")
        
        # Test with pinned_only=true
        response = requests.get(f"{API_URL}/?pinned_only=true")
        
        print(f"Response status: {response.status_code}")
        print(f"Response URL: {response.url}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Pinned filter successful!")
            print(f"Total pinned reports: {result.get('total', 0)}")
            print(f"Reports returned: {len(result.get('reports', []))}")
            
            # Print all reports to see their pinned status
            for i, report in enumerate(result.get('reports', [])):
                print(f"  Report {i+1}: {report.get('startup_name')} - Pinned: {report.get('is_pinned')}")
            
            return result
        else:
            print(f"❌ Failed to filter by pinned status")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during pinned filter test: {e}")
        return None

def test_all_reports():
    """Test getting all reports for comparison"""
    
    try:
        print("\nTesting get all reports...")
        
        response = requests.get(API_URL)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ All reports retrieved successfully!")
            print(f"Total reports: {result.get('total', 0)}")
            
            # Count pinned reports
            pinned_count = sum(1 for report in result.get('reports', []) if report.get('is_pinned'))
            print(f"Pinned reports in total: {pinned_count}")
            
            return result
        else:
            print(f"❌ Failed to get all reports")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during all reports test: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Testing Pin and Filter Functionality")
    print("=" * 50)
    
    # Create and pin a report
    report_id = test_create_and_pin_report()
    
    if not report_id:
        print("❌ Could not create and pin report. Exiting.")
        exit(1)
    
    # Wait a moment for processing
    print("Waiting 2 seconds for processing...")
    time.sleep(2)
    
    # Test getting all reports
    all_reports = test_all_reports()
    
    # Test pinned filter
    pinned_reports = test_pinned_filter()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")
    
    if all_reports and pinned_reports:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
