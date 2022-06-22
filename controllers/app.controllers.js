const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const FCD_URL ='https://fcd.terra.dev';
const LCD_URL = 'https://lcd.terra.dev';

const { curly } = require("node-libcurl");

const getPost = async (offset = 0, limit = 100) => {
    try {
      const { statusCode, data, headers } = await curly.get(`${FCD_URL}/v1/txs?offset=${offset}&limit=${limit}&account=${ADDRESS}`);
      console.log("=======statusCode=====", statusCode);
      return { ...data };
    } catch (err) {
    return { err };
  }
};

// Find a single list with a listId
exports.getClubPosts = async (req, res) => {
  try {
    const {offset, limit} = req?.query;
    const parseIntOffset = parseInt(offset);
    const parseIntLimit = parseInt(limit);
    const posts = await getPost(parseIntOffset, parseIntLimit);
    res.status(200).json(posts ?? []);
  } catch (err) {
    res.status(500).json([]);
  }
};

// Get Tax Rate

exports.getTaxRate = async (_, res) => {
  try {
    const result = await curly.get(`${LCD_URL}/terra/treasury/v1beta1/tax_rate`);
    return res.status(200).json(result?.data ?? {});
  }
  catch(err) {
    res.status(500).json('Unexpected Error!');
  }
}

// Get Denom Tax Caps
exports.getTaxCap = async (req, res) => {
  try {
    const {denom} = req.params;
    if(!denom) {
      return res.status(400).json("Invalid request, please add denom with request");
    }
    const result = await curly.get(`${LCD_URL}/terra/treasury/v1beta1/tax_caps/${denom}`);
    return res.status(200).json(result?.data ?? {});
  }
  catch(err) {
    res.status(500).json('Unexpected Error!');
  }
}


