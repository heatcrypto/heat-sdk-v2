"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARBITRARY_MESSAGE = exports.ORDINARY_PAYMENT = exports.AccountControlEffectiveBalanceLeasing = exports.ColoredCoinsWhitelistMarket = exports.ColoredCoinsWhitelistAccountRemoval = exports.ColoredCoinsWhitelistAccountAddition = exports.ColoredCoinsBidOrderCancellation = exports.ColoredCoinsAskOrderCancellation = exports.ColoredCoinsOrderCancellation = exports.ColoredCoinsBidOrderPlacement = exports.ColoredCoinsAskOrderPlacement = exports.ColoredCoinsOrderPlacement = exports.AtomicMultiTransfer = exports.AssetTransfer = exports.AssetIssueMore = exports.AssetBase = exports.AssetIssuance = exports.Message = exports.Payment = exports.EmptyAttachment = void 0;
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
const appendix_1 = require("./appendix");
const transaction_type_1 = require("./transaction-type");
const converters_1 = require("./converters");
const utils_1 = require("./utils");
const fee_1 = require("./fee");
const long_1 = __importDefault(require("long"));
class EmptyAttachment extends appendix_1.AbstractAppendix {
    constructor() {
        super();
        this.version = 0;
    }
    parse(buffer) {
        return this;
    }
    getSize() {
        return this.getMySize();
    }
    putMyBytes(buffer) { }
    putMyJSON(json) { }
    getMySize() {
        return 0;
    }
}
exports.EmptyAttachment = EmptyAttachment;
class Payment extends EmptyAttachment {
    getFee() {
        return fee_1.Fee.DEFAULT;
    }
    getAppendixName() {
        return "OrdinaryPayment";
    }
    getTransactionType() {
        return transaction_type_1.ORDINARY_PAYMENT_TRANSACTION_TYPE;
    }
}
exports.Payment = Payment;
class Message extends EmptyAttachment {
    getFee() {
        return fee_1.Fee.DEFAULT;
    }
    getAppendixName() {
        return "ArbitraryMessage";
    }
    getTransactionType() {
        return transaction_type_1.ARBITRARY_MESSAGE_TRANSACTION_TYPE;
    }
}
exports.Message = Message;
// ------------------- Asset ------------------------------------------------------------------------------------------
class AssetIssuance extends appendix_1.AbstractAppendix {
    init(descriptionUrl, descriptionHash, quantity, decimals, dillutable) {
        this.descriptionUrl = descriptionUrl;
        this.descriptionHash = descriptionHash == null ? new Array(32).fill(0) : descriptionHash;
        this.quantity = long_1.default.fromString(quantity);
        this.decimals = decimals;
        this.dillutable = dillutable;
        return this;
    }
    getMySize() {
        return 1 + converters_1.stringToByteArray(this.descriptionUrl).length + 32 + 8 + 1 + 1;
    }
    parse(buffer) {
        super.parse(buffer);
        this.descriptionUrl = converters_1.byteArrayToString(utils_1.readBytes(buffer, buffer.readByte())); //need to check Constants.MAX_ASSET_DESCRIPTION_URL_LENGTH ?
        this.descriptionHash = utils_1.readBytes(buffer, 32);
        this.quantity = buffer.readInt64();
        this.decimals = buffer.readByte();
        this.dillutable = buffer.readByte() == 1;
        return this;
    }
    putMyBytes(buffer) {
        let descriptionUrl = converters_1.stringToByteArray(this.descriptionUrl);
        buffer.writeByte(descriptionUrl.length);
        utils_1.writeBytes(buffer, descriptionUrl);
        if (this.descriptionHash && this.descriptionHash.length != 32)
            throw new Error("Description hash length must be 32");
        utils_1.writeBytes(buffer, this.descriptionHash);
        buffer.writeInt64(this.quantity);
        buffer.writeByte(this.decimals);
        buffer.writeByte(this.dillutable ? 1 : 0);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.descriptionUrl = json["descriptionUrl"];
        this.descriptionHash = converters_1.hexStringToByteArray(json["descriptionHash"]);
        this.quantity = long_1.default.fromString(json["quantity"]);
        this.decimals = json["decimals"];
        this.dillutable = json["dillutable"];
        return this;
    }
    putMyJSON(json) {
        json["descriptionUrl"] = this.descriptionUrl;
        json["descriptionHash"] = converters_1.byteArrayToHexString(Array.from(this.descriptionHash));
        json["quantity"] = this.quantity.toString();
        json["decimals"] = this.decimals;
        json["dillutable"] = this.dillutable;
    }
    getFee() {
        return fee_1.Fee.ASSET_ISSUANCE_FEE;
    }
    getAppendixName() {
        return "AssetIssuance";
    }
    getTransactionType() {
        return transaction_type_1.COLORED_COINS_ASSET_ISSUANCE_TRANSACTION_TYPE;
    }
    getDescriptionUrl() {
        return this.descriptionUrl;
    }
    getDescriptionHash() {
        return this.descriptionHash;
    }
    getQuantity() {
        return this.quantity;
    }
    getDecimals() {
        return this.decimals;
    }
    getDillutable() {
        return this.dillutable;
    }
}
exports.AssetIssuance = AssetIssuance;
class AssetBase extends appendix_1.AbstractAppendix {
    init(assetId, quantity) {
        this.assetId = long_1.default.fromString(assetId);
        this.quantity = long_1.default.fromString(quantity);
        return this;
    }
    getMySize() {
        return 8 + 8;
    }
    parse(buffer) {
        super.parse(buffer);
        this.assetId = buffer.readInt64();
        this.quantity = buffer.readInt64();
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.quantity);
    }
    putMyJSON(json) {
        json["asset"] = this.assetId.toUnsigned().toString();
        json["quantity"] = this.quantity.toString();
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.quantity = long_1.default.fromString(json["quantity"]);
        return this;
    }
    getAssetId() {
        return this.assetId;
    }
    getQuantity() {
        return this.quantity;
    }
}
exports.AssetBase = AssetBase;
class AssetIssueMore extends AssetBase {
    getFee() {
        return fee_1.Fee.ASSET_ISSUE_MORE_FEE;
    }
    getAppendixName() {
        return "AssetIssueMore";
    }
    getTransactionType() {
        return transaction_type_1.COLORED_COINS_ASSET_ISSUE_MORE_TRANSACTION_TYPE;
    }
}
exports.AssetIssueMore = AssetIssueMore;
class AssetTransfer extends AssetBase {
    getFee() {
        return fee_1.Fee.ASSET_TRANSFER_FEE;
    }
    getAppendixName() {
        return "AssetTransfer";
    }
    getTransactionType() {
        return transaction_type_1.COLORED_COINS_ASSET_TRANSFER_TRANSACTION_TYPE;
    }
}
exports.AssetTransfer = AssetTransfer;
class AtomicMultiTransfer extends appendix_1.AbstractAppendix {
    init(transfers) {
        this.transfers = transfers;
        return this;
    }
    get getTransfers() {
        return this.transfers;
    }
    getFee() {
        return fee_1.Fee.ATOMIC_MULTI_TRANSFER_FEE;
    }
    getAppendixName() {
        return "AtomicMultiTransfer";
    }
    getTransactionType() {
        return transaction_type_1.COLORED_COINS_ATOMIC_MULTI_TRANSFER_TRANSACTION_TYPE;
    }
    getMySize() {
        return 1 + this.transfers.length * (8 + 8 + 8);
    }
    putMyBytes(buffer) {
        buffer.writeByte(this.transfers.length);
        this.transfers.forEach(function (transfer) {
            buffer.writeInt64(long_1.default.fromString(transfer.recipient, true));
            buffer.writeInt64(long_1.default.fromString(transfer.assetId, true));
            buffer.writeInt64(long_1.default.fromString(transfer.quantity));
        });
    }
    parse(buffer) {
        super.parse(buffer);
        let count = buffer.readByte();
        this.transfers = [];
        for (let i = 0; i < count; i++) {
            let v = {
                recipient: buffer
                    .readInt64()
                    .toUnsigned()
                    .toString(),
                assetId: buffer
                    .readInt64()
                    .toUnsigned()
                    .toString(),
                quantity: buffer.readInt64().toString()
            };
            this.transfers.push(v);
        }
        return this;
    }
    putMyJSON(json) {
        let ts = [];
        this.transfers.forEach(function (transfer) {
            ts.push({
                recipient: transfer.recipient,
                assetId: transfer.assetId,
                quantity: transfer.quantity
            });
        });
        json["transfers"] = ts;
    }
    parseJSON(json) {
        this.transfers = [];
        let ts = json["transfers"];
        for (let i in ts) {
            this.transfers.push({
                recipient: ts[i].recipient,
                assetId: ts[i].assetId,
                quantity: ts[i].quantity
            });
        }
        return this;
    }
}
exports.AtomicMultiTransfer = AtomicMultiTransfer;
// ------------------- Colored coins. Orders ----------------------------------------------------------------------------
class ColoredCoinsOrderPlacement extends appendix_1.AbstractAppendix {
    init(currencyId, assetId, quantity, price, expiration) {
        this.currencyId = long_1.default.fromString(currencyId);
        this.assetId = long_1.default.fromString(assetId);
        this.quantity = long_1.default.fromString(quantity);
        this.price = long_1.default.fromString(price);
        this.expiration = expiration;
        return this;
    }
    getMySize() {
        return 8 + 8 + 8 + 8 + 4;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.currencyId);
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.quantity);
        buffer.writeInt64(this.price);
        buffer.writeInt32(this.expiration);
    }
    parse(buffer) {
        super.parse(buffer);
        this.currencyId = buffer.readInt64();
        this.assetId = buffer.readInt64();
        this.quantity = buffer.readInt64();
        this.price = buffer.readInt64();
        this.expiration = buffer.readInt32();
        return this;
    }
    putMyJSON(json) {
        json["currency"] = this.currencyId.toUnsigned().toString();
        json["asset"] = this.assetId.toUnsigned().toString();
        json["quantity"] = this.quantity.toString();
        json["price"] = this.price.toString();
        json["expiration"] = this.expiration.toString();
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.currencyId = long_1.default.fromString(json["currency"], true);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.quantity = long_1.default.fromString(json["quantity"]);
        this.price = long_1.default.fromString(json["price"]);
        this.expiration = json["expiration"];
        return this;
    }
    getFee() {
        return fee_1.Fee.ORDER_PLACEMENT_FEE;
    }
    getCurrencyId() {
        return this.currencyId;
    }
    getAssetId() {
        return this.assetId;
    }
    getQuantity() {
        return this.quantity;
    }
    getPrice() {
        return this.price;
    }
    getExpiration() {
        return this.expiration;
    }
}
exports.ColoredCoinsOrderPlacement = ColoredCoinsOrderPlacement;
class ColoredCoinsAskOrderPlacement extends ColoredCoinsOrderPlacement {
    getAppendixName() {
        return "AskOrderPlacement";
    }
    getTransactionType() {
        return transaction_type_1.COLORED_COINS_ASK_ORDER_PLACEMENT_TRANSACTION_TYPE;
    }
}
exports.ColoredCoinsAskOrderPlacement = ColoredCoinsAskOrderPlacement;
class ColoredCoinsBidOrderPlacement extends ColoredCoinsOrderPlacement {
    getAppendixName() {
        return "BidOrderPlacement";
    }
    getTransactionType() {
        return transaction_type_1.COLORED_COINS_BID_ORDER_PLACEMENT_TRANSACTION_TYPE;
    }
}
exports.ColoredCoinsBidOrderPlacement = ColoredCoinsBidOrderPlacement;
class ColoredCoinsOrderCancellation extends appendix_1.AbstractAppendix {
    init(orderId) {
        this.orderId = long_1.default.fromString(orderId);
        return this;
    }
    getMySize() {
        return 8;
    }
    parse(buffer) {
        super.parse(buffer);
        this.orderId = buffer.readInt64();
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.orderId);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.orderId = long_1.default.fromString(json["order"], true);
        return this;
    }
    putMyJSON(json) {
        json["order"] = this.orderId.toUnsigned().toString();
    }
    getFee() {
        return fee_1.Fee.ORDER_CANCELLATION_FEE;
    }
    getOrderId() {
        return this.orderId;
    }
}
exports.ColoredCoinsOrderCancellation = ColoredCoinsOrderCancellation;
class ColoredCoinsAskOrderCancellation extends ColoredCoinsOrderCancellation {
    getAppendixName() {
        return "AskOrderCancellation";
    }
    getTransactionType() {
        return transaction_type_1.ASK_ORDER_CANCELLATION_TRANSACTION_TYPE;
    }
}
exports.ColoredCoinsAskOrderCancellation = ColoredCoinsAskOrderCancellation;
class ColoredCoinsBidOrderCancellation extends ColoredCoinsOrderCancellation {
    getAppendixName() {
        return "BidOrderCancellation";
    }
    getTransactionType() {
        return transaction_type_1.BID_ORDER_CANCELLATION_TRANSACTION_TYPE;
    }
}
exports.ColoredCoinsBidOrderCancellation = ColoredCoinsBidOrderCancellation;
// ------------------- Colored coins. Whitelist ------------------------------------------------------------------------
class ColoredCoinsWhitelistAccountAddition extends appendix_1.AbstractAppendix {
    init(assetId, accountId, endHeight) {
        this.assetId = long_1.default.fromString(assetId);
        this.accountId = long_1.default.fromString(accountId);
        this.endHeight = endHeight;
        return this;
    }
    getMySize() {
        return 8 + 8 + 4;
    }
    parse(buffer) {
        super.parse(buffer);
        this.assetId = buffer.readInt64();
        this.accountId = buffer.readInt64();
        this.endHeight = buffer.readInt32();
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.accountId);
        buffer.writeInt32(this.endHeight);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.accountId = long_1.default.fromString(json["account"], true);
        this.endHeight = json["endHeight"];
        return this;
    }
    putMyJSON(json) {
        json["asset"] = this.assetId.toUnsigned().toString();
        json["account"] = this.accountId.toUnsigned().toString();
        json["endHeight"] = this.endHeight;
    }
    getAppendixName() {
        return "WhitelistAccountAddition";
    }
    getTransactionType() {
        return transaction_type_1.WHITELIST_ACCOUNT_ADDITION_TRANSACTION_TYPE;
    }
    getFee() {
        return fee_1.Fee.WHITELIST_ACCOUNT_FEE;
    }
    getAssetId() {
        return this.assetId;
    }
    getAccountId() {
        return this.accountId;
    }
    getEndHeight() {
        return this.endHeight;
    }
}
exports.ColoredCoinsWhitelistAccountAddition = ColoredCoinsWhitelistAccountAddition;
class ColoredCoinsWhitelistAccountRemoval extends appendix_1.AbstractAppendix {
    init(assetId, accountId) {
        this.assetId = long_1.default.fromString(assetId);
        this.accountId = long_1.default.fromString(accountId);
        return this;
    }
    getMySize() {
        return 8 + 8;
    }
    parse(buffer) {
        super.parse(buffer);
        this.assetId = buffer.readInt64();
        this.accountId = buffer.readInt64();
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.accountId);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.accountId = long_1.default.fromString(json["account"], true);
        return this;
    }
    putMyJSON(json) {
        json["asset"] = this.assetId.toUnsigned().toString();
        json["account"] = this.accountId.toUnsigned().toString();
    }
    getAppendixName() {
        return "WhitelistAccountRemoval";
    }
    getTransactionType() {
        return transaction_type_1.WHITELIST_ACCOUNT_REMOVAL_TRANSACTION_TYPE;
    }
    getFee() {
        return fee_1.Fee.WHITELIST_ACCOUNT_FEE;
    }
    getAssetId() {
        return this.assetId;
    }
    getAccountId() {
        return this.accountId;
    }
}
exports.ColoredCoinsWhitelistAccountRemoval = ColoredCoinsWhitelistAccountRemoval;
class ColoredCoinsWhitelistMarket extends appendix_1.AbstractAppendix {
    init(currencyId, assetId) {
        this.currencyId = long_1.default.fromString(currencyId);
        this.assetId = long_1.default.fromString(assetId);
        return this;
    }
    getMySize() {
        return 8 + 8;
    }
    parse(buffer) {
        super.parse(buffer);
        this.currencyId = buffer.readInt64();
        this.assetId = buffer.readInt64();
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.currencyId);
        buffer.writeInt64(this.assetId);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.currencyId = long_1.default.fromString(json["currency"], true);
        this.assetId = long_1.default.fromString(json["asset"], true);
        return this;
    }
    putMyJSON(json) {
        json["currency"] = this.currencyId.toUnsigned().toString();
        json["asset"] = this.assetId.toUnsigned().toString();
    }
    getAppendixName() {
        return "WhitelistMarket";
    }
    getTransactionType() {
        return transaction_type_1.WHITELIST_MARKET_TRANSACTION_TYPE;
    }
    getFee() {
        return fee_1.Fee.WHITELIST_MARKET_FEE;
    }
    getAssetId() {
        return this.assetId;
    }
    getCurrencyId() {
        return this.currencyId;
    }
}
exports.ColoredCoinsWhitelistMarket = ColoredCoinsWhitelistMarket;
// ------------------- AccountControlEffectiveBalanceLeasing -----------------------------------------------------------
class AccountControlEffectiveBalanceLeasing extends appendix_1.AbstractAppendix {
    init(period) {
        this.period = period;
        return this;
    }
    getMySize() {
        return 4;
    }
    parse(buffer) {
        super.parse(buffer);
        this.period = buffer.readInt32();
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt32(this.period);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.period = json["period"];
        return this;
    }
    putMyJSON(json) {
        json["period"] = this.period;
    }
    getAppendixName() {
        return "EffectiveBalanceLeasing";
    }
    getTransactionType() {
        return transaction_type_1.EFFECTIVE_BALANCE_LEASING_TRANSACTION_TYPE;
    }
    getFee() {
        return fee_1.Fee.EFFECTIVE_BALANCE_LEASING_FEE;
    }
    getPeriod() {
        return this.period;
    }
}
exports.AccountControlEffectiveBalanceLeasing = AccountControlEffectiveBalanceLeasing;
exports.ORDINARY_PAYMENT = new Payment();
exports.ARBITRARY_MESSAGE = new Message();
