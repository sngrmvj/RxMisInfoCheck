# Medical-Drug-Information
A portal to provide the information regarding the medical drug that whether that is legitimate or not




## Medical drug info backend
- Built on flask
- 2 APIs
  - Get the drug info based on the Brand name or NDC code
  - Recently searched items
- We are using redis to store the recently searched items
    - Very rarely the FDA database goes down and we can use the redis to fetch the info of the recently searched.
- We are using LRU to remove the keys as we opted for the limit of 20 keys in redis database.
  - LRU is done based on timestamp



## Medical drug info frontend
- It has 3 screen
  - We have input box to search for the drug.
    - We need to select whether it is brand name or the NDC code
  - Recently searched items gets displayed below the search box.
  - Right side, we see the details of the info we searched for.
- The other screen is to 


### Links 
- [Wiki](https://github.com/sngrmvj/RxMisInfoCheck/wiki/RxMisInfoCheck)

