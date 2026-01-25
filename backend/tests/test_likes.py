def test_like_post(client):
    login = client.post(
        "/auth/login",
        data={"username": "testuser@gmail.com", "password": "password123"}
    )
    token = login.json()["access_token"]

    response = client.post(
        "/likes/1",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code in [200, 400]
