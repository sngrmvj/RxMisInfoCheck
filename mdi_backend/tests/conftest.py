

import pytest, os, sys
sys.path.append(os.path.abspath('./')) 
from main import app 

@pytest.fixture
def client():
    client = app.test_client()
    return client 



