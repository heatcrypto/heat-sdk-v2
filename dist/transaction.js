"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var utils_1 = require("./utils");
var appendix_1 = require("./appendix");
var converters_1 = require("./converters");
var crypto_1 = require("./crypto");
var Transaction = /** @class */ (function () {
    function Transaction(heatsdk, recipientOrRecipientPublicKey, builder) {
        this.heatsdk = heatsdk;
        this.recipientOrRecipientPublicKey = recipientOrRecipientPublicKey;
        this.builder = builder;
    }
    Transaction.prototype.sign = function (secretPhrase) {
        var _this = this;
        return this.build(secretPhrase).then(function () {
            _this.transaction_ = _this.builder.build(secretPhrase);
            return _this;
        });
    };
    /**
     * Return signed transaction
     */
    Transaction.prototype.getTransaction = function () {
        if (!utils_1.isDefined(this.transaction_))
            throw new Error("Must call sign() first");
        return this.transaction_;
    };
    Transaction.prototype.build = function (secretPhrase) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.builder
                .deadline(utils_1.isDefined(_this.deadline_) ? _this.deadline_ : 1440)
                .timestamp(utils_1.epochTime())
                .ecBlockHeight(1)
                .ecBlockId("0");
            var recipientPublicKeyHex;
            if (utils_1.isDefined(_this.privateMessageToSelf_))
                recipientPublicKeyHex = crypto_1.secretPhraseToPublicKey(secretPhrase);
            if (!recipientPublicKeyHex)
                recipientPublicKeyHex = utils_1.isPublicKey(_this.recipientOrRecipientPublicKey)
                    ? _this.recipientOrRecipientPublicKey
                    : null;
            // prevents: 'PublicKeyAnnouncement cannot be attached to transactions with no recipient'
            if (recipientPublicKeyHex && _this.recipientOrRecipientPublicKey != '0') {
                _this.builder
                    .publicKeyAnnouncement(new appendix_1.AppendixPublicKeyAnnouncement().init(converters_1.hexStringToByteArray(recipientPublicKeyHex)))
                    .recipientId(crypto_1.getAccountIdFromPublicKey(recipientPublicKeyHex));
            }
            else {
                _this.builder.recipientId(_this.recipientOrRecipientPublicKey);
            }
            if (utils_1.isDefined(_this.publicMessage_)) {
                var a = new appendix_1.AppendixMessage().init(_this.messageIsBinary_
                    ? converters_1.hexStringToByteArray(_this.publicMessage_)
                    : converters_1.stringToByteArray(_this.publicMessage_), !_this.messageIsBinary_);
                _this.builder.message(a);
            }
            else {
                var isPrivate_1 = utils_1.isDefined(_this.privateMessage_);
                var isPrivateToSelf = utils_1.isDefined(_this.privateMessageToSelf_);
                if (isPrivate_1 || isPrivateToSelf) {
                    if (!recipientPublicKeyHex)
                        throw new Error("Recipient public key not provided");
                    crypto_1.encryptMessage(isPrivate_1 ? _this.privateMessage_ : _this.privateMessageToSelf_, recipientPublicKeyHex, secretPhrase)
                        .then(function (encryptedMessage) {
                        var a = (isPrivate_1
                            ? new appendix_1.AppendixEncryptedMessage()
                            : new appendix_1.AppendixEncryptToSelfMessage()).init(encryptedMessage, !_this.messageIsBinary_);
                        _this.builder.encryptToSelfMessage(a);
                        resolve(); // resolve in encryptMessage callback
                    })
                        .catch(reject);
                    return; // exit here to not touch the final resolve
                }
            }
            resolve();
        });
    };
    Transaction.prototype.hasMessage = function () {
        return (utils_1.isDefined(this.publicMessage_) ||
            utils_1.isDefined(this.privateMessage_) ||
            utils_1.isDefined(this.privateMessageToSelf_));
    };
    Transaction.prototype.publicMessage = function (message, isBinary) {
        if (this.hasMessage())
            throw new Error("Transaction already has a message");
        this.messageIsBinary_ = !!isBinary;
        this.publicMessage_ = message;
        return this;
    };
    Transaction.prototype.privateMessage = function (message, isBinary) {
        if (this.hasMessage())
            throw new Error("Transaction already has a message");
        this.messageIsBinary_ = !!isBinary;
        this.privateMessage_ = message;
        return this;
    };
    Transaction.prototype.privateMessageToSelf = function (message, isBinary) {
        if (this.hasMessage())
            throw new Error("Transaction already has a message");
        this.messageIsBinary_ = !!isBinary;
        this.privateMessageToSelf_ = message;
        return this;
    };
    Transaction.prototype.deadline = function (deadline) {
        this.deadline_ = deadline;
        return this;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
