import requests

BASE_URL = "http://localhost:8000"

def test_root():
    r = requests.get(BASE_URL + "/")
    assert r.status_code == 200
    print("Root endpoint OK")

def test_upload():
    files = {'file': ('test.pdf', open('test.pdf', 'rb'), 'application/pdf')}
    r = requests.post(BASE_URL + "/upload/", files=files)
    assert r.status_code == 200
    print("Upload endpoint OK")

if __name__ == "__main__":
    test_root()
    # test_upload()  # Uncomment if you have test.pdf
