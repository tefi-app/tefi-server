const { redisClient } = require('../lib/redisClient');

const getCacheItemIndexFromList = async (key,property,id, offset = 0, limit = 499) => {
    const result = await redisClient.lrange(key, offset, limit);
    let elementIndex = -1;
    for (let i = 0 ; i<=limit; i++) {
      if(result[i]) {
        const parsedResult = JSON.parse(result[i]);
        if(parsedResult[property] === id) {
          elementIndex = i;
          break;
        }
      }
      else {
        break;
      }
    }
    return elementIndex;
  }


  module.exports = {getCacheItemIndexFromList};