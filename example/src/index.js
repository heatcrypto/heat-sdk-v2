const { getPublicKeyFromPrivateKey, getAccountIdFromPublicKey } = require('heat-sdk-v2/dist/crypto');
const { HeatSDK, Configuration, Builder, attachment, Transaction } = require("heat-sdk-v2")
const { isString, isBoolean } = require('lodash');

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

/**
 * @typedef {"prod" | "test"} NetworkType
 */

/**
 * @param {{
 *  key: string, 
 *  recipientAddress: string, 
 *  recipientPublicKey: string, 
 *  amount: string, 
 *  fee: string, 
 *  networkType: ('prod' | 'test' | null), 
 *  message: string, 
 *  messageIsPrivate: boolean, 
 *  messageIsBinary: boolean
 * }} params
 * @returns hex string
 */
function HEAT_TRANSFER_HEAT(params) {
  const { key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary, } = params
  return transferHeat(key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary,)
}

/**
 * Create a transaction to transfer HEAT.
 * 
 * @param {String} key 
 * @param {String | null} recipientAddress 
 * @param {String | null} recipientPublicKey 
 * @param {String} amount 
 * @param {String | null} fee 
 * @param {'prod' | 'test' | null} networkType 
 * @param {String | null} message 
 * @param {Boolean | null} messageIsPrivate 
 * @param {Boolean | null} messageIsBinary 
 * 
 * @returns bytes HEX string
 */
 function transferHeat(key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary) {
  if (!isString(key)) throw new Error(`Key arg should be "String"`)
  if (!isValidAddress(recipientAddress)) throw new Error(`recipientAddress arg should be "String"`)
  if (recipientPublicKey && !isString(recipientPublicKey)) throw new Error(`recipientPublicKey arg should be "String"`)
  if (!isString(amount) && !isNaN(Number(amount)) && Number(amount) > 0) throw new Error(`amount arg should be "String"`)
  if (!isString(fee) && !isNaN(Number(fee)) && Number(fee) > 0) throw new Error(`fee arg should be "String"`)
  if (!isString(networkType)) throw new Error(`networkType arg should be "String"`)
  if (message && !isString(message)) throw new Error(`message arg should be "String"`)
  if (!isBoolean(messageIsPrivate)) throw new Error(`messageIsPrivate arg should be "Boolean"`)
  if (!isBoolean(messageIsBinary)) throw new Error(`messageIsBinary arg should be "Boolean"`)

  const isTestnet = networkType == 'test' ? true : false
  const sdk = new HeatSDK(new Configuration({ isTestnet: isTestnet }))
  const recipientAddressOrPublicKey = (isString(recipientPublicKey) ? recipientPublicKey : recipientAddress)
  let builder = new Builder()
    .isTestnet(sdk.config.isTestnet)
    .genesisKey(sdk.config.genesisKey)
    .attachment(attachment.ORDINARY_PAYMENT)
    .amountHQT(amount)
    .feeHQT(fee)
  let txn = new Transaction(sdk, recipientAddressOrPublicKey, builder)
  if (message) {
    txn = messageIsPrivate ? txn.privateMessage(message, messageIsBinary) : txn.publicMessage(message, messageIsBinary)
  }
  return txn.sign(key).then(t => {
    let transaction = t.getTransaction()
    let bytes = transaction.getBytesAsHex()
    return bytes
  })
}

function isValidAddress(value) {
  return isString(value) && !isNaN(Number(value)) && Number(value) != 0
}

var g = typeof globalThis === "undefined" ? global : globalThis;
g['__methods__'] = module.exports = {
  HEAT_GET_PUBLICKEY_FROM_PRIVATEKEY,
  HEAT_ADDRESS_FROM_PRIVATEKEY,
  HEAT_GET_ADDRESS_FROM_PUBLICKEY,
  HEAT_TRANSFER_HEAT,
}


