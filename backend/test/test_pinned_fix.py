"""
Simple test to verify pinned filter fix
"""

import requests

# Test configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1/reports"

def test_pinned_filter():
    """Test the pinned filter"""
    
    try:
        print("Testing pinned filter with string parameter...")
        
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

if __name__ == "__main__":
    print("🚀 Testing Pinned Filter Fix")
    print("=" * 40)
    
    test_pinned_filter()
    
    print("\n" + "=" * 40)
    print("�� Test completed!")
