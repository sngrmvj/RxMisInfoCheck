

from supporters.utils import singleton
from constants import CONSTANTS
import redis, time, math, json, traceback


@singleton
class Redis_Connection:

    def __init__(self) -> None:
        
        sslValue = True
        if CONSTANTS['IN_DOCKER'] == "NO":
            sslValue = False

        self.redis_engine = redis.Redis(
            host=CONSTANTS['REDIS_URL'],
            port=CONSTANTS['REDIS_PORT'],
            password=CONSTANTS['REDIS_PASSWORD'],
            ssl=sslValue,
            db=CONSTANTS['REDIS_DB']
        )

        if self.redis_engine.ping():
            print("Cache Connected")



    # ---------------------------------------------------------------------------------------------------------------------
    # # -> FETCH all the keys
    # ---------------------------------------------------------------------------------------------------------------------
    def get_keys(self):
        return self.redis_engine.keys('*')

    # ---------------------------------------------------------------------------------------------------------------------
    # # -> Remove Least recently used based on timestamp
    # ---------------------------------------------------------------------------------------------------------------------
    def removeLRU(self,all_keys) -> bool:
        
        minimum_timestamp = math.inf
        delete_key = None 
        l,r = 0, len(all_keys) - 1
        while l <= r:

            if b'brand_name' in all_keys[l]:
                temp_timestamp = float(all_keys[l].decode('utf-8').split("_")[3])
            else:
                temp_timestamp = float(all_keys[l].decode('utf-8').split("_")[2])
            if temp_timestamp < minimum_timestamp:
                # We could have used "min" function to find minimum and update it
                # But we need to update delete_key as well
                # delete_key should be updated only in this condition but not during "min"
                minimum_timestamp = temp_timestamp
                delete_key = all_keys[l]
            
            if b'brand_name' in all_keys[r]:
                temp_timestamp = float(all_keys[r].decode('utf-8').split("_")[3])
            else:
                temp_timestamp = float(all_keys[r].decode('utf-8').split("_")[2])
            if temp_timestamp < minimum_timestamp:
                # We could have used "min" function to find minimum and update it
                # But we need to update delete_key as well
                # delete_key should be updated only in this condition but not during "min"
                minimum_timestamp = temp_timestamp
                delete_key = all_keys[r]

            l += 1
            r -= 1

        # Deleting the key 
        try:
            self.redis_engine.delete(delete_key)
        except Exception as error:
            print(f">->-> Error during deletion of the key - {error}")
            return False 
        else:
            print(f">>>> Deleted key - {delete_key}")
            return True

    # ---------------------------------------------------------------------------------------------------------------------
    # # -> Need to check whether the searched value is part of the redis or not
    # ---------------------------------------------------------------------------------------------------------------------
    def checkIsPartOfCache(self,all_keys, value):
        isPartOf = False
        visited_key = None # Why visisted_key? We are using timestamp as part of the key and it is the way to track it
        l,r = 0, len(all_keys) - 1
        while l <= r:
            if value in all_keys[l].decode('utf-8'):
                isPartOf = True 
                visited_key = all_keys[l]
                break
            if value in all_keys[r].decode('utf-8'):
                isPartOf = True 
                visited_key = all_keys[r]
                break
            l += 1
            r -= 1

        return isPartOf, visited_key

    # ---------------------------------------------------------------------------------------------------------------------
    # # -> Add data to redis
    # ---------------------------------------------------------------------------------------------------------------------
    def put_data(self,data,type,value) -> bool:

        # Get all the keys present in the redis
        all_keys = self.get_keys()

        # This part of code is to remove the item if searched from the recently searched
        # No need to worry the same item with the key gets added below with different timestamp
        # We are doing this as part of LRU
        if all_keys:
            isPartOf, visited_key = self.checkIsPartOfCache(all_keys, value)
            if isPartOf:
                print(f">>>> It is part of recently searched. So, deleting the key {visited_key}!!")
                self.redis_engine.delete(visited_key)


        if all_keys and len(all_keys) == CONSTANTS['REDIS_KEYS_LIMIT']:
            # Since we are keeping a limiter, when the number of keys equal to the limit, we remove LRU
            self.removeLRU(all_keys)

        try:
            timestamp = time.time_ns()
            self.redis_engine.set(f"{value}_{type}_{timestamp}", json.dumps(data))
        except Exception as error:
            print(f">->-> Error during insertion of data to redis - {error}")
            print(traceback.format_exc())
            return f"Error during insertion of data - {error}", False 
        else:
            return "Success", True

    # ---------------------------------------------------------------------------------------------------------------------
    # # -> Get data from redis
    # ---------------------------------------------------------------------------------------------------------------------
    def get_data(self,value) -> bool:
        """
            This function is to get data of the user input and only if it is present in the redis.
        Returns:
            string : response of the value we got previously
        """

        # Get all the keys present in the redis
        all_keys = self.get_keys()

        # This part of code is to remove the item if searched from the recently searched
        # No need to worry the same item with the key gets added below with different timestamp
        # We are doing this as part of LRU
        if all_keys:
            isPartOf, visited_key = self.checkIsPartOfCache(all_keys, value)

        try:
            if isPartOf:
                print(f">>>> It is part of recently searched!!")
                return self.redis_engine.get(visited_key).decode('utf-8')
        except Exception as error:
            print(f">->-> Error during insertion of data to redis - {error}")
            print(traceback.format_exc())
            return f"Error during insertion of data - {error}", False 
