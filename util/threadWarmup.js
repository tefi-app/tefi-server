const helper = require('../helpers/queries');

const OFFSET = 0;
const LIMIT = 500;
const IS_TESTNET = true;
const CATEGORY = 'General';

module.exports.threadWarmup = async function () {
        const result = await helper.queryClientForThreadsByCategory(OFFSET, LIMIT, CATEGORY, IS_TESTNET);
        console.log(result)
}

