module.exports = (app) => {
    const App = require("../controllers/app.controllers");
    app.get("/posts", App.getClubPosts)
  };