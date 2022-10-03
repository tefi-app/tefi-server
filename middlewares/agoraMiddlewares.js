const {redisClient} = require('../lib/redisClient');

const TESTNET_KEY = 'agora:threads:testnet';
const MAINNET_KEY ='agora:threads:mainnet';

const threadsCategoryMiddleware = async (req, res, next) => {
    try {
    const { offset, limit, isTestnet } = req.query;
    const {category} = req?.params;
    const key = isTestnet ? TESTNET_KEY : MAINNET_KEY;
    
    const result = await redisClient.lrange(key+`:${category}`,parseInt(offset), +limit-1);
    if(result.length == +limit) {
        const parsedResults = result.map(item => JSON.parse(item));
        res.status(200).json(parsedResults);
    }
    else next();
    }
    catch(err) {
        next();
    }
 
}

module.exports = {threadsCategoryMiddleware};