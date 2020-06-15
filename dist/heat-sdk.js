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
exports.HeatSDK = exports.Configuration = exports.Transaction = exports.TransactionImpl = exports.Builder = exports.attachment = void 0;
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
const converters = __importStar(require("./converters"));
const crypto = __importStar(require("./crypto"));
const utils = __importStar(require("./utils"));
const _attachment = __importStar(require("./attachment"));
const builder = __importStar(require("./builder"));
const transaction = __importStar(require("./transaction"));
const attachment_1 = require("./attachment");
const fee_1 = require("./fee");
exports.attachment = _attachment;
exports.Builder = builder.Builder;
exports.TransactionImpl = builder.TransactionImpl;
exports.Transaction = transaction.Transaction;
class Configuration {
    constructor(args) {
        this.isTestnet = false;
        if (args) {
            if (utils.isDefined(args.isTestnet))
                this.isTestnet = !!args.isTestnet;
            if (utils.isDefined(args.genesisKey))
                this.genesisKey = args.genesisKey;
        }
        if (!utils.isDefined(this.genesisKey)) {
            if (this.isTestnet) {
                this.genesisKey = [255, 255, 255, 255, 255, 255, 255, 127];
            }
        }
    }
}
exports.Configuration = Configuration;
class HeatSDK {
    constructor(config) {
        this.utils = utils;
        this.crypto = crypto;
        this.converters = converters;
        const config_ = config ? config : new Configuration();
        this.config = config_;
    }
    parseTransactionBytes(transactionBytesHex) {
        return exports.TransactionImpl.parse(transactionBytesHex, this.config.isTestnet);
    }
    parseTransactionJSON(json) {
        return exports.TransactionImpl.parseJSON(json, this.config.isTestnet);
    }
    passphraseEncrypt(plainText, passphrase) {
        return crypto.passphraseEncrypt(plainText, passphrase).encode();
    }
    passphraseDecrypt(cipherText, passphrase) {
        let encrypted = crypto.PassphraseEncryptedMessage.decode(cipherText);
        return crypto.passphraseDecrypt(encrypted, passphrase);
    }
    payment(recipientOrRecipientPublicKey, amount) {
        return new exports.Transaction(this, recipientOrRecipientPublicKey, new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(exports.attachment.ORDINARY_PAYMENT)
            .amountHQT(utils.convertToQNT(amount)));
    }
    arbitraryMessage(recipientOrRecipientPublicKey, message) {
        return new exports.Transaction(this, recipientOrRecipientPublicKey, new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(exports.attachment.ARBITRARY_MESSAGE)
            .amountHQT("0")).publicMessage(message);
    }
    privateMessage(recipientPublicKey, message) {
        return new exports.Transaction(this, recipientPublicKey, new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(exports.attachment.ARBITRARY_MESSAGE)
            .amountHQT("0")).privateMessage(message);
    }
    privateMessageToSelf(message) {
        return new exports.Transaction(this, null, // if null and provide private message then to send encrypted message to self
        new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(exports.attachment.ARBITRARY_MESSAGE)
            .amountHQT("0")).privateMessageToSelf(message);
    }
    assetIssuance(descriptionUrl, descriptionHash, quantity, decimals, dillutable, feeHQT) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.AssetIssuance().init(descriptionUrl, descriptionHash, quantity, decimals, dillutable))
            .amountHQT("0")
            .feeHQT(feeHQT ? feeHQT : fee_1.Fee.ASSET_ISSUANCE_FEE);
        return new exports.Transaction(this, "0", builder);
    }
    assetTransfer(recipientOrRecipientPublicKey, assetId, quantity, feeHQT) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.AssetTransfer().init(assetId, quantity))
            .amountHQT("0")
            .feeHQT(feeHQT ? feeHQT : fee_1.Fee.ASSET_TRANSFER_FEE);
        return new exports.Transaction(this, recipientOrRecipientPublicKey, builder);
    }
    atomicMultiTransfer(recipientOrRecipientPublicKey, transfers, feeHQT) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.AtomicMultiTransfer().init(transfers))
            .amountHQT("0")
            .feeHQT(feeHQT ? feeHQT : fee_1.Fee.ATOMIC_MULTI_TRANSFER_FEE);
        return new exports.Transaction(this, recipientOrRecipientPublicKey, builder);
    }
    placeAskOrder(currencyId, assetId, quantity, price, expiration) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.ColoredCoinsAskOrderPlacement().init(currencyId, assetId, quantity, price, expiration))
            .amountHQT("0")
            .feeHQT("1000000");
        return new exports.Transaction(this, "0", builder);
    }
    placeBidOrder(currencyId, assetId, quantity, price, expiration) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.ColoredCoinsBidOrderPlacement().init(currencyId, assetId, quantity, price, expiration))
            .amountHQT("0")
            .feeHQT("1000000");
        return new exports.Transaction(this, "0", builder);
    }
    cancelAskOrder(orderId) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.ColoredCoinsAskOrderCancellation().init(orderId))
            .amountHQT("0")
            .feeHQT("1000000");
        return new exports.Transaction(this, "0", builder);
    }
    cancelBidOrder(orderId) {
        let builder = new exports.Builder()
            .isTestnet(this.config.isTestnet)
            .genesisKey(this.config.genesisKey)
            .attachment(new attachment_1.ColoredCoinsBidOrderCancellation().init(orderId))
            .amountHQT("0")
            .feeHQT("1000000");
        return new exports.Transaction(this, "0", builder);
    }
}
exports.HeatSDK = HeatSDK;
