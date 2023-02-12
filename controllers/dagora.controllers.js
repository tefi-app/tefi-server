// const { redisClient } = require('../lib/redisClient');
// const { generateAgoraThreadsRedisKey } = require('../util/generateRedisKeys');
const { queryClientForThreadsByCategory, queryClientForRepliesByThreadId, queryClientForThreadById} = require('../helpers/queries');
// const { getCacheItemIndexFromList } = require('../helpers/cache');
const { MAX_CACHED_THREADS } = require('../constants');

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

// exports.saveThreadInCache = async(req, res) => {
//   const {thread_id} = req.body;
//   const {isTestnet} = req.query;
  
//   if(!thread_id) {
//     return res.status(400).json({info: "Invalid Thread ID"});
//   };

//   try {
//     const thread = await queryClientForThreadById(parseInt(thread_id), true);
//     const key = generateAgoraThreadsRedisKey(isTestnet, thread.category);
//     await redisClient.lpush(key, JSON.stringify(thread));
//     await redisClient.ltrim(key, 0 , MAX_CACHED_THREADS);

//     return res.status(200).json({info: "success"});
//   }
//   catch(err) {
//     return res.status(500).json({info: "Error Saving Thread in Cache"});

//   }
// }

// exports.saveThreadRepliesInCache = async(req, res) => {
//   const {reply} = req.body;
//   const {isTestnet} = req.query;
  
//   if(!reply?.author || !reply?.comment || !reply?.comment_id ||!reply?.thread_id) {
//     return res.status(400).json({info: "Invalid Thread Reply Data"});
//   };

//   try {
//     const keySuffix  = reply.thread_id + ":replies";
//     const key = generateAgoraThreadsRedisKey(isTestnet, keySuffix);
//     await redisClient.lpush(key, JSON.stringify(reply));
//     await redisClient.ltrim(key, 0 , MAX_CACHED_THREADS);

//     return res.status(200).json({info: "success"});
//   }
//   catch(err) {
//     console.log(err);
//     return res.status(500).json({info: "Error Saving Thread Reply in Cache"});

//   }
// }


// exports.updateThreadReplyInCache = async(req, res) => {
//   const {reply} = req.body;
//   const {isTestnet} = req.query;
  
//   if(!reply?.author || !reply?.comment || !reply?.comment_id ||!reply?.thread_id) {
//     return res.status(400).json({info: "Invalid Thread Reply Data"});
//   };

//   try {
//     const keySuffix  = reply.thread_id + ":replies";
//     const key = generateAgoraThreadsRedisKey(isTestnet, keySuffix);
//     const elementIndex = await getCacheItemIndexFromList(key, 'comment_id', reply.comment_id);
//     if(elementIndex === -1) {
//       return res.status(200).json({info: "cache not found"});
//     }
//     redisClient.lset(key, elementIndex, JSON.stringify(reply));
//     return res.status(200).json({info: "success"});
//   }
//   catch(err) {
//     return res.status(500).json({info: "Error Saving Thread Reply in Cache"});

//   }
// }

// exports.updateThreadInCache = async(req, res) => {
//   const {thread} = req.body;
//   const {isTestnet} = req.query;
  
//   if(!thread?.author || !thread?.id || !thread?.title ||!thread?.content || !thread.category) {
//     return res.status(400).json({info: "Invalid Thread Data"});
//   };

//   try {
//     const key = generateAgoraThreadsRedisKey(isTestnet, thread.category);
//     const elementIndex = await getCacheItemIndexFromList(key, 'id', thread.id);
//     if(elementIndex === -1) {
//       return res.status(200).json({info: "cache not found"});
//     }
//     redisClient.lset(key, elementIndex, JSON.stringify(thread));
//     return res.status(200).json({info: "success"});
//   }
//   catch(err) {
//     console.log(err);
//     return res.status(500).json({info: "Error Saving Thread in Cache"});

//   }
// }


