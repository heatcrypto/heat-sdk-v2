"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const utils_1 = require("./utils");
const appendix_1 = require("./appendix");
const converters_1 = require("./converters");
const crypto_1 = require("./crypto");
class Transaction {
    constructor(heatsdk, recipientOrRecipientPublicKey, builder) {
        this.heatsdk = heatsdk;
        this.recipientOrRecipientPublicKey = recipientOrRecipientPublicKey;
        this.builder = builder;
    }
    sign(secretPhrase) {
        return this.build(secretPhrase).then(() => {
            this.transaction_ = this.builder.build(secretPhrase);
            return this;
        });
    }
    /**
     * Return signed transaction
     */
    getTransaction() {
        if (!utils_1.isDefined(this.transaction_))
            throw new Error("Must call sign() first");
        return this.transaction_;
    }
    build(secretPhrase) {
        return new Promise((resolve, reject) => {
            this.builder
                .deadline(utils_1.isDefined(this.deadline_) ? this.deadline_ : 1440)
                .timestamp(utils_1.epochTime())
                .ecBlockHeight(1)
                .ecBlockId("0");
            let recipientPublicKeyHex;
            if (utils_1.isDefined(this.privateMessageToSelf_))
                recipientPublicKeyHex = crypto_1.secretPhraseToPublicKey(secretPhrase);
            if (!recipientPublicKeyHex)
                recipientPublicKeyHex = utils_1.isPublicKey(this.recipientOrRecipientPublicKey)
                    ? this.recipientOrRecipientPublicKey
                    : null;
            if (recipientPublicKeyHex) {
                this.builder
                    .publicKeyAnnouncement(new appendix_1.AppendixPublicKeyAnnouncement().init(converters_1.hexStringToByteArray(recipientPublicKeyHex)))
                    .recipientId(crypto_1.getAccountIdFromPublicKey(recipientPublicKeyHex));
            }
            else {
                this.builder.recipientId(this.recipientOrRecipientPublicKey);
            }
            if (utils_1.isDefined(this.publicMessage_)) {
                let a = new appendix_1.AppendixMessage().init(this.messageIsBinary_
                    ? converters_1.hexStringToByteArray(this.publicMessage_)
                    : converters_1.stringToByteArray(this.publicMessage_), !this.messageIsBinary_);
                this.builder.message(a);
            }
            else {
                let isPrivate = utils_1.isDefined(this.privateMessage_);
                let isPrivateToSelf = utils_1.isDefined(this.privateMessageToSelf_);
                if (isPrivate || isPrivateToSelf) {
                    if (!recipientPublicKeyHex)
                        throw new Error("Recipient public key not provided");
                    crypto_1.encryptMessage(isPrivate ? this.privateMessage_ : this.privateMessageToSelf_, recipientPublicKeyHex, secretPhrase)
                        .then(encryptedMessage => {
                        let a = (isPrivate
                            ? new appendix_1.AppendixEncryptedMessage()
                            : new appendix_1.AppendixEncryptToSelfMessage()).init(encryptedMessage, !this.messageIsBinary_);
                        this.builder.encryptToSelfMessage(a);
                        resolve(); // resolve in encryptMessage callback
                    })
                        .catch(reject);
                    return; // exit here to not touch the final resolve
                }
            }
            resolve();
        });
    }
    hasMessage() {
        return (utils_1.isDefined(this.publicMessage_) ||
            utils_1.isDefined(this.privateMessage_) ||
            utils_1.isDefined(this.privateMessageToSelf_));
    }
    publicMessage(message, isBinary) {
        if (this.hasMessage())
            throw new Error("Transaction already has a message");
        this.messageIsBinary_ = !!isBinary;
        this.publicMessage_ = message;
        return this;
    }
    privateMessage(message, isBinary) {
        if (this.hasMessage())
            throw new Error("Transaction already has a message");
        this.messageIsBinary_ = !!isBinary;
        this.privateMessage_ = message;
        return this;
    }
    privateMessageToSelf(message, isBinary) {
        if (this.hasMessage())
            throw new Error("Transaction already has a message");
        this.messageIsBinary_ = !!isBinary;
        this.privateMessageToSelf_ = message;
        return this;
    }
    deadline(deadline) {
        this.deadline_ = deadline;
        return this;
    }
}
exports.Transaction = Transaction;
