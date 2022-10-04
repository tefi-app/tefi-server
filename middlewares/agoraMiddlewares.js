const { parse } = require('dotenv');
const { re } = require('mathjs');
const {redisClient} = require('../lib/redisClient');

const TESTNET_KEY = 'agora:threads:testnet';
const MAINNET_KEY ='agora:threads:mainnet';

const MAX_CACHED_THREADS = 500;

const threadsCategoryMiddleware = async (req, res, next) => {
    try {
    const { offset, limit, isTestnet } = req.query;
    const {category} = req?.params;

    const parsedIntOffset = !offset ? 0 : parseInt(offset);
    const parsedIntLimit = !limit ? 10 : parseInt(limit);

    req.offset = parsedIntOffset;
    req.limit = parsedIntLimit;
    req.isTestnet = isTestnet;

    const key = isTestnet ? TESTNET_KEY : MAINNET_KEY;

    if(parsedIntLimit + parsedIntOffset > MAX_CACHED_THREADS) {
        next();
    }
    
    const result = await redisClient.lrange(key+`:${category}`,parsedIntOffset, parsedIntLimit-1);
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

module.exports = {threadsCategoryMiddleware};