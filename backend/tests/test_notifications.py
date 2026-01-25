def test_get_notifications(client):
    login = client.post(
        "/auth/login",
        data={"username": "testuser@gmail.com", "password": "password123"}
    )
    token = login.json()["access_token"]

    response = client.get(
        "/notifications",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
