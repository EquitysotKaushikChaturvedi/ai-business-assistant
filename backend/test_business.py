import requests

def test_create_business():
    # 1. Login to get token
    login_url = "http://localhost:8000/auth/token"
    login_data = {"username": "admin@example.com", "password": "Admin@123"}
    
    try:
        response = requests.post(login_url, data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} - {response.text}")
            return
        
        token = response.json()["access_token"]
        print("Login successful. Token received.")
        
        # 2. Create Business
        business_url = "http://localhost:8000/business/"
        headers = {"Authorization": f"Bearer {token}"}
        business_data = {
            "name": "Test Business",
            "description": "A test business description.",
            "services": "Testing, Debugging",
            "address": "123 Test St",
            "contact": "test@example.com",
            "operating_hours": "9-5"
        }
        
        response = requests.post(business_url, json=business_data, headers=headers)
        if response.status_code == 200:
            print("Business created successfully.")
            print(response.json())
        elif response.status_code == 400 and "already exists" in response.text:
             print("Business already exists.")
        else:
            print(f"Create Business failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_create_business()
