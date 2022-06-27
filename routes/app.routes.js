module.exports = (app) => {
    const App = require('../controllers/app.controllers');
    const Account = require('../controllers/account.controllers');
    app.get("/posts", App.getClubPosts);
    app.get("/treasury/tax_caps/:denom", App.getTaxCap);
    app.get("/treasury/tax_rate", App.getTaxRate);
    app.get("/account/:address", Account.getAccount);
  };