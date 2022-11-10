


from flask import Flask, request
from flask_cors import CORS
from supporters.utils import custom_response
from supporters.helpers import getBulkData, getMedicalDrugDetails
from connections.redis_connect import Redis_Connection
import traceback,asyncio



# * APP variable creation 
app = Flask(__name__)
CORS(app)
redisInstance = Redis_Connection() # * Important Attribute DON't Delete



# ---------------------------------------------------------------------------------------------------------------------
# # -> PING
# ---------------------------------------------------------------------------------------------------------------------
@app.route("/",methods=['GET'])
def ping():
    return custom_response({"response":"Yes you are connected!!"}, 200)




# ---------------------------------------------------------------------------------------------------------------------
# # -> FETCH API for medical drug details
# ---------------------------------------------------------------------------------------------------------------------
@app.route('/<value>',methods=['GET'])
def get_medical_drug_info(value):

    """
        1. We receive input from the UI
        2. We search in our database for the info. 
        3. If not found, we query the global databsee i.e. FDA for the information.
        4. If obtained we return it and also adding record in our database 
            else we say it is not government approved.

    Args:
        value_or_code (string): This variable contains either brand value or the NDC code of the medical drug.

    Returns:
        Response: If success the medical drug information, else we say it is not from this country or counterfeit 
        i.e, Not govenment approved.
    """

    parameter = request.args['type'].strip()

    result, flag, status = getMedicalDrugDetails(parameter,value,redisInstance)
    if status == 200:
        return ({"response": {"message": result, "flag":flag}}, status)
    elif status == 404:
        return ({"response": {"message": result, "flag":flag}}, status)
    else:
        return ({"response": {"message": result, "flag":flag}}, status)




# ---------------------------------------------------------------------------------------------------------------------
# # -> FETCH API for bulk data
# ---------------------------------------------------------------------------------------------------------------------
@app.route('/bulk/',methods=['PUT'])
def get_bulk_data():

    body = request.get_json()
    returnItems = asyncio.run(getBulkData(body,redisInstance))
    return custom_response({"response": {"message": returnItems, "flag":True}}, 200)




# ---------------------------------------------------------------------------------------------------------------------
# # -> FETCH API for getting the keys stored in the redis
# ---------------------------------------------------------------------------------------------------------------------
@app.route('/recentlyUsed',methods=['GET'])
def get_recently_used():

    """
        The idea is to display the user inputs recently searched in Ui.

    Returns:
        HTTP Response: Http response with the list of values what recently searched.
    """

    try:
        values = redisInstance.get_keys()
        print(f">>>> Currently the number of items in redis database - {len(values)}")
        if values:
            # We are segregating the ndc values and brand name searched values
            ndc_values = [item.decode('utf-8').split("_")[0] for item in values if item.decode('utf-8').split("_")[1]=='ndc']
            values = [item.decode('utf-8').split("_")[0] for item in values if item.decode('utf-8').split("_")[1]!='ndc']
            return custom_response({"response": {"ndc": list(set(ndc_values)), "names": list(set(values))},"flag":True}, 200)
        else:
            return custom_response({"response": "No items are recently searched", "flag": False}, 200)
    except Exception as error:
        print(f">->-> Failure in fetching the recently used - {error}")
        print(traceback.format_exc())
        return custom_response({"response": f"Failure in fetching the recently used - {error}"}, 500)




if __name__ == "__main__":
    app.run(host='0.0.0.0')