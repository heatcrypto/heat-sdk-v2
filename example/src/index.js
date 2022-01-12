const { getPublicKeyFromPrivateKey, getAccountIdFromPublicKey } = require('heat-sdk-v2/dist/crypto')

/**
 * @param {{
 *   privateKeyAsHex: string,
 * }} params
 * @returns string
 */
function HEAT_ADDRESS_FROM_PRIVATEKEY(params) {
  const { privateKeyAsHex } = params;
  return addressFromPrivateKey(privateKeyAsHex)
}

function addressFromPrivateKey(privateKeyhex) {
  const publicKey = getPublicKeyFromPrivateKey(privateKeyhex)
  const address = getAccountIdFromPublicKey(publicKey)
  return address
}

/**
 * @param {{
 *   privateKeyAsHex: string,
 * }} params
 * @returns string
 */
function HEAT_GET_PUBLICKEY_FROM_PRIVATEKEY(params) {
  const { privateKeyAsHex } = params;
  // const privateKeyAsHex = stringToHexString(privateKeyAsUtf8)
  return getPublicKeyFromPrivateKey(privateKeyAsHex)
}

/**
 * @param {{
 *   publicKeyAsHex: string,
 * }} params
 * @returns string
 */
function HEAT_GET_ADDRESS_FROM_PUBLICKEY(params) {
  const { publicKeyAsHex } = params;
  return getAccountIdFromPublicKey(publicKeyAsHex)
}

module.exports = {
  HEAT_GET_PUBLICKEY_FROM_PRIVATEKEY,
  HEAT_ADDRESS_FROM_PRIVATEKEY,
  HEAT_GET_ADDRESS_FROM_PUBLICKEY,
}