// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
};