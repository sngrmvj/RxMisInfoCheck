
import json

# --------------------
# * Ping API (+ve)
# --------------------
def test_ping(client):
    result = client.get("/")
    result = result.data 
    assert b"Yes you are connected" in result





# --------------------
# * Fetch Medical details API for Brand Name (+ve)
# --------------------
def test_medicalDetails_brandName(client):
    queryItem = "Aleve"
    type_of_search = "brand_name"
    result = client.get(f"/{queryItem}?type={type_of_search}")
    assert b'66715-9702' in result.data




# --------------------
# * Fetch Medical details API for NDC code (+ve)
# --------------------
def test_medicalDetails_NDCcode(client):
    queryItem = "0777-3104"
    type_of_search = "ndc"
    result = client.get(f"/{queryItem}?type={type_of_search}")
    assert b'Prozac' in result.data




# # --------------------
# * Fetch bulk Medical details API (+ve)
# --------------------
def test_fetch_bulk_medical_details(client):
    body = {
        "ndc": [],
        "brand_name": ["Aleve","Prozac"]
    }
    headers = {'content-type': 'application/json'}
    result = client.put("http://127.0.0.1:5001/bulk/",data=json.dumps(body),headers=headers)
    
    assert b'"flag": true}}' in result.data





# --------------------
# * Recently searched items (+ve)
# --------------------
def test_recently_searched_medical_details(client):
    result = client.get(f"/recentlyUsed")
    assert b'"flag": true' in result.data
