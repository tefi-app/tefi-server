const { queryClientForThreadsByCategory } = require('../helpers/queries');
const { generateAgoraThreadsRedisKey } = require('../util/generateRedisKeys');
const { MAX_CACHED_THREADS } = require('../constants');
const { redisClient } = require('../lib/redisClient');

const OFFSET = 0;
const LIMIT = 500;
const IS_TESTNET = true;
const CATEGORY = 'General';

module.exports.threadWarmup = async function () {
    try {
        for(let i=0; i <= LIMIT; i+=10){
                const threads = await queryClientForThreadsByCategory(i, i+10, CATEGORY, IS_TESTNET);
                console.log('threads--->', threads);
                threads.forEach(async thread => {
                    const key = generateAgoraThreadsRedisKey(IS_TESTNET, thread.category);
                    await redisClient.lpush(key, JSON.stringify(thread));
                    await redisClient.ltrim(key, 0 , MAX_CACHED_THREADS);
                });
        }

    } catch (error) {
        console.log(`warm up failed! -> ${error}`)
    }
}

