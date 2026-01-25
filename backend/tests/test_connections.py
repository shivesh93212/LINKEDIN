def test_send_connection(client):
    login = client.post(
        "/auth/login",
        data={"username": "testuser@gmail.com", "password": "password123"}
    )
    token = login.json()["access_token"]

    response = client.post(
        "/connections/send/2",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code in [200, 400]
