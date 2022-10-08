const { DGORA_TESTNET_CONTRACT_ADDRESS, MAX_CACHED_THREADS} = require('../constants');
const {terraTestnetClient, terraClient} = require('../lib/lcdClients');
const { redisClient } = require('../lib/redisClient');
const { generateAgoraThreadsRedisKey } = require('../util/generateRedisKeys');

const queryClientForThreadsByCategory = async (offset = 0, limit = 10, category, isTestnet) => {
    const queryClient  = isTestnet ? terraTestnetClient : terraClient;
     const result = await queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
        get_threads_by_category: {
            category,
            limit,
            offset
          }
     });
    return result?.entries;
};

const queryClientForRepliesByThreadId = async (offset = 0, limit = 10, threadId, isTestnet) => {
  const queryClient  = isTestnet ? terraTestnetClient : terraClient;
   const result = await queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
       get_comments_by_thread: {
          thread_id: threadId,
          limit,
          offset
        }
   });
  return result.entries;
};


const queryClientForThreadById = async (id, isTestnet) => {
  const queryClient  = isTestnet ? terraTestnetClient : terraClient;
   return queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
      get_thread_by_id: {
          id,
        }
   });
};

exports.queryThreads = async (req, res) => {
  try {
    const {offset,limit, isTestnet} = req;
    const {category} = req?.params;
    const result = await queryClientForThreadsByCategory(offset, limit, category, isTestnet);
    res.status(200).json(result ?? []);
  } catch (err) {
    res.status(500).json({info: err.message});
  }
};


exports.queryThreadById = async (req, res) => {
  try {
    const {isTestnet} = req?.query;
    const {id} = req?.params;

    if(!id) {
      return res.status(400).json({info: "Invalid Thread Id"})
    }
    const parseId = parseInt(id);
    const result = await queryClientForThreadById(parseId, isTestnet);
    res.status(200).json(result ?? {});
  } catch (err) {
    res.status(500).json({info: err.message});
  }
};

exports.queryRepliesByThreadId = async (req, res) => {
  try {
    const {offset, limit, isTestnet, id} = req;

    const parsedId = parseInt(id);
    const result = await queryClientForRepliesByThreadId(offset, limit, parsedId, isTestnet);
    return res.status(200).json(result ?? {});
  } catch (err) {
    return res.status(500).json({info: err.message});
  }
};

exports.saveThreadInCache = async(req, res) => {
  const {thread} = req.body;
  const {isTestnet} = req.query;
  
  if(!thread?.id || !thread?.title || !thread?.content ||!thread?.author || !thread.category) {
    return res.status(400).json({info: "Invalid Thread Data"});
  };

  try {
    const key = generateAgoraThreadsRedisKey(isTestnet, thread.category);
   await redisClient.lpush(key, JSON.stringify(thread));
   await redisClient.ltrim(key, 0 , MAX_CACHED_THREADS);

    return res.status(200).json({info: "success"});
  }
  catch(err) {
    return res.status(500).json({info: "Error Saving Thread in Cache"});

  }
  
}


