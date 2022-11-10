

import json, traceback, aiohttp, requests
from constants import CONSTANTS






# ---------------------------------------------------------------------------------------------------------------------
# # * Helper function to fetch the bulk details of the medical drugs 
# ---------------------------------------------------------------------------------------------------------------------
async def getBulkData(body,redisInstance):

    returnItems = []
    try:
        if len(body['ndc']) > 0:
            for item in body['ndc']:
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.get(CONSTANTS['FDA_URL']+"?search=product_ndc:"+item.strip()+"&limit=1",ssl=False) as response:
                            result = await response.text()
                            result = json.loads(result)
                            if len(result) > 0:
                                if 'error' in result and result['error']['code'] == 'NOT_FOUND':
                                    returnItems.append((False,f"This medical drug '{item}' might not be approved by government. {result['error']['message']}"))
                                else:
                                    returnItems.insert(0,(True, result))
                except Exception as error:
                    print(f">>>> IMPORTANT - Error - {error}")
                    print(traceback.format_exc())
                    data = redisInstance.get_data(item.strip())
                    if data:
                        returnItems.insert(0,(True,json.loads(data)))
                    else:
                        returnItems.append((False,f"{error}"))
        if len(body['brand_name']) > 0:
            for brandName in body['brand_name']:
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.get(CONSTANTS['FDA_URL']+"?search=brand_name:"+brandName.strip()+"&limit=1",ssl=False) as response:
                            result = await response.text()
                            result = json.loads(result)
                            if len(result) > 0:
                                if 'error' in result and result['error']['code'] == 'NOT_FOUND':
                                    returnItems.append((False,f"This medical drug '{brandName}' might not be approved by government. {result['error']['message']}"))
                                else:
                                    returnItems.insert(0,(True, result))
                except Exception as error:
                    print(f">>>> IMPORTANT - Error - {brandName}")
                    print(traceback.format_exc())
                    data = redisInstance.get_data(brandName.strip())
                    if data:
                        returnItems.insert(0,(True,data))
                    else:
                        returnItems.append((False,"Connection Error. Max tries reached"))

        return returnItems
    except Exception as error:
        print(f">->->Error while fetching the data from FDA database - {error}")
        print(traceback.format_exc())





# ---------------------------------------------------------------------------------------------------------------------
# # * Helper function to fetch the details of SINGLE medical drug
# ---------------------------------------------------------------------------------------------------------------------
def getMedicalDrugDetails(parameter,value,redisInstance):


    try:
        if parameter != "ndc":
            # That represents we are querying based on the brand name
            result = requests.get(CONSTANTS['FDA_URL']+"?search=brand_name:"+value.strip()+"&limit=1")
        else:
            result = requests.get(CONSTANTS['FDA_URL']+"?search=product_ndc:"+value.strip()+"&limit=1")

        if len(result.json()) > 0:
            if 'error' in result.json() and result.json()['error']['code'] == 'NOT_FOUND':
                return f"This medical drug might not be approved by government as {result.json()['error']['message']}", False ,404

            redisInstance.put_data(result.json(),parameter,value)
            return result.json(), True, 200
    except requests.exceptions.ConnectionError:
        print(f">>>> IMPORTANT - Connection Error has been occurred, you are trying to fetch it from redis")
        data = redisInstance.get_data(value.strip())
        if data:
            return json.loads(data), True, 200
        else:
            raise Exception("Connection Error. Max tries reached")
    except Exception as error:
        print(f">->->Error while fetching the data from FDA database - {error}")
        print(traceback.format_exc())
        return f"Error while fetching the data from FDA database - {error}", False, 500