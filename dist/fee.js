"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = void 0;
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
var constants_1 = require("./constants");
var Fee = /** @class */ (function () {
    function Fee() {
    }
    Fee.DEFAULT = (constants_1.HeatConstants.ONE_HEAT / 100).toString();
    Fee.ASSET_ISSUANCE_FEE = (constants_1.HeatConstants.ONE_HEAT * 500).toString();
    Fee.ASSET_ISSUE_MORE_FEE = Fee.DEFAULT;
    Fee.ASSET_TRANSFER_FEE = Fee.DEFAULT;
    Fee.ATOMIC_MULTI_TRANSFER_FEE = Fee.DEFAULT;
    Fee.ORDER_PLACEMENT_FEE = Fee.DEFAULT;
    Fee.ORDER_CANCELLATION_FEE = Fee.DEFAULT;
    Fee.WHITELIST_ACCOUNT_FEE = Fee.DEFAULT;
    Fee.WHITELIST_MARKET_FEE = (constants_1.HeatConstants.ONE_HEAT * 10).toString();
    Fee.EFFECTIVE_BALANCE_LEASING_FEE = Fee.DEFAULT;
    Fee.MESSAGE_APPENDIX_FEE = "0";
    Fee.ENCRYPTED_MESSAGE_APPENDIX_FEE = "0";
    Fee.PUBLICKEY_ANNOUNCEMENT_APPENDIX_FEE = "0";
    Fee.PRIVATE_NAME_ANNOUNCEMENT_APPENDIX_FEE = "0";
    Fee.PRIVATE_NAME_ASSIGNEMENT_APPENDIX_FEE = "0";
    Fee.PUBLIC_NAME_ANNOUNCEMENT_APPENDIX_FEE = "0";
    Fee.PUBLIC_NAME_ASSIGNEMENT_APPENDIX_FEE = "0";
    return Fee;
}());
exports.Fee = Fee;
