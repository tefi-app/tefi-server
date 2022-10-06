const TESTNET_KEY = 'agora:threads:testnet:';
const MAINNET_KEY ='agora:threads:mainnet:';

const generateAgoraThreadsRedisKey = (isTestnet = false, keySuffix = '') => {
    return isTestnet ? TESTNET_KEY + keySuffix : MAINNET_KEY + keySuffix;
}

module.exports = {generateAgoraThreadsRedisKey};