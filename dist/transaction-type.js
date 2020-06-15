"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EFFECTIVE_BALANCE_LEASING_TRANSACTION_TYPE = exports.WHITELIST_MARKET_TRANSACTION_TYPE = exports.WHITELIST_ACCOUNT_REMOVAL_TRANSACTION_TYPE = exports.WHITELIST_ACCOUNT_ADDITION_TRANSACTION_TYPE = exports.BID_ORDER_CANCELLATION_TRANSACTION_TYPE = exports.ASK_ORDER_CANCELLATION_TRANSACTION_TYPE = exports.COLORED_COINS_BID_ORDER_PLACEMENT_TRANSACTION_TYPE = exports.COLORED_COINS_ASK_ORDER_PLACEMENT_TRANSACTION_TYPE = exports.COLORED_COINS_ATOMIC_MULTI_TRANSFER_TRANSACTION_TYPE = exports.COLORED_COINS_ASSET_TRANSFER_TRANSACTION_TYPE = exports.COLORED_COINS_ASSET_ISSUE_MORE_TRANSACTION_TYPE = exports.COLORED_COINS_ASSET_ISSUANCE_TRANSACTION_TYPE = exports.ARBITRARY_MESSAGE_TRANSACTION_TYPE = exports.ORDINARY_PAYMENT_TRANSACTION_TYPE = exports.EffectiveBalanceLeasing = exports.AccountControl = exports.WhitelistMarket = exports.WhitelistAccountRemoval = exports.WhitelistAccountAddition = exports.ColoredCoinsWhitelist = exports.BidOrderCancellation = exports.AskOrderCancellation = exports.ColoredCoinsOrderCancellation = exports.BidOrderPlacement = exports.AskOrderPlacement = exports.ColoredCoinsOrderPlacement = exports.AtomicMultiTransfer = exports.AssetTransfer = exports.AssetIssueMore = exports.AssetIssuance = exports.ColoredCoins = exports.ArbitraryMessage = exports.OrdinaryPayment = exports.TransactionType = void 0;
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
const attachment = __importStar(require("./attachment"));
class TransactionType {
    static findTransactionType(type, subtype) {
        if (type == this.TYPE_PAYMENT) {
            if (subtype == this.SUBTYPE_PAYMENT_ORDINARY_PAYMENT) {
                return exports.ORDINARY_PAYMENT_TRANSACTION_TYPE;
            }
        }
        else if (type == this.TYPE_MESSAGING) {
            if (subtype == this.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE) {
                return exports.ARBITRARY_MESSAGE_TRANSACTION_TYPE;
            }
        }
        else if (type == this.TYPE_COLORED_COINS) {
            if (subtype == this.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE)
                return exports.COLORED_COINS_ASSET_ISSUANCE_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_ASSET_ISSUE_MORE)
                return exports.COLORED_COINS_ASSET_ISSUE_MORE_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_ASSET_TRANSFER)
                return exports.COLORED_COINS_ASSET_TRANSFER_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_ATOMIC_MULTI_TRANSFER)
                return exports.COLORED_COINS_ATOMIC_MULTI_TRANSFER_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT)
                return exports.COLORED_COINS_ASK_ORDER_PLACEMENT_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT)
                return exports.COLORED_COINS_BID_ORDER_PLACEMENT_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION)
                return exports.ASK_ORDER_CANCELLATION_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION)
                return exports.BID_ORDER_CANCELLATION_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_ADDITION)
                return exports.WHITELIST_ACCOUNT_ADDITION_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_REMOVAL)
                return exports.WHITELIST_ACCOUNT_REMOVAL_TRANSACTION_TYPE;
            else if (subtype == this.SUBTYPE_COLORED_COINS_WHITELIST_MARKET)
                return exports.WHITELIST_MARKET_TRANSACTION_TYPE;
        }
        else if (type == this.TYPE_ACCOUNT_CONTROL) {
            if (subtype == this.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING)
                return exports.EFFECTIVE_BALANCE_LEASING_TRANSACTION_TYPE;
        }
    }
    mustHaveRecipient() {
        return this.canHaveRecipient();
    }
}
exports.TransactionType = TransactionType;
TransactionType.TYPE_PAYMENT = 0;
TransactionType.TYPE_MESSAGING = 1;
TransactionType.TYPE_COLORED_COINS = 2;
TransactionType.TYPE_ACCOUNT_CONTROL = 4;
TransactionType.SUBTYPE_PAYMENT_ORDINARY_PAYMENT = 0;
TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE = 0;
TransactionType.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE = 0;
TransactionType.SUBTYPE_COLORED_COINS_ASSET_ISSUE_MORE = 1;
TransactionType.SUBTYPE_COLORED_COINS_ASSET_TRANSFER = 2;
TransactionType.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT = 3;
TransactionType.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT = 4;
TransactionType.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION = 5;
TransactionType.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION = 6;
TransactionType.SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_ADDITION = 7;
TransactionType.SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_REMOVAL = 8;
TransactionType.SUBTYPE_COLORED_COINS_WHITELIST_MARKET = 9;
TransactionType.SUBTYPE_COLORED_COINS_ATOMIC_MULTI_TRANSFER = 10;
TransactionType.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING = 0;
class OrdinaryPayment extends TransactionType {
    getType() {
        return TransactionType.TYPE_PAYMENT;
    }
    getSubtype() {
        return TransactionType.SUBTYPE_PAYMENT_ORDINARY_PAYMENT;
    }
    parseAttachment(buffer) {
        buffer.offset++; // advance the buffer position past the version byte
        return attachment.ORDINARY_PAYMENT;
    }
    parseAttachmentJSON(json) {
        return attachment.ORDINARY_PAYMENT;
    }
    canHaveRecipient() {
        return true;
    }
}
exports.OrdinaryPayment = OrdinaryPayment;
class ArbitraryMessage extends TransactionType {
    getType() {
        return TransactionType.TYPE_MESSAGING;
    }
    getSubtype() {
        return TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE;
    }
    parseAttachment(buffer) {
        buffer.offset++; // advance the buffer position past the version byte
        return attachment.ARBITRARY_MESSAGE;
    }
    parseAttachmentJSON(json) {
        return attachment.ARBITRARY_MESSAGE;
    }
    canHaveRecipient() {
        return true;
    }
    mustHaveRecipient() {
        return false;
    }
}
exports.ArbitraryMessage = ArbitraryMessage;
class ColoredCoins extends TransactionType {
    getType() {
        return TransactionType.TYPE_COLORED_COINS;
    }
}
exports.ColoredCoins = ColoredCoins;
class AssetIssuance extends ColoredCoins {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE;
    }
    parseAttachment(buffer) {
        return new attachment.AssetIssuance().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.AssetIssuance().parseJSON(json);
    }
    canHaveRecipient() {
        return false;
    }
}
exports.AssetIssuance = AssetIssuance;
class AssetIssueMore extends ColoredCoins {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_ASSET_ISSUE_MORE;
    }
    parseAttachment(buffer) {
        return new attachment.AssetIssueMore().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.AssetIssueMore().parseJSON(json);
    }
    canHaveRecipient() {
        return false;
    }
}
exports.AssetIssueMore = AssetIssueMore;
class AssetTransfer extends ColoredCoins {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_ASSET_TRANSFER;
    }
    parseAttachment(buffer) {
        return new attachment.AssetTransfer().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.AssetTransfer().parseJSON(json);
    }
    canHaveRecipient() {
        return true;
    }
}
exports.AssetTransfer = AssetTransfer;
class AtomicMultiTransfer extends ColoredCoins {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_ATOMIC_MULTI_TRANSFER;
    }
    parseAttachment(buffer) {
        return new attachment.AtomicMultiTransfer().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.AtomicMultiTransfer().parseJSON(json);
    }
    canHaveRecipient() {
        return true;
    }
}
exports.AtomicMultiTransfer = AtomicMultiTransfer;
class ColoredCoinsOrderPlacement extends ColoredCoins {
    canHaveRecipient() {
        return false;
    }
}
exports.ColoredCoinsOrderPlacement = ColoredCoinsOrderPlacement;
class AskOrderPlacement extends ColoredCoinsOrderPlacement {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsAskOrderPlacement().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsAskOrderPlacement().parseJSON(json);
    }
}
exports.AskOrderPlacement = AskOrderPlacement;
class BidOrderPlacement extends ColoredCoinsOrderPlacement {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsBidOrderPlacement().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsBidOrderPlacement().parseJSON(json);
    }
}
exports.BidOrderPlacement = BidOrderPlacement;
class ColoredCoinsOrderCancellation extends ColoredCoins {
    canHaveRecipient() {
        return false;
    }
}
exports.ColoredCoinsOrderCancellation = ColoredCoinsOrderCancellation;
class AskOrderCancellation extends ColoredCoinsOrderCancellation {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsAskOrderCancellation().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsAskOrderCancellation().parseJSON(json);
    }
}
exports.AskOrderCancellation = AskOrderCancellation;
class BidOrderCancellation extends ColoredCoinsOrderCancellation {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsBidOrderCancellation().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsBidOrderCancellation().parseJSON(json);
    }
}
exports.BidOrderCancellation = BidOrderCancellation;
class ColoredCoinsWhitelist extends ColoredCoins {
    canHaveRecipient() {
        return false;
    }
}
exports.ColoredCoinsWhitelist = ColoredCoinsWhitelist;
class WhitelistAccountAddition extends ColoredCoinsWhitelist {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_ADDITION;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsWhitelistAccountAddition().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsWhitelistAccountAddition().parseJSON(json);
    }
}
exports.WhitelistAccountAddition = WhitelistAccountAddition;
class WhitelistAccountRemoval extends ColoredCoinsWhitelist {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_REMOVAL;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsWhitelistAccountRemoval().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsWhitelistAccountRemoval().parseJSON(json);
    }
}
exports.WhitelistAccountRemoval = WhitelistAccountRemoval;
class WhitelistMarket extends ColoredCoinsWhitelist {
    getSubtype() {
        return TransactionType.SUBTYPE_COLORED_COINS_WHITELIST_MARKET;
    }
    parseAttachment(buffer) {
        return new attachment.ColoredCoinsWhitelistMarket().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.ColoredCoinsWhitelistMarket().parseJSON(json);
    }
}
exports.WhitelistMarket = WhitelistMarket;
class AccountControl extends TransactionType {
    getType() {
        return TransactionType.TYPE_ACCOUNT_CONTROL;
    }
    canHaveRecipient() {
        return true;
    }
}
exports.AccountControl = AccountControl;
class EffectiveBalanceLeasing extends AccountControl {
    getSubtype() {
        return TransactionType.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING;
    }
    parseAttachment(buffer) {
        return new attachment.AccountControlEffectiveBalanceLeasing().parse(buffer);
    }
    parseAttachmentJSON(json) {
        return new attachment.AccountControlEffectiveBalanceLeasing().parseJSON(json);
    }
}
exports.EffectiveBalanceLeasing = EffectiveBalanceLeasing;
exports.ORDINARY_PAYMENT_TRANSACTION_TYPE = new OrdinaryPayment();
exports.ARBITRARY_MESSAGE_TRANSACTION_TYPE = new ArbitraryMessage();
exports.COLORED_COINS_ASSET_ISSUANCE_TRANSACTION_TYPE = new AssetIssuance();
exports.COLORED_COINS_ASSET_ISSUE_MORE_TRANSACTION_TYPE = new AssetIssueMore();
exports.COLORED_COINS_ASSET_TRANSFER_TRANSACTION_TYPE = new AssetTransfer();
exports.COLORED_COINS_ATOMIC_MULTI_TRANSFER_TRANSACTION_TYPE = new AtomicMultiTransfer();
exports.COLORED_COINS_ASK_ORDER_PLACEMENT_TRANSACTION_TYPE = new AskOrderPlacement();
exports.COLORED_COINS_BID_ORDER_PLACEMENT_TRANSACTION_TYPE = new BidOrderPlacement();
exports.ASK_ORDER_CANCELLATION_TRANSACTION_TYPE = new AskOrderCancellation();
exports.BID_ORDER_CANCELLATION_TRANSACTION_TYPE = new BidOrderCancellation();
exports.WHITELIST_ACCOUNT_ADDITION_TRANSACTION_TYPE = new WhitelistAccountAddition();
exports.WHITELIST_ACCOUNT_REMOVAL_TRANSACTION_TYPE = new WhitelistAccountRemoval();
exports.WHITELIST_MARKET_TRANSACTION_TYPE = new WhitelistMarket();
exports.EFFECTIVE_BALANCE_LEASING_TRANSACTION_TYPE = new EffectiveBalanceLeasing();
