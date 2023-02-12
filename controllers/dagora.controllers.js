const { queryClientForThreadsByCategory, queryClientForRepliesByThreadId, queryClientForThreadById} = require('../helpers/queries');

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