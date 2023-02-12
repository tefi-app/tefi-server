// const {threadsCategoryMiddleware, threadsRepliesMiddleware} = require('../middlewares/agoraMiddlewares');

module.exports = (app) => {
    const App = require('../controllers/app.controllers');
    const Account = require('../controllers/account.controllers');
    const DAgora = require('../controllers/dagora.controllers');
    app.get("/posts", App.getClubPosts);
    app.get('/tx/:txHash', App.getTransactionInfo);
    app.get("/treasury/tax_caps/:denom", App.getTaxCap);
    app.get("/treasury/tax_rate", App.getTaxRate);
    app.get("/account/:address", Account.getAccount);
    // app.get("/dagora/threads/:category",threadsCategoryMiddleware, DAgora.queryThreads);
    app.get("/dagora/threads/:category", DAgora.queryThreads);
    app.get("/dagora/thread/:id", DAgora.queryThreadById);
    // app.get("/dagora/thread/:id/replies",threadsRepliesMiddleware, DAgora.queryRepliesByThreadId);
    app.get("/dagora/thread/:id/replies", DAgora.queryRepliesByThreadId);
    // app.post("/dagora/thread/cache", DAgora.saveThreadInCache);
    // app.post("/dagora/thread/replies/cache", DAgora.saveThreadRepliesInCache);
    // app.put("/dagora/thread/cache", DAgora.updateThreadInCache);
    // app.put("/dagora/thread/replies/cache", DAgora.updateThreadReplyInCache);
  };