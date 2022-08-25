const { DGORA_TESTNET_CONTRACT_ADDRESS} = require('../constants');
const {terraTestnetClient, terraClient} = require('../lcdClients');

exports.queryThreadsByCategory = async (offset = 0, limit = 10, category, isTestnet) => {
    const queryClient  = isTestnet ? terraTestnetClient : terraClient;
    try {
     const result = await queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
        get_threads_by_category: {
            category,
            limit,
            offset
          }
     });
    return result.entries;
    } catch (err) {
    return { err };
  }
};

exports.queryThreads = async (req, res) => {
  try {
    const {offset, limit, isTestnet} = req?.query;
    const {category} = req?.params;
    const parsedIntOffset = !offset ? 0 : parseInt(offset);
    const parsedIntLimit = !limit ? 10 : parseInt(limit);
    const result = await queryThreadsByCategory(parsedIntLimit, parsedIntOffset, category, isTestnet);
    res.status(200).json(result ?? []);
  } catch (err) {
    res.status(500).json({info: err});
  }
};


