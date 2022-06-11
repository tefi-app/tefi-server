const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const FCD_URL ='https://fcd.terra.dev/';

const { curly } = require("node-libcurl");

const getPost = async (offset = 0, limit = 100) => {
    try {
      const { statusCode, data, headers } = await curly.get(`${FCD_URL}v1/txs?offset=${offset}&limit=${limit}&account=${ADDRESS}`);
      console.log("=======statusCode=====", statusCode);
      return { ...data };
    } catch (err) {
    return { posts:[], next: false };
  }
};
// Find a single list with a listId
exports.getClubPosts = async (req, res) => {
  try {
    const posts = await getPost();
    res.status(200).json(posts ?? []);
  } catch (err) {
    res.status(500).json([]);
  }
};



