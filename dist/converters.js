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
Object.defineProperty(exports, "__esModule", { value: true });
exports.int32ToBytes = exports.shortArrayToHexString = exports.shortArrayToByteArray = exports.byteArrayToShortArray = exports.byteArrayToString = exports.wordArrayToByteArray = exports.byteArrayToWordArray = exports.byteArrayToBigInteger = exports.byteArrayToSignedInt32 = exports.byteArrayToSignedShort = exports.hexStringToString = exports.stringToHexString = exports.hexStringToByteArray = exports.stringToByteArray = exports.byteArrayToHexString = void 0;
var Big = require('big.js');
var charToNibble = {};
var nibbleToChar = [];
var i;
for (i = 0; i <= 9; ++i) {
    var character = i.toString();
    charToNibble[character] = i;
    nibbleToChar.push(character);
}
for (i = 10; i <= 15; ++i) {
    var lowerChar = String.fromCharCode("a".charCodeAt(0) + i - 10);
    var upperChar = String.fromCharCode("A".charCodeAt(0) + i - 10);
    charToNibble[lowerChar] = i;
    charToNibble[upperChar] = i;
    nibbleToChar.push(lowerChar);
}
function byteArrayToHexString(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; ++i) {
        if (bytes[i] < 0) {
            bytes[i] += 256;
        }
        str += nibbleToChar[bytes[i] >> 4] + nibbleToChar[bytes[i] & 0x0f];
    }
    return str;
}
exports.byteArrayToHexString = byteArrayToHexString;
function stringToByteArray(stringValue) {
    var str = unescape(encodeURIComponent(stringValue)); //temporary
    var bytes = new Array(str.length);
    for (var i = 0; i < str.length; ++i) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}
exports.stringToByteArray = stringToByteArray;
function hexStringToByteArray(str) {
    var bytes = [];
    var i = 0;
    if (0 !== str.length % 2) {
        bytes.push(charToNibble[str.charAt(0)]);
        ++i;
    }
    for (; i < str.length - 1; i += 2) {
        bytes.push((charToNibble[str.charAt(i)] << 4) + charToNibble[str.charAt(i + 1)]);
    }
    return bytes;
}
exports.hexStringToByteArray = hexStringToByteArray;
function stringToHexString(str) {
    return byteArrayToHexString(stringToByteArray(str));
}
exports.stringToHexString = stringToHexString;
function hexStringToString(hex) {
    return byteArrayToString(hexStringToByteArray(hex));
}
exports.hexStringToString = hexStringToString;
function checkBytesToIntInput(bytes, numBytes, opt_startIndex) {
    var startIndex = opt_startIndex || 0;
    if (startIndex < 0) {
        throw new Error("Start index should not be negative");
    }
    if (bytes.length < startIndex + numBytes) {
        throw new Error("Need at least " + numBytes + " bytes to convert to an integer");
    }
    return startIndex;
}
function byteArrayToSignedShort(bytes, opt_startIndex) {
    var index = checkBytesToIntInput(bytes, 2, opt_startIndex);
    var value = bytes[index];
    value += bytes[index + 1] << 8;
    return value;
}
exports.byteArrayToSignedShort = byteArrayToSignedShort;
function byteArrayToSignedInt32(bytes, opt_startIndex) {
    var index = checkBytesToIntInput(bytes, 4, opt_startIndex);
    var value = bytes[index];
    value += bytes[index + 1] << 8;
    value += bytes[index + 2] << 16;
    value += bytes[index + 3] << 24;
    return value;
}
exports.byteArrayToSignedInt32 = byteArrayToSignedInt32;
function byteArrayToBigInteger(bytes, opt_startIndex) {
    var value = new Big("0");
    var temp1, temp2;
    for (var i = 7; i >= 0; i--) {
        temp1 = value.times(new Big("256"));
        temp2 = temp1.plus(new Big(bytes[opt_startIndex || 0 + i].toString(10)));
        value = temp2;
    }
    return value;
}
exports.byteArrayToBigInteger = byteArrayToBigInteger;
// create a wordArray that is Big-Endian
function byteArrayToWordArray(byteArray) {
    var i = 0, offset = 0, word = 0, len = byteArray.length;
    var words = new Uint32Array(((len / 4) | 0) + (len % 4 == 0 ? 0 : 1));
    while (i < len - len % 4) {
        words[offset++] =
            (byteArray[i++] << 24) |
                (byteArray[i++] << 16) |
                (byteArray[i++] << 8) |
                byteArray[i++];
    }
    if (len % 4 != 0) {
        word = byteArray[i++] << 24;
        if (len % 4 > 1) {
            word = word | (byteArray[i++] << 16);
        }
        if (len % 4 > 2) {
            word = word | (byteArray[i++] << 8);
        }
        words[offset] = word;
    }
    return { sigBytes: len, words: words };
}
exports.byteArrayToWordArray = byteArrayToWordArray;
// assumes wordArray is Big-Endian
function wordArrayToByteArray(wordArray) {
    var len = wordArray.words.length;
    if (len == 0) {
        return new Array(0);
    }
    var byteArray = new Array(wordArray.sigBytes);
    var offset = 0, word, i;
    for (i = 0; i < len - 1; i++) {
        word = wordArray.words[i];
        byteArray[offset++] = word >> 24;
        byteArray[offset++] = (word >> 16) & 0xff;
        byteArray[offset++] = (word >> 8) & 0xff;
        byteArray[offset++] = word & 0xff;
    }
    word = wordArray.words[len - 1];
    byteArray[offset++] = word >> 24;
    if (wordArray.sigBytes % 4 == 0) {
        byteArray[offset++] = (word >> 16) & 0xff;
        byteArray[offset++] = (word >> 8) & 0xff;
        byteArray[offset++] = word & 0xff;
    }
    if (wordArray.sigBytes % 4 > 1) {
        byteArray[offset++] = (word >> 16) & 0xff;
    }
    if (wordArray.sigBytes % 4 > 2) {
        byteArray[offset++] = (word >> 8) & 0xff;
    }
    return byteArray;
}
exports.wordArrayToByteArray = wordArrayToByteArray;
// TODO @opt_startIndex and @length dont seem to be used, verify with rest of code and remove if unused
function byteArrayToString(bytes, opt_startIndex, length) {
    if (length == 0) {
        return "";
    }
    if (opt_startIndex && length) {
        bytes = bytes.slice(opt_startIndex, opt_startIndex + length);
    }
    return decodeURIComponent(escape(String.fromCharCode.apply(null, bytes)));
}
exports.byteArrayToString = byteArrayToString;
function byteArrayToShortArray(byteArray) {
    var shortArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var i;
    for (i = 0; i < 16; i++) {
        shortArray[i] = byteArray[i * 2] | (byteArray[i * 2 + 1] << 8);
    }
    return shortArray;
}
exports.byteArrayToShortArray = byteArrayToShortArray;
function shortArrayToByteArray(shortArray) {
    var byteArray = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    var i;
    for (i = 0; i < 16; i++) {
        byteArray[2 * i] = shortArray[i] & 0xff;
        byteArray[2 * i + 1] = shortArray[i] >> 8;
    }
    return byteArray;
}
exports.shortArrayToByteArray = shortArrayToByteArray;
// export function shortArrayToHexString(ary:Array<number>):string {
//   var res = "";
//   for (var i = 0; i < ary.length; i++) {
//     res += nibbleToChar[(ary[i] >> 4) & 0x0f] + nibbleToChar[ary[i] & 0x0f] + nibbleToChar[(ary[i] >> 12) & 0x0f] + nibbleToChar[(ary[i] >> 8) & 0x0f];
//   }
//   return res;
// }
// slightly optimized (without string concatenation - heat)
function shortArrayToHexString(ary) {
    var res = [];
    for (var i = 0; i < ary.length; i++) {
        res.push(nibbleToChar[(ary[i] >> 4) & 0x0f], nibbleToChar[ary[i] & 0x0f], nibbleToChar[(ary[i] >> 12) & 0x0f], nibbleToChar[(ary[i] >> 8) & 0x0f]);
    }
    return res.join("");
}
exports.shortArrayToHexString = shortArrayToHexString;
function int32ToBytes(x, opt_bigEndian) {
    return intToBytes_(x, 4, 4294967295, opt_bigEndian);
}
exports.int32ToBytes = int32ToBytes;
/**
 * Produces an array of the specified number of bytes to represent the integer
 * value. Default output encodes ints in little endian format. Handles signed
 * as well as unsigned integers. Due to limitations in JavaScript's number
 * format, x cannot be a true 64 bit integer (8 bytes).
 */
function intToBytes_(x, numBytes, unsignedMax, opt_bigEndian) {
    var signedMax = Math.floor(unsignedMax / 2);
    var negativeMax = (signedMax + 1) * -1;
    if (x != Math.floor(x) || x < negativeMax || x > unsignedMax) {
        throw new Error(x + " is not a " + numBytes * 8 + " bit integer");
    }
    var bytes = [];
    var current;
    // Number type 0 is in the positive int range, 1 is larger than signed int,
    // and 2 is negative int.
    var numberType = x >= 0 && x <= signedMax ? 0 : x > signedMax && x <= unsignedMax ? 1 : 2;
    if (numberType == 2) {
        x = x * -1 - 1;
    }
    for (var i = 0; i < numBytes; i++) {
        if (numberType == 2) {
            current = 255 - x % 256;
        }
        else {
            current = x % 256;
        }
        if (opt_bigEndian) {
            bytes.unshift(current);
        }
        else {
            bytes.push(current);
        }
        if (numberType == 1) {
            x = Math.floor(x / 256);
        }
        else {
            x = x >> 8;
        }
    }
    return bytes;
}
