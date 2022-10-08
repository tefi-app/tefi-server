const {redisClient} = require('../lib/redisClient');
const {MAX_CACHED_THREADS} = require('../constants');
const {generateAgoraThreadsRedisKey} = require('../util/generateRedisKeys');

const threadsCategoryMiddleware = async (req, res, next) => {
    try {
    const { offset, limit, isTestnet } = req.query;
    const {category} = req?.params;

    const parsedIntOffset = !offset ? 0 : parseInt(offset);
    const parsedIntLimit = !limit ? 10 : parseInt(limit);

    req.offset = parsedIntOffset;
    req.limit = parsedIntLimit;
    req.isTestnet = isTestnet;

    if(parsedIntLimit + parsedIntOffset > MAX_CACHED_THREADS) {
        next();
    }
    
    const key = generateAgoraThreadsRedisKey(isTestnet, category);
    const result = await redisClient.lrange(key,parsedIntOffset, parsedIntLimit-1);
    if(result.length == parsedIntLimit) {
        const parsedResults = result.map(item => JSON.parse(item));
        return res.status(200).json(parsedResults);
    }
    else next();
    }
    catch(err) {
        console.log(err);
        next();
    }
 
}

const threadsRepliesMiddleware = async (req, res, next) => {
    try {
    const { offset, limit, isTestnet } = req.query;
    const {id} = req?.params;

    const parsedIntOffset = !offset ? 0 : parseInt(offset);
    const parsedIntLimit = !limit ? 10 : parseInt(limit);

    req.offset = parsedIntOffset;
    req.limit = parsedIntLimit;
    req.isTestnet = isTestnet;
    req.id = id;

    if(parsedIntLimit + parsedIntOffset > MAX_CACHED_THREADS) {
        next();
    }
    const keySuffix  = id + ":replies";
    const key = generateAgoraThreadsRedisKey(isTestnet, keySuffix);
    const result = await redisClient.lrange(key,parsedIntOffset, parsedIntLimit-1);
    if(result.length == parsedIntLimit) {
        const parsedResults = result.map(item => JSON.parse(item));
        return res.status(200).json(parsedResults);
    }
    else next();
    }
    catch(err) {
        console.log(err);
        next();
    }
 
}

module.exports = {threadsCategoryMiddleware, threadsRepliesMiddleware}