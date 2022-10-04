const { LCDClient }  = require("@terra-money/terra.js");
const {LCD_URL, TESTNET_LCD_URL} = require('../constants');

const terraTestnetClient = new LCDClient({
    URL: TESTNET_LCD_URL,
    chainID: "pisco-1",
})

const terraClient = new LCDClient({
    URL: LCD_URL,
    chainID: "columbus-5",
});

module.exports = {terraClient, terraTestnetClient };