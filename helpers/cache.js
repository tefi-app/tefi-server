const { redisClient } = require('../lib/redisClient');

const getReplyIndexFromList = async (key, comment_id) => {
    let limit = 499;
    let offset = 0;
  
    const result = await redisClient.lrange(key, offset, limit);
    let elementIndex = -1;
    for (let i = 0 ; i<=limit; i++) {
      if(result[i]) {
        const parsedResult = JSON.parse(result[i]);
        if(parsedResult.comment_id === comment_id) {
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


  module.exports = {getReplyIndexFromList};