const { DGORA_TESTNET_CONTRACT_ADDRESS} = require('../constants');
const {terraTestnetClient, terraClient} = require('../lcdClients');

const queryClientForThreadsByCategory = async (offset = 0, limit = 10, category, isTestnet) => {
    const queryClient  = isTestnet ? terraTestnetClient : terraClient;
     const result = await queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
        get_threads_by_category: {
            category,
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
    const {offset, limit, isTestnet} = req?.query;
    const {category} = req?.params;
    const parsedIntOffset = !offset ? 0 : parseInt(offset);
    const parsedIntLimit = !limit ? 10 : parseInt(limit);
    const result = await queryClientForThreadsByCategory(parsedIntOffset, parsedIntLimit, category, isTestnet);
    res.status(200).json(result ?? []);
  } catch (err) {
    res.status(500).json({info: err.message});
  }
};


exports.queryThreadById = async (req, res) => {
  try {
    const {isTestnet} = req?.query;
    const {id} = req?.params;
    const parseId = !id ? 1 : parseInt(id);
    const result = await queryClientForThreadById(parseId, isTestnet);
    res.status(200).json(result ?? {});
  } catch (err) {
    res.status(500).json({info: err.message});
  }
};


