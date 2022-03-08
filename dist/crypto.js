"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passphraseDecrypt = exports.passphraseEncrypt = exports.PassphraseEncryptedMessage = exports.decryptMessage = exports.encryptMessage = exports.encryptBinaryNote = exports.encryptNote = exports.verifyBytes = exports.signBytes = exports.getAccountIdFromPublicKey = exports.getAccountId = exports.getPublicKeyFromPrivateKey = exports.getPrivateKey = exports.secretPhraseToPublicKey = exports.calculateTransactionId = exports.fullNameToLong = exports.fullNameToHash = exports.calculateFullHash = exports.byteArrayToBigInteger = exports.calculateStringHash = exports.random32Values = exports.random16Values = exports.random8Values = exports.SHA256 = void 0;
var converters_1 = require("./converters");
var big_js_1 = __importDefault(require("big.js"));
var pako_1 = require("pako");
var long_1 = __importDefault(require("long"));
var random_bytes_1 = require("./random-bytes");
var curve25519_1 = require("curve25519");
var cryptojs_1 = require("cryptojs");
var crypto_1 = require("crypto");
var SHA256_hash;
function SHA256_init() {
    SHA256_hash = crypto_1.createHash('SHA256');
}
function SHA256_write(msg) {
    SHA256_hash.update(Buffer.from(msg));
}
function SHA256_finalize() {
    return Array.from(SHA256_hash.digest());
}
var _hash = {
    init: SHA256_init,
    update: SHA256_write,
    getBytes: SHA256_finalize
};
exports.SHA256 = _hash;
function random8Values(len) {
    return random_bytes_1.randomBytes(len);
}
exports.random8Values = random8Values;
function random16Values(len) {
    return random_bytes_1.randomBytes(len * 2).then(function (bytes) { return new Uint16Array(bytes.buffer); });
}
exports.random16Values = random16Values;
function random32Values(len) {
    return random_bytes_1.randomBytes(len * 4).then(function (bytes) { return new Uint32Array(bytes.buffer); });
}
exports.random32Values = random32Values;
function simpleHash(message) {
    _hash.init();
    _hash.update(message);
    return _hash.getBytes();
}
/**
 * Calculates a SHA256 hash from a string.
 *
 * @param inputString String (regular UTF-8 string)
 * @returns Hash as HEX String
 */
function calculateStringHash(inputString) {
    var hexString = converters_1.stringToHexString(inputString);
    var bytes = converters_1.hexStringToByteArray(hexString);
    var hashBytes = simpleHash(bytes);
    return converters_1.byteArrayToHexString(hashBytes);
}
exports.calculateStringHash = calculateStringHash;
/**
 * @param byteArray ByteArray
 * @param startIndex Int
 * @returns Big
 */
function byteArrayToBigInteger(byteArray, startIndex) {
    var value = new big_js_1.default("0");
    var temp1, temp2;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        temp1 = value.times(new big_js_1.default("256"));
        temp2 = temp1.plus(new big_js_1.default(byteArray[i].toString(10)));
        value = temp2;
    }
    return value;
}
exports.byteArrayToBigInteger = byteArrayToBigInteger;
/**
 * @param unsignedTransaction hex-string
 * @param signature hex-string
 * @returns hex-string
 */
function calculateFullHash(unsignedTransaction, signature) {
    var unsignedTransactionBytes = converters_1.hexStringToByteArray(unsignedTransaction);
    var signatureBytes = converters_1.hexStringToByteArray(signature);
    var signatureHash = simpleHash(signatureBytes);
    _hash.init();
    _hash.update(unsignedTransactionBytes);
    _hash.update(signatureHash);
    var fullHash = _hash.getBytes();
    return converters_1.byteArrayToHexString(fullHash);
}
exports.calculateFullHash = calculateFullHash;
/**
 * @param fullnameUTF8 UTF-8 user name
 * @returns hex-string
 */
function fullNameToHash(fullNameUTF8) {
    return _fullNameToBigInteger(converters_1.stringToByteArray(fullNameUTF8));
}
exports.fullNameToHash = fullNameToHash;
function fullNameToLong(fullName) {
    return long_1.default.fromString(_fullNameToBigInteger(fullName).toString());
}
exports.fullNameToLong = fullNameToLong;
function _fullNameToBigInteger(fullName) {
    _hash.init();
    _hash.update(fullName);
    var slice = converters_1.hexStringToByteArray(converters_1.byteArrayToHexString(_hash.getBytes())).slice(0, 8);
    return byteArrayToBigInteger(slice).toString();
}
/**
 * @param fullHashHex hex-string
 * @returns string
 */
function calculateTransactionId(fullHashHex) {
    var slice = converters_1.hexStringToByteArray(fullHashHex).slice(0, 8);
    var transactionId = byteArrayToBigInteger(slice).toString();
    return transactionId;
}
exports.calculateTransactionId = calculateTransactionId;
/**
 * Turns a secretphrase into a public key
 * @param secretPhrase String
 * @returns HEX string
 */
function secretPhraseToPublicKey(secretPhrase) {
    var secretHex = converters_1.stringToHexString(secretPhrase);
    var secretPhraseBytes = converters_1.hexStringToByteArray(secretHex);
    var digest = simpleHash(secretPhraseBytes);
    return converters_1.byteArrayToHexString(curve25519_1.curve25519.keygen(digest).p);
}
exports.secretPhraseToPublicKey = secretPhraseToPublicKey;
/**
 * ..
 * @param secretPhrase Ascii String
 * @returns hex-string
 */
function getPrivateKey(secretPhrase) {
    SHA256_init();
    SHA256_write(converters_1.stringToByteArray(secretPhrase));
    return converters_1.shortArrayToHexString(curve25519_1.curve25519_clamp(converters_1.byteArrayToShortArray(SHA256_finalize())));
}
exports.getPrivateKey = getPrivateKey;
/**
 *
 * @param privateKeyHex
 */
function getPublicKeyFromPrivateKey(privateKeyHex) {
    var secretPhraseBytes = converters_1.hexStringToByteArray(privateKeyHex);
    var digest = simpleHash(secretPhraseBytes);
    return converters_1.byteArrayToHexString(curve25519_1.curve25519.keygen(digest).p);
}
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
/**
 * @param secretPhrase Ascii String
 * @returns String
 */
function getAccountId(secretPhrase) {
    var publicKey = secretPhraseToPublicKey(secretPhrase);
    return getAccountIdFromPublicKey(publicKey);
}
exports.getAccountId = getAccountId;
/**
 * @param secretPhrase Hex String
 * @returns String
 */
function getAccountIdFromPublicKey(publicKey) {
    _hash.init();
    _hash.update(converters_1.hexStringToByteArray(publicKey));
    var account = _hash.getBytes();
    var slice = converters_1.hexStringToByteArray(converters_1.byteArrayToHexString(account)).slice(0, 8);
    return byteArrayToBigInteger(slice).toString();
}
exports.getAccountIdFromPublicKey = getAccountIdFromPublicKey;
/**
 * TODO pass secretphrase as string instead of HEX string, convert to
 * hex string ourselves.
 *
 * @param message HEX String
 * @param secretPhrase Hex String
 * @returns Hex String
 */
function signBytes(message, secretPhrase) {
    var messageBytes = converters_1.hexStringToByteArray(message);
    var secretPhraseBytes = converters_1.hexStringToByteArray(secretPhrase);
    var digest = simpleHash(secretPhraseBytes);
    var s = curve25519_1.curve25519.keygen(digest).s;
    var m = simpleHash(messageBytes);
    _hash.init();
    _hash.update(m);
    _hash.update(s);
    var x = _hash.getBytes();
    var y = curve25519_1.curve25519.keygen(x).p;
    _hash.init();
    _hash.update(m);
    _hash.update(y);
    var h = _hash.getBytes();
    var v = curve25519_1.curve25519.sign(h, x, s);
    if (v)
        return converters_1.byteArrayToHexString(v.concat(h));
}
exports.signBytes = signBytes;
/**
 * ...
 * @param signature     Hex String
 * @param message       Hex String
 * @param publicKey     Hex String
 * @returns Boolean
 */
function verifyBytes(signature, message, publicKey) {
    var signatureBytes = converters_1.hexStringToByteArray(signature);
    var messageBytes = converters_1.hexStringToByteArray(message);
    var publicKeyBytes = converters_1.hexStringToByteArray(publicKey);
    var v = signatureBytes.slice(0, 32);
    var h = signatureBytes.slice(32);
    var y = curve25519_1.curve25519.verify(v, h, publicKeyBytes);
    var m = simpleHash(messageBytes);
    _hash.init();
    _hash.update(m);
    _hash.update(y);
    var h2 = _hash.getBytes();
    return areByteArraysEqual(h, h2);
}
exports.verifyBytes = verifyBytes;
function areByteArraysEqual(bytes1, bytes2) {
    if (bytes1.length !== bytes2.length) {
        return false;
    }
    for (var i = 0; i < bytes1.length; ++i) {
        if (bytes1[i] !== bytes2[i])
            return false;
    }
    return true;
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
function encryptNote(message, options, secretPhrase, uncompressed) {
    if (!options.sharedKey) {
        if (!options.privateKey) {
            options.privateKey = converters_1.hexStringToByteArray(getPrivateKey(secretPhrase));
        }
        if (!options.publicKey) {
            throw new Error("Missing publicKey argument");
        }
    }
    return encryptData(converters_1.stringToByteArray(message), options, uncompressed).then(function (encrypted) {
        return {
            message: converters_1.byteArrayToHexString(encrypted.data),
            nonce: converters_1.byteArrayToHexString(encrypted.nonce)
        };
    });
}
exports.encryptNote = encryptNote;
/**
 * @param message Byte Array
 * @param options Object {
 *    account: String,    // recipient account id
 *    publicKey: String,  // recipient public key
 * }
 * @param secretPhrase String
 * @returns { message: String, nonce: String }
 */
function encryptBinaryNote(message, options, secretPhrase, uncompressed) {
    if (!options.sharedKey) {
        if (!options.privateKey) {
            options.privateKey = converters_1.hexStringToByteArray(getPrivateKey(secretPhrase));
        }
        if (!options.publicKey) {
            throw new Error("Missing publicKey argument");
        }
    }
    return encryptData(message, options, uncompressed).then(function (encrypted) {
        return {
            message: converters_1.byteArrayToHexString(encrypted.data),
            nonce: converters_1.byteArrayToHexString(encrypted.nonce)
        };
    });
}
exports.encryptBinaryNote = encryptBinaryNote;
/**
 * @param key1 ByteArray
 * @param key2 ByteArray
 * @returns ByteArray
 */
function getSharedKey(key1, key2) {
    return converters_1.shortArrayToByteArray(curve25519_1.curve25519_(converters_1.byteArrayToShortArray(key1), converters_1.byteArrayToShortArray(key2), null));
}
function encryptData(plaintext, options, uncompressed) {
    return random_bytes_1.randomBytes(32)
        .then(function (bytes) {
        if (!options.sharedKey) {
            options.sharedKey = getSharedKey(options.privateKey, options.publicKey);
        }
        options.nonce = bytes;
        var compressedPlaintext = uncompressed
            ? new Uint8Array(plaintext)
            : pako_1.gzip(new Uint8Array(plaintext));
        return aesEncrypt(compressedPlaintext, options);
    })
        .then(function (data) {
        return {
            nonce: options.nonce,
            data: data
        };
    });
}
function aesEncrypt(plaintext, options) {
    return random_bytes_1.randomBytes(16).then(function (bytes) {
        var text = converters_1.byteArrayToWordArray(plaintext);
        var sharedKey = options.sharedKey
            ? options.sharedKey.slice(0)
            : getSharedKey(options.privateKey, options.publicKey);
        for (var i = 0; i < 32; i++) {
            sharedKey[i] ^= options.nonce[i];
        }
        var tmp = bytes;
        var key = cryptojs_1.CryptoJS.SHA256(converters_1.byteArrayToWordArray(sharedKey));
        var iv = converters_1.byteArrayToWordArray(tmp);
        var encrypted = cryptojs_1.CryptoJS.AES.encrypt(text, key, {
            iv: iv
        });
        var ivOut = converters_1.wordArrayToByteArray(encrypted.iv);
        var ciphertextOut = converters_1.wordArrayToByteArray(encrypted.ciphertext);
        return ivOut.concat(ciphertextOut);
    });
}
function encryptMessage(message, publicKey, secretPhrase, uncompressed) {
    var options = {
        account: getAccountIdFromPublicKey(publicKey),
        publicKey: converters_1.hexStringToByteArray(publicKey)
    };
    return encryptNote(message, options, secretPhrase, uncompressed).then(function (encrypted) {
        return {
            isText: true,
            data: encrypted.message,
            nonce: encrypted.nonce
        };
    });
}
exports.encryptMessage = encryptMessage;
function decryptMessage(data, nonce, publicKey, secretPhrase, uncompressed) {
    var privateKey = converters_1.hexStringToByteArray(getPrivateKey(secretPhrase));
    var publicKeyBytes = converters_1.hexStringToByteArray(publicKey);
    var sharedKey = getSharedKey(privateKey, publicKeyBytes);
    var dataBytes = converters_1.hexStringToByteArray(data);
    var nonceBytes = converters_1.hexStringToByteArray(nonce);
    try {
        return decryptData(dataBytes, {
            privateKey: privateKey,
            publicKey: publicKeyBytes,
            nonce: nonceBytes,
            sharedKey: sharedKey
        }, uncompressed);
    }
    catch (e) {
        if (e instanceof RangeError || e == "incorrect header check") {
            console.error("Managed Exception: " + e);
            return decryptData(dataBytes, {
                privateKey: privateKey,
                publicKey: publicKeyBytes,
                nonce: nonceBytes,
                sharedKey: sharedKey
            }, !uncompressed);
        }
        throw e;
    }
}
exports.decryptMessage = decryptMessage;
function decryptData(data, options, uncompressed) {
    var compressedPlaintext = aesDecrypt(data, options);
    var binData = new Uint8Array(compressedPlaintext);
    var data_ = uncompressed ? binData : pako_1.inflate(binData);
    return converters_1.byteArrayToString(data_);
}
function aesDecrypt(ivCiphertext, options) {
    if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
        throw { name: "invalid ciphertext" };
    }
    var iv = converters_1.byteArrayToWordArray(ivCiphertext.slice(0, 16));
    var ciphertext = converters_1.byteArrayToWordArray(ivCiphertext.slice(16));
    var sharedKey = options.sharedKey.slice(0); //clone
    for (var i = 0; i < 32; i++) {
        sharedKey[i] ^= options.nonce[i];
    }
    var key = cryptojs_1.CryptoJS.SHA256(converters_1.byteArrayToWordArray(sharedKey));
    var encrypted = cryptojs_1.CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        iv: iv,
        key: key
    });
    var decrypted = cryptojs_1.CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv
    });
    var plaintext = converters_1.wordArrayToByteArray(decrypted);
    return plaintext;
}
var PassphraseEncryptedMessage = /** @class */ (function () {
    function PassphraseEncryptedMessage(ciphertext, salt, iv, HMAC) {
        this.ciphertext = ciphertext;
        this.salt = salt;
        this.iv = iv;
        this.HMAC = HMAC;
    }
    PassphraseEncryptedMessage.decode = function (encoded) {
        var json = JSON.parse(encoded);
        return new PassphraseEncryptedMessage(json[0], json[1], json[2], json[3]);
    };
    PassphraseEncryptedMessage.prototype.encode = function () {
        return JSON.stringify([this.ciphertext, this.salt, this.iv, this.HMAC]);
    };
    return PassphraseEncryptedMessage;
}());
exports.PassphraseEncryptedMessage = PassphraseEncryptedMessage;
function passphraseEncrypt(message, passphrase) {
    var salt = cryptojs_1.CryptoJS.lib.WordArray.random(256 / 8);
    var key = cryptojs_1.CryptoJS.PBKDF2(passphrase, salt, {
        iterations: 10,
        hasher: cryptojs_1.CryptoJS.algo.SHA256
    });
    var iv = cryptojs_1.CryptoJS.lib.WordArray.random(128 / 8);
    var encrypted = cryptojs_1.CryptoJS.AES.encrypt(message, key, { iv: iv });
    var ciphertext = cryptojs_1.CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    var salt_str = cryptojs_1.CryptoJS.enc.Hex.stringify(salt);
    var iv_str = cryptojs_1.CryptoJS.enc.Hex.stringify(iv);
    var key_str = cryptojs_1.CryptoJS.enc.Hex.stringify(key);
    var HMAC = cryptojs_1.CryptoJS.HmacSHA256(ciphertext + iv_str, key_str);
    var HMAC_str = cryptojs_1.CryptoJS.enc.Hex.stringify(HMAC);
    return new PassphraseEncryptedMessage(ciphertext, salt_str, iv_str, HMAC_str);
}
exports.passphraseEncrypt = passphraseEncrypt;
function passphraseDecrypt(cp, passphrase) {
    var iv = cryptojs_1.CryptoJS.enc.Hex.parse(cp.iv);
    var salt = cryptojs_1.CryptoJS.enc.Hex.parse(cp.salt);
    var key = cryptojs_1.CryptoJS.PBKDF2(passphrase, salt, {
        iterations: 10,
        hasher: cryptojs_1.CryptoJS.algo.SHA256
    });
    var ciphertext = cryptojs_1.CryptoJS.enc.Base64.parse(cp.ciphertext);
    var key_str = cryptojs_1.CryptoJS.enc.Hex.stringify(key);
    var HMAC = cryptojs_1.CryptoJS.HmacSHA256(cp.ciphertext + cp.iv, key_str);
    var HMAC_str = cryptojs_1.CryptoJS.enc.Hex.stringify(HMAC);
    // compare HMACs
    if (HMAC_str != cp.HMAC) {
        return null;
    }
    var _cp = cryptojs_1.CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
    });
    var decrypted = cryptojs_1.CryptoJS.AES.decrypt(_cp, key, { iv: iv });
    return decrypted.toString(cryptojs_1.CryptoJS.enc.Utf8);
}
exports.passphraseDecrypt = passphraseDecrypt;
