/**
 * The MIT License (MIT)
 * Copyright (c) 2020 heatcrypto.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */

import {
  byteArrayToHexString,
  byteArrayToShortArray,
  byteArrayToString,
  byteArrayToWordArray,
  hexStringToByteArray,
  shortArrayToByteArray,
  shortArrayToHexString,
  stringToByteArray,
  stringToHexString,
  wordArrayToByteArray
} from "./converters"
import Big from "big.js"
import { gzip, inflate } from "pako"
import Long from "long"
import { randomBytes } from "./random-bytes"
import { curve25519, curve25519_clamp, curve25519_ } from 'curve25519'
import { CryptoJS } from 'cryptojs'
import { createHash, Hash } from 'crypto'

let SHA256_hash: Hash;

function SHA256_init() {
  SHA256_hash = createHash('SHA256');
}

function SHA256_write(msg:Array<number>) {
  SHA256_hash.update(Buffer.from(msg))
}

function SHA256_finalize() {
  return Array.from(SHA256_hash.digest())
}

var _hash = {
  init: SHA256_init,
  update: SHA256_write,
  getBytes: SHA256_finalize
}

export var SHA256 = _hash

export function random8Values(len: number): Promise<Uint8Array> {
  return randomBytes(len)
}

export function random16Values(len: number): Promise<Uint16Array> {
  return randomBytes(len * 2).then(bytes => new Uint16Array(bytes.buffer))
}

export function random32Values(len: number): Promise<Uint32Array> {
  return randomBytes(len * 4).then(bytes => new Uint32Array(bytes.buffer))
}

function simpleHash(message: any) {
  _hash.init()
  _hash.update(message)
  return _hash.getBytes()
}

/**
 * Calculates a SHA256 hash from a string.
 *
 * @param inputString String (regular UTF-8 string)
 * @returns Hash as HEX String
 */
export function calculateStringHash(inputString: string) {
  var hexString = stringToHexString(inputString)
  var bytes = hexStringToByteArray(hexString)
  var hashBytes = simpleHash(bytes)
  return byteArrayToHexString(hashBytes)  
}

/**
 * @param byteArray ByteArray
 * @param startIndex Int
 * @returns Big
 */
export function byteArrayToBigInteger(byteArray: any, startIndex?: number) {
  var value = new Big("0")
  var temp1, temp2
  for (var i = byteArray.length - 1; i >= 0; i--) {
    temp1 = value.times(new Big("256"))
    temp2 = temp1.plus(new Big(byteArray[i].toString(10)))
    value = temp2
  }
  return value
}

/**
 * @param unsignedTransaction hex-string
 * @param signature hex-string
 * @returns hex-string
 */
export function calculateFullHash(unsignedTransaction: string, signature: string): string {
  var unsignedTransactionBytes = hexStringToByteArray(unsignedTransaction)
  var signatureBytes = hexStringToByteArray(signature)
  var signatureHash = simpleHash(signatureBytes)

  _hash.init()
  _hash.update(unsignedTransactionBytes)
  _hash.update(signatureHash)
  var fullHash = _hash.getBytes()
  return byteArrayToHexString(fullHash)
}

/**
 * @param fullnameUTF8 UTF-8 user name
 * @returns hex-string
 */
export function fullNameToHash(fullNameUTF8: string): string {
  return _fullNameToBigInteger(stringToByteArray(fullNameUTF8))
}

export function fullNameToLong(fullName: number[]): Long {
  return Long.fromString(_fullNameToBigInteger(fullName).toString())
}

function _fullNameToBigInteger(fullName: number[]): string {
  _hash.init()
  _hash.update(fullName)
  var slice = hexStringToByteArray(byteArrayToHexString(_hash.getBytes())).slice(0, 8)
  return byteArrayToBigInteger(slice).toString()
}

/**
 * @param fullHashHex hex-string
 * @returns string
 */
export function calculateTransactionId(fullHashHex: string): string {
  var slice = hexStringToByteArray(fullHashHex).slice(0, 8)
  var transactionId = byteArrayToBigInteger(slice).toString()
  return transactionId
}

/**
 * Turns a secretphrase into a public key
 * @param secretPhrase String
 * @returns HEX string
 */
export function secretPhraseToPublicKey(secretPhrase: string): string {
  var secretHex = stringToHexString(secretPhrase)
  var secretPhraseBytes = hexStringToByteArray(secretHex)
  var digest = simpleHash(secretPhraseBytes)
  return byteArrayToHexString(curve25519.keygen(digest).p)
}

/**
 * ..
 * @param secretPhrase Ascii String
 * @returns hex-string
 */
export function getPrivateKey(secretPhrase: string) {
  SHA256_init()
  SHA256_write(stringToByteArray(secretPhrase))
  return shortArrayToHexString(curve25519_clamp(byteArrayToShortArray(SHA256_finalize())))
}

/**
 * 
 * @param privateKeyHex 
 */
export function getPublicKeyFromPrivateKey(privateKeyHex: string) {
  var secretPhraseBytes = hexStringToByteArray(privateKeyHex)
  var digest = simpleHash(secretPhraseBytes)
  return byteArrayToHexString(curve25519.keygen(digest).p)
}

/**
 * @param secretPhrase Ascii String
 * @returns String
 */
export function getAccountId(secretPhrase: string) {
  var publicKey = secretPhraseToPublicKey(secretPhrase)
  return getAccountIdFromPublicKey(publicKey)
}

/**
 * @param secretPhrase Hex String
 * @returns String
 */
export function getAccountIdFromPublicKey(publicKey: string) {
  _hash.init()
  _hash.update(hexStringToByteArray(publicKey))

  var account = _hash.getBytes()
  var slice = hexStringToByteArray(byteArrayToHexString(account)).slice(0, 8)
  return byteArrayToBigInteger(slice).toString()
}

/**
 * TODO pass secretphrase as string instead of HEX string, convert to
 * hex string ourselves.
 *
 * @param message HEX String
 * @param secretPhrase Hex String
 * @returns Hex String
 */
export function signBytes(message: string, secretPhrase: string) {
  var messageBytes = hexStringToByteArray(message)
  var secretPhraseBytes = hexStringToByteArray(secretPhrase)

  var digest = simpleHash(secretPhraseBytes)
  var s = curve25519.keygen(digest).s
  var m = simpleHash(messageBytes)

  _hash.init()
  _hash.update(m)
  _hash.update(s)
  var x = _hash.getBytes()

  var y = curve25519.keygen(x).p

  _hash.init()
  _hash.update(m)
  _hash.update(y)
  var h = _hash.getBytes()

  var v = curve25519.sign(h, x, s)
  if (v) return byteArrayToHexString(v.concat(h))
}

/**
 * ...
 * @param signature     Hex String
 * @param message       Hex String
 * @param publicKey     Hex String
 * @returns Boolean
 */
export function verifyBytes(signature: string, message: string, publicKey: string): boolean {
  var signatureBytes = hexStringToByteArray(signature)
  var messageBytes = hexStringToByteArray(message)
  var publicKeyBytes = hexStringToByteArray(publicKey)
  var v = signatureBytes.slice(0, 32)
  var h = signatureBytes.slice(32)
  var y = curve25519.verify(v, h, publicKeyBytes)

  var m = simpleHash(messageBytes)

  _hash.init()
  _hash.update(m)
  _hash.update(y)
  var h2 = _hash.getBytes()

  return areByteArraysEqual(h, h2)
}

function areByteArraysEqual(bytes1: Array<number>, bytes2: Array<number>): boolean {
  if (bytes1.length !== bytes2.length) {
    return false
  }
  for (var i = 0; i < bytes1.length; ++i) {
    if (bytes1[i] !== bytes2[i]) return false
  }
  return true
}

export interface IEncryptOptions {
  /* Recipient account id */
  account?: string

  /* Recipient public key */
  publicKey?: Array<number>

  /* Private key to decrypt messages to self */
  privateKey?: Array<number>

  /* Shared key to encrypt messages to other account */
  sharedKey?: Array<number>

  /* Uint8Array */
  nonce?: any
}

/**
 * @param message String
 * @param options Object {
 *    account: String,    // recipient account id
 *    publicKey: String,  // recipient public key
 * }
 * @param secretPhrase String
 * @returns { message: String, nonce: String }
 */
export function encryptNote(
  message: string,
  options: IEncryptOptions,
  secretPhrase: string,
  uncompressed?: boolean
): Promise<{ message: string; nonce: string }> {
  if (!options.sharedKey) {
    if (!options.privateKey) {
      options.privateKey = hexStringToByteArray(getPrivateKey(secretPhrase))
    }
    if (!options.publicKey) {
      throw new Error("Missing publicKey argument")
    }
  }
  return encryptData(stringToByteArray(message), options, uncompressed).then(encrypted => {
    return {
      message: byteArrayToHexString(encrypted.data),
      nonce: byteArrayToHexString(<any>encrypted.nonce)
    }
  })
}

/**
 * @param message Byte Array
 * @param options Object {
 *    account: String,    // recipient account id
 *    publicKey: String,  // recipient public key
 * }
 * @param secretPhrase String
 * @returns { message: String, nonce: String }
 */
export function encryptBinaryNote(
  message: Array<number>,
  options: IEncryptOptions,
  secretPhrase: string,
  uncompressed?: boolean
): Promise<{ nonce: string; message: string }> {
  if (!options.sharedKey) {
    if (!options.privateKey) {
      options.privateKey = hexStringToByteArray(getPrivateKey(secretPhrase))
    }
    if (!options.publicKey) {
      throw new Error("Missing publicKey argument")
    }
  }
  return encryptData(message, options, uncompressed).then(encrypted => {
    return {
      message: byteArrayToHexString(encrypted.data),
      nonce: byteArrayToHexString(<any>encrypted.nonce)
    }
  })
}

/**
 * @param key1 ByteArray
 * @param key2 ByteArray
 * @returns ByteArray
 */
function getSharedKey(key1: any, key2: any) {
  return shortArrayToByteArray(
    curve25519_(byteArrayToShortArray(key1), byteArrayToShortArray(key2), null)
  )
}

function encryptData(
  plaintext: Array<number>,
  options: IEncryptOptions,
  uncompressed?: boolean
): Promise<{ nonce: Uint8Array; data: any[] }> {
  return randomBytes(32)
    .then(bytes => {
      if (!options.sharedKey) {
        options.sharedKey = getSharedKey(options.privateKey, options.publicKey)
      }
      options.nonce = bytes

      var compressedPlaintext = uncompressed
        ? new Uint8Array(plaintext)
        : gzip(new Uint8Array(plaintext))

      return aesEncrypt(<any>compressedPlaintext, options)
    })
    .then(data => {
      return {
        nonce: options.nonce,
        data: data
      }
    })
}

function aesEncrypt(plaintext: Array<number>, options: IEncryptOptions): Promise<number[]> {
  return randomBytes(16).then(bytes => {
    var text = byteArrayToWordArray(plaintext)
    var sharedKey = options.sharedKey
      ? options.sharedKey.slice(0)
      : getSharedKey(options.privateKey, options.publicKey)

    for (var i = 0; i < 32; i++) {
      sharedKey[i] ^= options.nonce[i]
    }

    var tmp: any = bytes
    var key = CryptoJS.SHA256(byteArrayToWordArray(sharedKey))
    var iv = byteArrayToWordArray(tmp)
    var encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv
    })

    var ivOut = wordArrayToByteArray(encrypted.iv)
    var ciphertextOut = wordArrayToByteArray(encrypted.ciphertext)
    return ivOut.concat(ciphertextOut)
  })
}

export interface IEncryptedMessage {
  isText: boolean
  data: string // hex string
  nonce: string // hex string
}

export function encryptMessage(
  message: string,
  publicKey: string,
  secretPhrase: string,
  uncompressed?: boolean
): Promise<IEncryptedMessage> {
  var options: IEncryptOptions = {
    account: getAccountIdFromPublicKey(publicKey),
    publicKey: hexStringToByteArray(publicKey)
  }
  return encryptNote(message, options, secretPhrase, uncompressed).then(encrypted => {
    return {
      isText: true,
      data: encrypted.message,
      nonce: encrypted.nonce
    }
  })
}

export function decryptMessage(
  data: string,
  nonce: string,
  publicKey: string,
  secretPhrase: string,
  uncompressed?: boolean
): string {
  var privateKey = hexStringToByteArray(getPrivateKey(secretPhrase))
  var publicKeyBytes = hexStringToByteArray(publicKey)
  var sharedKey = getSharedKey(privateKey, publicKeyBytes)
  var dataBytes = hexStringToByteArray(data)
  var nonceBytes = hexStringToByteArray(nonce)
  try {
    return decryptData(
      dataBytes,
      {
        privateKey: privateKey,
        publicKey: publicKeyBytes,
        nonce: nonceBytes,
        sharedKey: sharedKey
      },
      uncompressed
    )
  } catch (e) {
    if (e instanceof RangeError || e == "incorrect header check") {
      console.error("Managed Exception: " + e)

      return decryptData(
        dataBytes,
        {
          privateKey: privateKey,
          publicKey: publicKeyBytes,
          nonce: nonceBytes,
          sharedKey: sharedKey
        },
        !uncompressed
      )
    }
    throw e
  }
}

function decryptData(data: any, options: any, uncompressed?: boolean) {
  var compressedPlaintext = aesDecrypt(data, options)
  var binData = new Uint8Array(compressedPlaintext)
  var data_ = uncompressed ? binData : inflate(binData)
  return byteArrayToString(<any>data_)
}

function aesDecrypt(ivCiphertext: any, options: any) {
  if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
    throw { name: "invalid ciphertext" }
  }

  var iv = byteArrayToWordArray(ivCiphertext.slice(0, 16))
  var ciphertext = byteArrayToWordArray(ivCiphertext.slice(16))
  var sharedKey = options.sharedKey.slice(0) //clone
  for (var i = 0; i < 32; i++) {
    sharedKey[i] ^= options.nonce[i]
  }

  var key = CryptoJS.SHA256(byteArrayToWordArray(sharedKey))
  var encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext,
    iv: iv,
    key: key
  })
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv
  })
  var plaintext = wordArrayToByteArray(decrypted)
  return plaintext
}

export class PassphraseEncryptedMessage {
  ciphertext: string
  salt: string
  iv: string
  HMAC: string

  constructor(ciphertext: string, salt: string, iv: string, HMAC: string) {
    this.ciphertext = ciphertext
    this.salt = salt
    this.iv = iv
    this.HMAC = HMAC
  }

  static decode(encoded: string): PassphraseEncryptedMessage {
    var json = JSON.parse(encoded)
    return new PassphraseEncryptedMessage(json[0], json[1], json[2], json[3])
  }

  encode(): string {
    return JSON.stringify([this.ciphertext, this.salt, this.iv, this.HMAC])
  }
}

export function passphraseEncrypt(message: string, passphrase: string): PassphraseEncryptedMessage {
  var salt = CryptoJS.lib.WordArray.random(256 / 8)
  var key = CryptoJS.PBKDF2(passphrase, salt, {
    iterations: 10,
    hasher: CryptoJS.algo.SHA256
  })
  var iv = CryptoJS.lib.WordArray.random(128 / 8)

  var encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv })

  var ciphertext = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  var salt_str = CryptoJS.enc.Hex.stringify(salt)
  var iv_str = CryptoJS.enc.Hex.stringify(iv)

  var key_str = CryptoJS.enc.Hex.stringify(key)
  var HMAC = CryptoJS.HmacSHA256(ciphertext + iv_str, key_str)
  var HMAC_str = CryptoJS.enc.Hex.stringify(HMAC)

  return new PassphraseEncryptedMessage(ciphertext, salt_str, iv_str, HMAC_str)
}

export function passphraseDecrypt(
  cp: PassphraseEncryptedMessage,
  passphrase: string
): string | null {
  var iv = CryptoJS.enc.Hex.parse(cp.iv)
  var salt = CryptoJS.enc.Hex.parse(cp.salt)
  var key = CryptoJS.PBKDF2(passphrase, salt, {
    iterations: 10,
    hasher: CryptoJS.algo.SHA256
  })
  var ciphertext = CryptoJS.enc.Base64.parse(cp.ciphertext)
  var key_str = CryptoJS.enc.Hex.stringify(key)
  var HMAC = CryptoJS.HmacSHA256(cp.ciphertext + cp.iv, key_str)
  var HMAC_str = CryptoJS.enc.Hex.stringify(HMAC)

  // compare HMACs
  if (HMAC_str != cp.HMAC) {
    return null
  }
  var _cp = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  })

  var decrypted = CryptoJS.AES.decrypt(_cp, key, { iv: iv })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
