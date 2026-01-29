def test_signup(client):
    response = client.post(
        "/auth/signup",
        json={
            "email": "testuser@gmail.com",
            "password": "password123"
        }
    )
    assert response.status_code in [200, 400]
#  for testing

def test_login(client):
    response = client.post(
        "/auth/login",
        data={
            "username": "testuser@gmail.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
