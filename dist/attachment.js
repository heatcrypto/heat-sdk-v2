"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var appendix_1 = require("./appendix");
var transaction_type_1 = require("./transaction-type");
var converters_1 = require("./converters");
var utils_1 = require("./utils");
var fee_1 = require("./fee");
var long_1 = __importDefault(require("long"));
var EmptyAttachment = /** @class */ (function (_super) {
    __extends(EmptyAttachment, _super);
    function EmptyAttachment() {
        var _this = _super.call(this) || this;
        _this.version = 0;
        return _this;
    }
    EmptyAttachment.prototype.parse = function (buffer) {
        return this;
    };
    EmptyAttachment.prototype.getSize = function () {
        return this.getMySize();
    };
    EmptyAttachment.prototype.putMyBytes = function (buffer) { };
    EmptyAttachment.prototype.putMyJSON = function (json) { };
    EmptyAttachment.prototype.getMySize = function () {
        return 0;
    };
    return EmptyAttachment;
}(appendix_1.AbstractAppendix));
exports.EmptyAttachment = EmptyAttachment;
var Payment = /** @class */ (function (_super) {
    __extends(Payment, _super);
    function Payment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Payment.prototype.getFee = function () {
        return fee_1.Fee.DEFAULT;
    };
    Payment.prototype.getAppendixName = function () {
        return "OrdinaryPayment";
    };
    Payment.prototype.getTransactionType = function () {
        return transaction_type_1.ORDINARY_PAYMENT_TRANSACTION_TYPE;
    };
    return Payment;
}(EmptyAttachment));
exports.Payment = Payment;
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Message.prototype.getFee = function () {
        return fee_1.Fee.DEFAULT;
    };
    Message.prototype.getAppendixName = function () {
        return "ArbitraryMessage";
    };
    Message.prototype.getTransactionType = function () {
        return transaction_type_1.ARBITRARY_MESSAGE_TRANSACTION_TYPE;
    };
    return Message;
}(EmptyAttachment));
exports.Message = Message;
// ------------------- Asset ------------------------------------------------------------------------------------------
var AssetIssuance = /** @class */ (function (_super) {
    __extends(AssetIssuance, _super);
    function AssetIssuance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetIssuance.prototype.init = function (descriptionUrl, descriptionHash, quantity, decimals, dillutable) {
        this.descriptionUrl = descriptionUrl;
        this.descriptionHash = descriptionHash == null ? new Array(32).fill(0) : descriptionHash;
        this.quantity = long_1.default.fromString(quantity);
        this.decimals = decimals;
        this.dillutable = dillutable;
        return this;
    };
    AssetIssuance.prototype.getMySize = function () {
        return 1 + converters_1.stringToByteArray(this.descriptionUrl).length + 32 + 8 + 1 + 1;
    };
    AssetIssuance.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.descriptionUrl = converters_1.byteArrayToString(utils_1.readBytes(buffer, buffer.readByte())); //need to check Constants.MAX_ASSET_DESCRIPTION_URL_LENGTH ?
        this.descriptionHash = utils_1.readBytes(buffer, 32);
        this.quantity = buffer.readInt64();
        this.decimals = buffer.readByte();
        this.dillutable = buffer.readByte() == 1;
        return this;
    };
    AssetIssuance.prototype.putMyBytes = function (buffer) {
        var descriptionUrl = converters_1.stringToByteArray(this.descriptionUrl);
        buffer.writeByte(descriptionUrl.length);
        utils_1.writeBytes(buffer, descriptionUrl);
        if (this.descriptionHash && this.descriptionHash.length != 32)
            throw new Error("Description hash length must be 32");
        utils_1.writeBytes(buffer, this.descriptionHash);
        buffer.writeInt64(this.quantity);
        buffer.writeByte(this.decimals);
        buffer.writeByte(this.dillutable ? 1 : 0);
    };
    AssetIssuance.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.descriptionUrl = json["descriptionUrl"];
        this.descriptionHash = converters_1.hexStringToByteArray(json["descriptionHash"]);
        this.quantity = long_1.default.fromString(json["quantity"]);
        this.decimals = json["decimals"];
        this.dillutable = json["dillutable"];
        return this;
    };
    AssetIssuance.prototype.putMyJSON = function (json) {
        json["descriptionUrl"] = this.descriptionUrl;
        json["descriptionHash"] = converters_1.byteArrayToHexString(Array.from(this.descriptionHash));
        json["quantity"] = this.quantity.toString();
        json["decimals"] = this.decimals;
        json["dillutable"] = this.dillutable;
    };
    AssetIssuance.prototype.getFee = function () {
        return fee_1.Fee.ASSET_ISSUANCE_FEE;
    };
    AssetIssuance.prototype.getAppendixName = function () {
        return "AssetIssuance";
    };
    AssetIssuance.prototype.getTransactionType = function () {
        return transaction_type_1.COLORED_COINS_ASSET_ISSUANCE_TRANSACTION_TYPE;
    };
    AssetIssuance.prototype.getDescriptionUrl = function () {
        return this.descriptionUrl;
    };
    AssetIssuance.prototype.getDescriptionHash = function () {
        return this.descriptionHash;
    };
    AssetIssuance.prototype.getQuantity = function () {
        return this.quantity;
    };
    AssetIssuance.prototype.getDecimals = function () {
        return this.decimals;
    };
    AssetIssuance.prototype.getDillutable = function () {
        return this.dillutable;
    };
    return AssetIssuance;
}(appendix_1.AbstractAppendix));
exports.AssetIssuance = AssetIssuance;
var AssetBase = /** @class */ (function (_super) {
    __extends(AssetBase, _super);
    function AssetBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetBase.prototype.init = function (assetId, quantity) {
        this.assetId = long_1.default.fromString(assetId);
        this.quantity = long_1.default.fromString(quantity);
        return this;
    };
    AssetBase.prototype.getMySize = function () {
        return 8 + 8;
    };
    AssetBase.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.assetId = buffer.readInt64();
        this.quantity = buffer.readInt64();
        return this;
    };
    AssetBase.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.quantity);
    };
    AssetBase.prototype.putMyJSON = function (json) {
        json["asset"] = this.assetId.toUnsigned().toString();
        json["quantity"] = this.quantity.toString();
    };
    AssetBase.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.quantity = long_1.default.fromString(json["quantity"]);
        return this;
    };
    AssetBase.prototype.getAssetId = function () {
        return this.assetId;
    };
    AssetBase.prototype.getQuantity = function () {
        return this.quantity;
    };
    return AssetBase;
}(appendix_1.AbstractAppendix));
exports.AssetBase = AssetBase;
var AssetIssueMore = /** @class */ (function (_super) {
    __extends(AssetIssueMore, _super);
    function AssetIssueMore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetIssueMore.prototype.getFee = function () {
        return fee_1.Fee.ASSET_ISSUE_MORE_FEE;
    };
    AssetIssueMore.prototype.getAppendixName = function () {
        return "AssetIssueMore";
    };
    AssetIssueMore.prototype.getTransactionType = function () {
        return transaction_type_1.COLORED_COINS_ASSET_ISSUE_MORE_TRANSACTION_TYPE;
    };
    return AssetIssueMore;
}(AssetBase));
exports.AssetIssueMore = AssetIssueMore;
var AssetTransfer = /** @class */ (function (_super) {
    __extends(AssetTransfer, _super);
    function AssetTransfer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetTransfer.prototype.getFee = function () {
        return fee_1.Fee.ASSET_TRANSFER_FEE;
    };
    AssetTransfer.prototype.getAppendixName = function () {
        return "AssetTransfer";
    };
    AssetTransfer.prototype.getTransactionType = function () {
        return transaction_type_1.COLORED_COINS_ASSET_TRANSFER_TRANSACTION_TYPE;
    };
    return AssetTransfer;
}(AssetBase));
exports.AssetTransfer = AssetTransfer;
var AtomicMultiTransfer = /** @class */ (function (_super) {
    __extends(AtomicMultiTransfer, _super);
    function AtomicMultiTransfer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AtomicMultiTransfer.prototype.init = function (transfers) {
        this.transfers = transfers;
        return this;
    };
    Object.defineProperty(AtomicMultiTransfer.prototype, "getTransfers", {
        get: function () {
            return this.transfers;
        },
        enumerable: false,
        configurable: true
    });
    AtomicMultiTransfer.prototype.getFee = function () {
        return fee_1.Fee.ATOMIC_MULTI_TRANSFER_FEE;
    };
    AtomicMultiTransfer.prototype.getAppendixName = function () {
        return "AtomicMultiTransfer";
    };
    AtomicMultiTransfer.prototype.getTransactionType = function () {
        return transaction_type_1.COLORED_COINS_ATOMIC_MULTI_TRANSFER_TRANSACTION_TYPE;
    };
    AtomicMultiTransfer.prototype.getMySize = function () {
        return 1 + this.transfers.length * (8 + 8 + 8);
    };
    AtomicMultiTransfer.prototype.putMyBytes = function (buffer) {
        buffer.writeByte(this.transfers.length);
        this.transfers.forEach(function (transfer) {
            buffer.writeInt64(long_1.default.fromString(transfer.recipient, true));
            buffer.writeInt64(long_1.default.fromString(transfer.assetId, true));
            buffer.writeInt64(long_1.default.fromString(transfer.quantity));
        });
    };
    AtomicMultiTransfer.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        var count = buffer.readByte();
        this.transfers = [];
        for (var i = 0; i < count; i++) {
            var v = {
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
    };
    AtomicMultiTransfer.prototype.putMyJSON = function (json) {
        var ts = [];
        this.transfers.forEach(function (transfer) {
            ts.push({
                recipient: transfer.recipient,
                assetId: transfer.assetId,
                quantity: transfer.quantity
            });
        });
        json["transfers"] = ts;
    };
    AtomicMultiTransfer.prototype.parseJSON = function (json) {
        this.transfers = [];
        var ts = json["transfers"];
        for (var i in ts) {
            this.transfers.push({
                recipient: ts[i].recipient,
                assetId: ts[i].assetId,
                quantity: ts[i].quantity
            });
        }
        return this;
    };
    return AtomicMultiTransfer;
}(appendix_1.AbstractAppendix));
exports.AtomicMultiTransfer = AtomicMultiTransfer;
// ------------------- Colored coins. Orders ----------------------------------------------------------------------------
var ColoredCoinsOrderPlacement = /** @class */ (function (_super) {
    __extends(ColoredCoinsOrderPlacement, _super);
    function ColoredCoinsOrderPlacement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsOrderPlacement.prototype.init = function (currencyId, assetId, quantity, price, expiration) {
        this.currencyId = long_1.default.fromString(currencyId);
        this.assetId = long_1.default.fromString(assetId);
        this.quantity = long_1.default.fromString(quantity);
        this.price = long_1.default.fromString(price);
        this.expiration = expiration;
        return this;
    };
    ColoredCoinsOrderPlacement.prototype.getMySize = function () {
        return 8 + 8 + 8 + 8 + 4;
    };
    ColoredCoinsOrderPlacement.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.currencyId);
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.quantity);
        buffer.writeInt64(this.price);
        buffer.writeInt32(this.expiration);
    };
    ColoredCoinsOrderPlacement.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.currencyId = buffer.readInt64();
        this.assetId = buffer.readInt64();
        this.quantity = buffer.readInt64();
        this.price = buffer.readInt64();
        this.expiration = buffer.readInt32();
        return this;
    };
    ColoredCoinsOrderPlacement.prototype.putMyJSON = function (json) {
        json["currency"] = this.currencyId.toUnsigned().toString();
        json["asset"] = this.assetId.toUnsigned().toString();
        json["quantity"] = this.quantity.toString();
        json["price"] = this.price.toString();
        json["expiration"] = this.expiration.toString();
    };
    ColoredCoinsOrderPlacement.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.currencyId = long_1.default.fromString(json["currency"], true);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.quantity = long_1.default.fromString(json["quantity"]);
        this.price = long_1.default.fromString(json["price"]);
        this.expiration = json["expiration"];
        return this;
    };
    ColoredCoinsOrderPlacement.prototype.getFee = function () {
        return fee_1.Fee.ORDER_PLACEMENT_FEE;
    };
    ColoredCoinsOrderPlacement.prototype.getCurrencyId = function () {
        return this.currencyId;
    };
    ColoredCoinsOrderPlacement.prototype.getAssetId = function () {
        return this.assetId;
    };
    ColoredCoinsOrderPlacement.prototype.getQuantity = function () {
        return this.quantity;
    };
    ColoredCoinsOrderPlacement.prototype.getPrice = function () {
        return this.price;
    };
    ColoredCoinsOrderPlacement.prototype.getExpiration = function () {
        return this.expiration;
    };
    return ColoredCoinsOrderPlacement;
}(appendix_1.AbstractAppendix));
exports.ColoredCoinsOrderPlacement = ColoredCoinsOrderPlacement;
var ColoredCoinsAskOrderPlacement = /** @class */ (function (_super) {
    __extends(ColoredCoinsAskOrderPlacement, _super);
    function ColoredCoinsAskOrderPlacement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsAskOrderPlacement.prototype.getAppendixName = function () {
        return "AskOrderPlacement";
    };
    ColoredCoinsAskOrderPlacement.prototype.getTransactionType = function () {
        return transaction_type_1.COLORED_COINS_ASK_ORDER_PLACEMENT_TRANSACTION_TYPE;
    };
    return ColoredCoinsAskOrderPlacement;
}(ColoredCoinsOrderPlacement));
exports.ColoredCoinsAskOrderPlacement = ColoredCoinsAskOrderPlacement;
var ColoredCoinsBidOrderPlacement = /** @class */ (function (_super) {
    __extends(ColoredCoinsBidOrderPlacement, _super);
    function ColoredCoinsBidOrderPlacement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsBidOrderPlacement.prototype.getAppendixName = function () {
        return "BidOrderPlacement";
    };
    ColoredCoinsBidOrderPlacement.prototype.getTransactionType = function () {
        return transaction_type_1.COLORED_COINS_BID_ORDER_PLACEMENT_TRANSACTION_TYPE;
    };
    return ColoredCoinsBidOrderPlacement;
}(ColoredCoinsOrderPlacement));
exports.ColoredCoinsBidOrderPlacement = ColoredCoinsBidOrderPlacement;
var ColoredCoinsOrderCancellation = /** @class */ (function (_super) {
    __extends(ColoredCoinsOrderCancellation, _super);
    function ColoredCoinsOrderCancellation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsOrderCancellation.prototype.init = function (orderId) {
        this.orderId = long_1.default.fromString(orderId);
        return this;
    };
    ColoredCoinsOrderCancellation.prototype.getMySize = function () {
        return 8;
    };
    ColoredCoinsOrderCancellation.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.orderId = buffer.readInt64();
        return this;
    };
    ColoredCoinsOrderCancellation.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.orderId);
    };
    ColoredCoinsOrderCancellation.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.orderId = long_1.default.fromString(json["order"], true);
        return this;
    };
    ColoredCoinsOrderCancellation.prototype.putMyJSON = function (json) {
        json["order"] = this.orderId.toUnsigned().toString();
    };
    ColoredCoinsOrderCancellation.prototype.getFee = function () {
        return fee_1.Fee.ORDER_CANCELLATION_FEE;
    };
    ColoredCoinsOrderCancellation.prototype.getOrderId = function () {
        return this.orderId;
    };
    return ColoredCoinsOrderCancellation;
}(appendix_1.AbstractAppendix));
exports.ColoredCoinsOrderCancellation = ColoredCoinsOrderCancellation;
var ColoredCoinsAskOrderCancellation = /** @class */ (function (_super) {
    __extends(ColoredCoinsAskOrderCancellation, _super);
    function ColoredCoinsAskOrderCancellation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsAskOrderCancellation.prototype.getAppendixName = function () {
        return "AskOrderCancellation";
    };
    ColoredCoinsAskOrderCancellation.prototype.getTransactionType = function () {
        return transaction_type_1.ASK_ORDER_CANCELLATION_TRANSACTION_TYPE;
    };
    return ColoredCoinsAskOrderCancellation;
}(ColoredCoinsOrderCancellation));
exports.ColoredCoinsAskOrderCancellation = ColoredCoinsAskOrderCancellation;
var ColoredCoinsBidOrderCancellation = /** @class */ (function (_super) {
    __extends(ColoredCoinsBidOrderCancellation, _super);
    function ColoredCoinsBidOrderCancellation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsBidOrderCancellation.prototype.getAppendixName = function () {
        return "BidOrderCancellation";
    };
    ColoredCoinsBidOrderCancellation.prototype.getTransactionType = function () {
        return transaction_type_1.BID_ORDER_CANCELLATION_TRANSACTION_TYPE;
    };
    return ColoredCoinsBidOrderCancellation;
}(ColoredCoinsOrderCancellation));
exports.ColoredCoinsBidOrderCancellation = ColoredCoinsBidOrderCancellation;
// ------------------- Colored coins. Whitelist ------------------------------------------------------------------------
var ColoredCoinsWhitelistAccountAddition = /** @class */ (function (_super) {
    __extends(ColoredCoinsWhitelistAccountAddition, _super);
    function ColoredCoinsWhitelistAccountAddition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsWhitelistAccountAddition.prototype.init = function (assetId, accountId, endHeight) {
        this.assetId = long_1.default.fromString(assetId);
        this.accountId = long_1.default.fromString(accountId);
        this.endHeight = endHeight;
        return this;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getMySize = function () {
        return 8 + 8 + 4;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.assetId = buffer.readInt64();
        this.accountId = buffer.readInt64();
        this.endHeight = buffer.readInt32();
        return this;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.accountId);
        buffer.writeInt32(this.endHeight);
    };
    ColoredCoinsWhitelistAccountAddition.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.accountId = long_1.default.fromString(json["account"], true);
        this.endHeight = json["endHeight"];
        return this;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.putMyJSON = function (json) {
        json["asset"] = this.assetId.toUnsigned().toString();
        json["account"] = this.accountId.toUnsigned().toString();
        json["endHeight"] = this.endHeight;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getAppendixName = function () {
        return "WhitelistAccountAddition";
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getTransactionType = function () {
        return transaction_type_1.WHITELIST_ACCOUNT_ADDITION_TRANSACTION_TYPE;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getFee = function () {
        return fee_1.Fee.WHITELIST_ACCOUNT_FEE;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getAssetId = function () {
        return this.assetId;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getAccountId = function () {
        return this.accountId;
    };
    ColoredCoinsWhitelistAccountAddition.prototype.getEndHeight = function () {
        return this.endHeight;
    };
    return ColoredCoinsWhitelistAccountAddition;
}(appendix_1.AbstractAppendix));
exports.ColoredCoinsWhitelistAccountAddition = ColoredCoinsWhitelistAccountAddition;
var ColoredCoinsWhitelistAccountRemoval = /** @class */ (function (_super) {
    __extends(ColoredCoinsWhitelistAccountRemoval, _super);
    function ColoredCoinsWhitelistAccountRemoval() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsWhitelistAccountRemoval.prototype.init = function (assetId, accountId) {
        this.assetId = long_1.default.fromString(assetId);
        this.accountId = long_1.default.fromString(accountId);
        return this;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.getMySize = function () {
        return 8 + 8;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.assetId = buffer.readInt64();
        this.accountId = buffer.readInt64();
        return this;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.assetId);
        buffer.writeInt64(this.accountId);
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.assetId = long_1.default.fromString(json["asset"], true);
        this.accountId = long_1.default.fromString(json["account"], true);
        return this;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.putMyJSON = function (json) {
        json["asset"] = this.assetId.toUnsigned().toString();
        json["account"] = this.accountId.toUnsigned().toString();
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.getAppendixName = function () {
        return "WhitelistAccountRemoval";
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.getTransactionType = function () {
        return transaction_type_1.WHITELIST_ACCOUNT_REMOVAL_TRANSACTION_TYPE;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.getFee = function () {
        return fee_1.Fee.WHITELIST_ACCOUNT_FEE;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.getAssetId = function () {
        return this.assetId;
    };
    ColoredCoinsWhitelistAccountRemoval.prototype.getAccountId = function () {
        return this.accountId;
    };
    return ColoredCoinsWhitelistAccountRemoval;
}(appendix_1.AbstractAppendix));
exports.ColoredCoinsWhitelistAccountRemoval = ColoredCoinsWhitelistAccountRemoval;
var ColoredCoinsWhitelistMarket = /** @class */ (function (_super) {
    __extends(ColoredCoinsWhitelistMarket, _super);
    function ColoredCoinsWhitelistMarket() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColoredCoinsWhitelistMarket.prototype.init = function (currencyId, assetId) {
        this.currencyId = long_1.default.fromString(currencyId);
        this.assetId = long_1.default.fromString(assetId);
        return this;
    };
    ColoredCoinsWhitelistMarket.prototype.getMySize = function () {
        return 8 + 8;
    };
    ColoredCoinsWhitelistMarket.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.currencyId = buffer.readInt64();
        this.assetId = buffer.readInt64();
        return this;
    };
    ColoredCoinsWhitelistMarket.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.currencyId);
        buffer.writeInt64(this.assetId);
    };
    ColoredCoinsWhitelistMarket.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.currencyId = long_1.default.fromString(json["currency"], true);
        this.assetId = long_1.default.fromString(json["asset"], true);
        return this;
    };
    ColoredCoinsWhitelistMarket.prototype.putMyJSON = function (json) {
        json["currency"] = this.currencyId.toUnsigned().toString();
        json["asset"] = this.assetId.toUnsigned().toString();
    };
    ColoredCoinsWhitelistMarket.prototype.getAppendixName = function () {
        return "WhitelistMarket";
    };
    ColoredCoinsWhitelistMarket.prototype.getTransactionType = function () {
        return transaction_type_1.WHITELIST_MARKET_TRANSACTION_TYPE;
    };
    ColoredCoinsWhitelistMarket.prototype.getFee = function () {
        return fee_1.Fee.WHITELIST_MARKET_FEE;
    };
    ColoredCoinsWhitelistMarket.prototype.getAssetId = function () {
        return this.assetId;
    };
    ColoredCoinsWhitelistMarket.prototype.getCurrencyId = function () {
        return this.currencyId;
    };
    return ColoredCoinsWhitelistMarket;
}(appendix_1.AbstractAppendix));
exports.ColoredCoinsWhitelistMarket = ColoredCoinsWhitelistMarket;
// ------------------- AccountControlEffectiveBalanceLeasing -----------------------------------------------------------
var AccountControlEffectiveBalanceLeasing = /** @class */ (function (_super) {
    __extends(AccountControlEffectiveBalanceLeasing, _super);
    function AccountControlEffectiveBalanceLeasing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountControlEffectiveBalanceLeasing.prototype.init = function (period) {
        this.period = period;
        return this;
    };
    AccountControlEffectiveBalanceLeasing.prototype.getMySize = function () {
        return 4;
    };
    AccountControlEffectiveBalanceLeasing.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.period = buffer.readInt32();
        return this;
    };
    AccountControlEffectiveBalanceLeasing.prototype.putMyBytes = function (buffer) {
        buffer.writeInt32(this.period);
    };
    AccountControlEffectiveBalanceLeasing.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.period = json["period"];
        return this;
    };
    AccountControlEffectiveBalanceLeasing.prototype.putMyJSON = function (json) {
        json["period"] = this.period;
    };
    AccountControlEffectiveBalanceLeasing.prototype.getAppendixName = function () {
        return "EffectiveBalanceLeasing";
    };
    AccountControlEffectiveBalanceLeasing.prototype.getTransactionType = function () {
        return transaction_type_1.EFFECTIVE_BALANCE_LEASING_TRANSACTION_TYPE;
    };
    AccountControlEffectiveBalanceLeasing.prototype.getFee = function () {
        return fee_1.Fee.EFFECTIVE_BALANCE_LEASING_FEE;
    };
    AccountControlEffectiveBalanceLeasing.prototype.getPeriod = function () {
        return this.period;
    };
    return AccountControlEffectiveBalanceLeasing;
}(appendix_1.AbstractAppendix));
exports.AccountControlEffectiveBalanceLeasing = AccountControlEffectiveBalanceLeasing;
exports.ORDINARY_PAYMENT = new Payment();
exports.ARBITRARY_MESSAGE = new Message();
