import requests
import time

BASE_URL = "http://localhost:8000"

def test_health_check():
    print("Testing /health...")
    try:
        res = requests.get(f"{BASE_URL}/health")
        assert res.status_code == 200
        assert res.json() == {"status": "ok"}
        print("PASS: /health")
    except Exception as e:
        print(f"FAIL: /health - {e}")

def test_login_correlation_id():
    print("Testing Login X-Correlation-ID...")
    login_data = {"username": "admin@example.com", "password": "Admin@123"}
    try:
        res = requests.post(f"{BASE_URL}/auth/token", data=login_data)
        if res.status_code == 200:
            cid = res.headers.get("X-Correlation-ID")
            if cid:
                print(f"PASS: X-Correlation-ID found: {cid}")
            else:
                print("FAIL: X-Correlation-ID missing")
        else:
            print(f"FAIL: Login failed {res.status_code}")
    except Exception as e:
        print(f"FAIL: Login - {e}")

if __name__ == "__main__":
    # Wait for server to reload
    time.sleep(2)
    test_health_check()
    test_login_correlation_id()
