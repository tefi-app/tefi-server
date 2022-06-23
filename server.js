const express = require('express'); 
const bodyParser = require('body-parser');
const { PORT } = require('./config/app.config');
const {getTaxRate, getTaxCap} = require('./controllers/app.controllers');
const port = PORT || 4000;

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./routes/app.routes.js")(app);


app.get('*', (req, res) => {
  res.send("Tefi Server is running...🚀")
});

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port 🚀 ${port}`)); //Line 6