def test_comment_post(client):
    login = client.post(
        "/auth/login",
        data={"username": "testuser@gmail.com", "password": "password123"}
    )
    token = login.json()["access_token"]

    response = client.post(
        "/comments/1",
        params={"content": "Nice post"},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
