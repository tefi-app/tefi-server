const {FCD_URL, MICRO} = require('../constants');
const {TERRA_SYMBOLS} = require('../symbols');
const { curly } = require("node-libcurl");
const math = require('mathjs');


const calculatePrice = (denom, swapRates) => {
    if(denom === 'uusd') return 1;
    const price =  math.round(math.evaluate(`1 / ${swapRates[denom].swaprate}`), 10);
    return price;
}

const calculateTokenUSTCValue = (amount, denom, swapRates) => {
    if(denom === 'uusd') return amount;
    const ustcValue =  math.round(math.evaluate(`${amount} / ${swapRates[denom].swaprate}`), 10);
    return ustcValue;
} 

const getSwapRates = async () => {
    const result = await curly.get(`${FCD_URL}/v1/market/swaprate/uusd`);
    if(result.data) {
        const swapRates = result.data.reduce((accum, currentValue) => {
         accum[currentValue.denom] = currentValue;
         return accum;
        }, {});
        return swapRates;
    }
    else {
        throw new Error('Error fetching swap ratres');
    }
}

const fetchAccountInfo = async (address) => {
    const result = await curly.get(`${FCD_URL}/v1/bank/${address}`);
    return result.data;
}


const generateBalanceInfo = (accountInfo, swapRates) => {
    const balanceInfo = accountInfo.balance.map((balanceInfo) => {
        const balance = math.evaluate(`${balanceInfo.available} / ${MICRO}`);
        const price = calculatePrice(balanceInfo.denom, swapRates);
        const value = calculateTokenUSTCValue(balance, balanceInfo.denom,swapRates);
        return {balance, price, value, name: TERRA_SYMBOLS[balanceInfo.denom].name, symbol: TERRA_SYMBOLS[balanceInfo.denom].symbol}; 
    });
    return balanceInfo;
}


// Get User Account
exports.getAccount = async (req, res) => {
  try {
    let {address} = req.params;
    if(!address) {
      return res.status(400).json("Invalid request, please provide account address");
    }
    const [accountInfo, swapRates] = await Promise.all([fetchAccountInfo(address), getSwapRates()]);
    const  balanceInfo = generateBalanceInfo(accountInfo, swapRates);
    return res.status(200).json(balanceInfo ?? {});
  }
  catch(err) {
    res.status(500).json('Unexpected Error!');
  }
}


