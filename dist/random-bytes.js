"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytesSync = exports.randomBytes = void 0;
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
var crypto_1 = require("crypto");
function randomBytes(length) {
    return new Promise(function (resolve, reject) {
        // Buffers are Uint8Arrays, so you just need to access its ArrayBuffer. This is O(1):
        crypto_1.randomBytes(length, function (err, buffer) {
            if (err)
                reject(err);
            else
                resolve(Uint8Array.from(buffer));
        });
    });
}
exports.randomBytes = randomBytes;
function randomBytesSync(length) {
    return crypto_1.randomBytes(length);
}
exports.randomBytesSync = randomBytesSync;
