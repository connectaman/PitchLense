"""
Test script for Reports endpoint
"""

import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_get_reports():
    """Test getting list of reports"""
    
    try:
        print("Testing get reports...")
        
        response = requests.get(API_URL)
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Reports retrieved successfully!")
            print(f"Total reports: {result.get('total', 0)}")
            print(f"Reports: {len(result.get('reports', []))}")
            
            # Print first report details
            if result.get('reports'):
                first_report = result['reports'][0]
                print(f"\nFirst report details:")
                print(f"  Report ID: {first_report.get('report_id')}")
                print(f"  Report Name: {first_report.get('report_name')}")
                print(f"  Startup Name: {first_report.get('startup_name')}")
                print(f"  Founder Name: {first_report.get('founder_name')}")
                print(f"  Status: {first_report.get('status')}")
                print(f"  Created At: {first_report.get('created_at')}")
            
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
        
        response = requests.get(f"{API_URL}/?search=TestStartup")
        
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

if __name__ == "__main__":
    print("🚀 Testing Reports Endpoint")
    print("=" * 50)
    
    # Test getting reports
    reports = test_get_reports()
    
    # Test searching reports
    search_results = test_search_reports()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")
    
    if reports:
        print("✅ Reports endpoint is working!")
    else:
        print("❌ Reports endpoint has issues!")
