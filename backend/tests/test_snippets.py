def post_snippet(client, **kwargs):
    data = {"title": "Test", "code": "print(1)", "language": "python", **kwargs}
    return client.post("/api/snippets", json=data)


# --- Create ---
def test_create_snippet_success(client):
    r = post_snippet(client, tags=["flask"])
    assert r.status_code == 201
    body = r.get_json()
    assert body["language"] == "python"
    assert body["tags"] == ["flask"]
    assert body["starred"] is False

def test_create_snippet_invalid_language(client):
    r = post_snippet(client, language="bad lang")
    assert r.status_code == 422

def test_create_snippet_empty_title(client):
    r = post_snippet(client, title="")
    assert r.status_code == 422

def test_create_snippet_missing_code(client):
    r = client.post("/api/snippets", json={"title": "Hi", "language": "python"})
    assert r.status_code == 422

def test_create_snippet_too_many_tags(client):
    tags = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"]
    r = post_snippet(client, tags=tags)
    assert r.status_code == 422

def test_create_snippet_invalid_json(client):
    r = client.post("/api/snippets", data="not json", content_type="text/plain")
    assert r.status_code == 400


# --- List ---
def test_list_snippets(client):
    post_snippet(client, title="First")
    post_snippet(client, title="Second")
    r = client.get("/api/snippets")
    assert r.status_code == 200
    assert len(r.get_json()) == 2

def test_list_empty(client):
    r = client.get("/api/snippets")
    assert r.status_code == 200
    assert r.get_json() == []


# --- Search ---
def test_search_by_tag(client):
    post_snippet(client, tags=["flask", "auth"])
    post_snippet(client, tags=["hooks"])
    r = client.get("/api/search?q=flask")
    assert len(r.get_json()) == 1

def test_search_by_language(client):
    post_snippet(client, language="python")
    post_snippet(client, language="javascript")
    r = client.get("/api/search?lang=python")
    assert len(r.get_json()) == 1

def test_search_by_query_and_language(client):
    post_snippet(client, title="flask auth", language="python")
    post_snippet(client, title="flask auth", language="javascript")
    r = client.get("/api/search?q=flask&lang=python")
    assert len(r.get_json()) == 1

def test_search_no_params_returns_all(client):
    post_snippet(client)
    post_snippet(client)
    r = client.get("/api/search")
    assert len(r.get_json()) == 2


# --- Update ---
def test_update_starred(client):
    snippet_id = post_snippet(client).get_json()["id"]
    r = client.patch(f"/api/snippets/{snippet_id}", json={"starred": True})
    assert r.status_code == 200
    assert r.get_json()["starred"] is True

def test_update_partial_does_not_overwrite(client):
    snippet_id = post_snippet(client, title="Original").get_json()["id"]
    client.patch(f"/api/snippets/{snippet_id}", json={"starred": True})
    r = client.get("/api/snippets")
    snippet = r.get_json()[0]
    assert snippet["title"] == "Original"  # unchanged
    assert snippet["starred"] is True

def test_update_nonexistent(client):
    r = client.patch("/api/snippets/9999", json={"starred": True})
    assert r.status_code == 404

def test_update_invalid_language(client):
    snippet_id = post_snippet(client).get_json()["id"]
    r = client.patch(f"/api/snippets/{snippet_id}", json={"language": "bad lang"})
    assert r.status_code == 422

def test_update_invalid_json(client):
    snippet_id = post_snippet(client).get_json()["id"]
    r = client.patch(f"/api/snippets/{snippet_id}", data="not json", content_type="text/plain")
    assert r.status_code == 400


# --- Delete ---
def test_delete_snippet(client):
    snippet_id = post_snippet(client).get_json()["id"]
    r = client.delete(f"/api/snippets/{snippet_id}")
    assert r.status_code == 204

def test_delete_nonexistent(client):
    r = client.delete("/api/snippets/9999")
    assert r.status_code == 404

def test_delete_twice(client):
    snippet_id = post_snippet(client).get_json()["id"]
    client.delete(f"/api/snippets/{snippet_id}")
    r = client.delete(f"/api/snippets/{snippet_id}")
    assert r.status_code == 404