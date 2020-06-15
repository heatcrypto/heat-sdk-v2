"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBytes = exports.readBytes = exports.isEmpty = exports.extend = exports.isArray = exports.isObject = exports.isDefined = exports.isString = exports.emptyToNull = exports.repeatWhile = exports.getByteLen = exports.convertToQNT = exports.calculateTotalOrderPriceQNT = exports.convertToQNTf = exports.trimDecimals = exports.formatQNT = exports.roundTo = exports.epochTime = exports.timestampToDate = exports.hasToManyDecimals = exports.isNumber = exports.commaFormat = exports.unformat = exports.isPublicKey = void 0;
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
var big_js_1 = __importDefault(require("big.js"));
var converters_1 = require("./converters");
function isPublicKey(publicKeyHex) {
    // if (parseInt(publicKeyHex, 16).toString(16) === publicKeyHex.toLowerCase()) {
    //   return converters.hexStringToByteArray(publicKeyHex).length == 32
    // }
    // return false
    var regExp = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/;
    if (regExp.test(publicKeyHex))
        return converters_1.hexStringToByteArray(publicKeyHex).length == 32;
    return false;
}
exports.isPublicKey = isPublicKey;
function unformat(commaFormatted) {
    return commaFormatted ? commaFormatted.replace(/,/g, "") : "0";
}
exports.unformat = unformat;
function commaFormat(amount) {
    if (typeof amount == "undefined") {
        return "0";
    }
    var neg = amount.indexOf("-") == 0;
    if (neg) {
        amount = amount.substr(1);
    }
    var dec = amount.split("."); // input is result of convertNQT
    var parts = dec[0]
        .split("")
        .reverse()
        .join("")
        .split(/(\d{3})/)
        .reverse();
    var format = [];
    for (var i = 0; i < parts.length; i++) {
        if (parts[i]) {
            format.push(parts[i]
                .split("")
                .reverse()
                .join(""));
        }
    }
    return (neg ? "-" : "") + format.join(",") + (dec.length == 2 ? "." + dec[1] : "");
}
exports.commaFormat = commaFormat;
function isNumber(value) {
    var num = String(value).replace(/,/g, "");
    if (num.match(/^\d+$/)) {
        return true;
    }
    else if (num.match(/^\d+\.\d+$/)) {
        return true;
    }
    return false;
}
exports.isNumber = isNumber;
/**
 * Very forgiving test to determine if the number of fractional parts
 * exceeds @decimals param.
 *
 * @param value String number value, can contain commas
 * @param decimals Number max allowed number of decimals.
 * @return boolean
 */
function hasToManyDecimals(value, decimals) {
    var num = String(value).replace(/,/g, "");
    var parts = num.split(".");
    if (parts[1]) {
        var fractional = parts[1].replace(/[\s0]*$/g, "");
        if (fractional.length > decimals)
            return true;
    }
    return false;
}
exports.hasToManyDecimals = hasToManyDecimals;
function timestampToDate(timestamp) {
    return new Date(Date.UTC(2013, 10, 24, 12, 0, 0, 0) + timestamp * 1000);
}
exports.timestampToDate = timestampToDate;
function epochTime() {
    return Math.round((Date.now() - 1385294400000 + 500) / 1000);
}
exports.epochTime = epochTime;
function roundTo(value, decimals) {
    return String(parseFloat(value).toFixed(decimals));
}
exports.roundTo = roundTo;
function formatQNT(quantity, decimals, returnNullZero) {
    var asfloat = convertToQNTf(quantity);
    var cf = commaFormat(asfloat);
    var parts = cf.split(".");
    var ret;
    if (!parts[1])
        ret = parts[0] + "." + "0".repeat(decimals);
    else if (parts[1].length > decimals) {
        var i = parts[1].length - 1;
        while (parts[1].length > decimals) {
            if (parts[1][i] == "0") {
                parts[1] = parts[i].slice(0, -1);
                i--;
                continue;
            }
            break;
        }
        ret = parts[0] + "." + parts[1];
    }
    else
        ret = parts[0] + "." + parts[1] + "0".repeat(decimals - parts[1].length);
    return returnNullZero && !ret.match(/[^0\.]/) ? null : ret;
}
exports.formatQNT = formatQNT;
function trimDecimals(formatted, decimals) {
    var parts = formatted.split(".");
    if (!parts[1])
        parts[1] = "0".repeat(decimals);
    else
        parts[1] = parts[1].substr(0, decimals);
    if (parts[1].length < decimals)
        parts[1] += "0".repeat(decimals - parts[1].length);
    return parts[0] + "." + parts[1];
}
exports.trimDecimals = trimDecimals;
function convertToQNTf(quantity) {
    var decimals = 8;
    if (typeof quantity == "undefined") {
        return "0";
    }
    if (quantity.length < decimals) {
        for (var i = quantity.length; i < decimals; i++) {
            quantity = "0" + quantity;
        }
    }
    var afterComma = "";
    if (decimals) {
        afterComma = "." + quantity.substring(quantity.length - decimals);
        quantity = quantity.substring(0, quantity.length - decimals);
        if (!quantity) {
            quantity = "0";
        }
        afterComma = afterComma.replace(/0+$/, "");
        if (afterComma == ".") {
            afterComma = "";
        }
    }
    return quantity + afterComma;
}
exports.convertToQNTf = convertToQNTf;
function calculateTotalOrderPriceQNT(quantityQNT, priceQNT) {
    return new big_js_1.default(quantityQNT)
        .times(new big_js_1.default(priceQNT).div(new big_js_1.default(100000000)))
        .round()
        .toString();
}
exports.calculateTotalOrderPriceQNT = calculateTotalOrderPriceQNT;
var ConvertToQNTError = /** @class */ (function () {
    function ConvertToQNTError(message, code) {
        this.message = message;
        this.code = code;
        this.name = "ConvertToQNTError";
    }
    return ConvertToQNTError;
}());
/**
 * Converts a float to a QNT based on the number of decimals to use.
 * Note! That this method throws a ConvertToQNTError in case the
 * input is invalid. Callers must catch and handle this situation.
 *
 * @throws utils.ConvertToQNTError
 */
function convertToQNT(quantity /*, decimals: number = 8 */) {
    var decimals = 8; // qnts all have 8 decimals.
    var parts = quantity.split(".");
    var qnt = parts[0];
    if (parts.length == 1) {
        if (decimals) {
            for (var i = 0; i < decimals; i++) {
                qnt += "0";
            }
        }
    }
    else if (parts.length == 2) {
        var fraction = parts[1];
        if (fraction.length > decimals) {
            throw new ConvertToQNTError("Fraction can only have " + decimals + " decimals max.", 1);
        }
        else if (fraction.length < decimals) {
            for (var i = fraction.length; i < decimals; i++) {
                fraction += "0";
            }
        }
        qnt += fraction;
    }
    else {
        throw new ConvertToQNTError("Incorrect input", 2);
    }
    //in case there's a comma or something else in there.. at this point there should only be numbers
    if (!/^\d+$/.test(qnt)) {
        throw new ConvertToQNTError("Invalid input. Only numbers and a dot are accepted.", 3);
    }
    //remove leading zeroes
    return qnt.replace(/^0+/, "");
}
exports.convertToQNT = convertToQNT;
/**
 * Count bytes in a string's UTF-8 representation.
 * @param   string
 * @return  number
 */
function getByteLen(value) {
    var byteLen = 0;
    for (var i = 0; i < value.length; i++) {
        var c = value.charCodeAt(i);
        byteLen +=
            c < 1 << 7
                ? 1
                : c < 1 << 11
                    ? 2
                    : c < 1 << 16 ? 3 : c < 1 << 21 ? 4 : c < 1 << 26 ? 5 : c < 1 << 31 ? 6 : Number.NaN;
    }
    return byteLen;
}
exports.getByteLen = getByteLen;
function repeatWhile(delay, cb) {
    var fn = function () {
        if (cb()) {
            clearInterval(interval);
        }
    };
    var interval = setInterval(fn, delay);
}
exports.repeatWhile = repeatWhile;
function emptyToNull(input) {
    return isString(input) && input.trim().length == 0 ? null : input;
}
exports.emptyToNull = emptyToNull;
function isString(input) {
    return !!(input && typeof input == "string");
}
exports.isString = isString;
function isDefined(input) {
    return typeof input != "undefined";
}
exports.isDefined = isDefined;
function isObject(input) {
    return !!(input && typeof input == "object");
}
exports.isObject = isObject;
function isArray(input) {
    return Array.isArray(input);
}
exports.isArray = isArray;
function extend(destination, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key))
            destination[key] = source[key];
    }
    return destination;
}
exports.extend = extend;
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
exports.isEmpty = isEmpty;
function readBytes(buffer, length, offset) {
    if (offset)
        buffer.offset = offset;
    var array = [];
    for (var i = 0; i < length; i++)
        array.push(buffer.readByte());
    return array;
}
exports.readBytes = readBytes;
function writeBytes(buffer, bytes) {
    for (var i = 0; i < bytes.length; i++)
        buffer.writeByte(bytes[i]);
}
exports.writeBytes = writeBytes;
