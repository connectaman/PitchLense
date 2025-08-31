"""
Test script for Pinned Filter functionality
"""

import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_pinned_filter():
    """Test filtering by pinned status"""
    
    try:
        print("Testing pinned filter...")
        
        # Test with pinned_only=true
        response = requests.get(f"{API_URL}/?pinned_only=true")
        
        print(f"Response status: {response.status_code}")
        print(f"Response URL: {response.url}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Pinned filter successful!")
            print(f"Total pinned reports: {result.get('total', 0)}")
            print(f"Reports returned: {len(result.get('reports', []))}")
            
            # Print first few reports to see their pinned status
            for i, report in enumerate(result.get('reports', [])[:3]):
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
        
        print(f"Response status: {response.status_code}")
        
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
    print("🚀 Testing Pinned Filter Functionality")
    print("=" * 50)
    
    # Test getting all reports first
    all_reports = test_all_reports()
    
    # Test pinned filter
    pinned_reports = test_pinned_filter()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")
    
    if all_reports and pinned_reports:
        print("✅ Both tests passed!")
    else:
        print("❌ Some tests failed!")
