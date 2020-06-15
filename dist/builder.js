"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionImpl = exports.Builder = void 0;
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
var transaction_type_1 = require("./transaction-type");
var appendix_1 = require("./appendix");
var utils_1 = require("./utils");
var converters_1 = require("./converters");
var crypto_1 = require("./crypto");
var long_1 = __importDefault(require("long"));
var bytebuffer_1 = __importDefault(require("bytebuffer"));
var Builder = /** @class */ (function () {
    function Builder() {
        this._deadline = 1440;
        this._version = 1;
    }
    Builder.prototype.deadline = function (deadline) {
        this._deadline = deadline;
        return this;
    };
    Builder.prototype.senderPublicKey = function (senderPublicKey) {
        this._senderPublicKey = senderPublicKey;
        return this;
    };
    Builder.prototype.amountHQT = function (amountHQT) {
        this._amountHQT = amountHQT;
        return this;
    };
    Builder.prototype.feeHQT = function (feeHQT) {
        this._feeHQT = feeHQT;
        return this;
    };
    Builder.prototype.version = function (version) {
        this._version = version;
        return this;
    };
    Builder.prototype.attachment = function (attachment) {
        this._attachment = attachment;
        this._type = attachment.getTransactionType();
        return this;
    };
    Builder.prototype.recipientId = function (recipientId) {
        this._recipientId = recipientId;
        return this;
    };
    Builder.prototype.signature = function (signature) {
        this._signature = signature;
        return this;
    };
    Builder.prototype.message = function (message) {
        this._message = message;
        return this;
    };
    Builder.prototype.encryptedMessage = function (encryptedMessage) {
        this._encryptedMessage = encryptedMessage;
        return this;
    };
    Builder.prototype.encryptToSelfMessage = function (encryptToSelfMessage) {
        this._encryptToSelfMessage = encryptToSelfMessage;
        return this;
    };
    Builder.prototype.publicKeyAnnouncement = function (publicKeyAnnouncement) {
        this._publicKeyAnnouncement = publicKeyAnnouncement;
        return this;
    };
    Builder.prototype.privateNameAnnouncement = function (privateNameAnnouncement) {
        this._privateNameAnnouncement = privateNameAnnouncement;
        return this;
    };
    Builder.prototype.privateNameAssignment = function (privateNameAssignment) {
        this._privateNameAssignment = privateNameAssignment;
        return this;
    };
    Builder.prototype.publicNameAnnouncement = function (publicNameAnnouncement) {
        this._publicNameAnnouncement = publicNameAnnouncement;
        return this;
    };
    Builder.prototype.publicNameAssignment = function (publicNameAssignment) {
        this._publicNameAssignment = publicNameAssignment;
        return this;
    };
    Builder.prototype.isTestnet = function (isTestnet) {
        this._isTestnet = isTestnet;
        return this;
    };
    Builder.prototype.genesisKey = function (genesisKey) {
        this._genesisKey = genesisKey;
        return this;
    };
    Builder.prototype.timestamp = function (timestamp) {
        this._timestamp = timestamp;
        return this;
    };
    Builder.prototype.ecBlockId = function (ecBlockId) {
        this._ecBlockId = ecBlockId;
        return this;
    };
    Builder.prototype.ecBlockHeight = function (ecBlockHeight) {
        this._ecBlockHeight = ecBlockHeight;
        return this;
    };
    Builder.prototype.build = function (secretPhrase) {
        return new TransactionImpl(this, secretPhrase);
    };
    return Builder;
}());
exports.Builder = Builder;
var TransactionImpl = /** @class */ (function () {
    function TransactionImpl(builder, secretPhrase) {
        var _this = this;
        this.height = 0x7fffffff;
        this.appendages = [];
        this.isTestnet = builder._isTestnet || false;
        this.genesisKey = builder._genesisKey;
        this.timestamp = builder._timestamp;
        this.type = builder._type;
        this.version = builder._version;
        this.deadline = builder._deadline;
        this.senderPublicKey = builder._senderPublicKey;
        this.recipientId = builder._recipientId;
        this.amountHQT = builder._amountHQT;
        this.feeHQT = builder._feeHQT;
        this.signature = builder._signature;
        this.message = builder._message;
        this.encryptedMessage = builder._encryptedMessage;
        this.encryptToSelfMessage = builder._encryptToSelfMessage;
        this.publicKeyAnnouncement = builder._publicKeyAnnouncement;
        this.privateNameAnnouncement = builder._privateNameAnnouncement;
        this.privateNameAssignment = builder._privateNameAssignment;
        this.publicNameAnnouncement = builder._publicNameAnnouncement;
        this.publicNameAssignment = builder._publicNameAssignment;
        this.ecBlockHeight = builder._ecBlockHeight;
        this.ecBlockId = builder._ecBlockId;
        this.senderPublicKey;
        if (utils_1.isDefined(builder._senderPublicKey))
            this.senderPublicKey = builder._senderPublicKey;
        else if (secretPhrase)
            this.senderPublicKey = converters_1.hexStringToByteArray(crypto_1.secretPhraseToPublicKey(secretPhrase));
        if (!utils_1.isDefined(builder._attachment))
            throw new Error("Must provide attachment");
        this.appendages.push(builder._attachment);
        if (!utils_1.isDefined(builder._feeHQT))
            this.feeHQT = builder._attachment.getFee();
        if (builder._message)
            this.appendages.push(builder._message);
        if (builder._encryptedMessage)
            this.appendages.push(builder._encryptedMessage);
        if (builder._publicKeyAnnouncement)
            this.appendages.push(builder._publicKeyAnnouncement);
        if (builder._encryptToSelfMessage)
            this.appendages.push(builder._encryptToSelfMessage);
        if (builder._privateNameAnnouncement)
            this.appendages.push(builder._privateNameAnnouncement);
        if (builder._privateNameAssignment)
            this.appendages.push(builder._privateNameAssignment);
        if (builder._publicNameAnnouncement)
            this.appendages.push(builder._publicNameAnnouncement);
        if (builder._publicNameAssignment)
            this.appendages.push(builder._publicNameAssignment);
        this.appendagesSize = 0;
        this.appendages.forEach(function (appendage) {
            _this.appendagesSize += appendage.getSize();
        });
        if (builder._signature && secretPhrase != null)
            throw new Error("Transaction is already signed");
        else if (secretPhrase) {
            var unsignedBytes = this.getUnsignedBytes();
            var unsignedHex = converters_1.byteArrayToHexString(unsignedBytes);
            var signatureHex = crypto_1.signBytes(unsignedHex, converters_1.stringToHexString(secretPhrase));
            if (signatureHex)
                this.signature = converters_1.hexStringToByteArray(signatureHex);
            else
                throw new Error("Could not create signature");
        }
    }
    TransactionImpl.prototype.getSignature = function () {
        return this.signature;
    };
    TransactionImpl.prototype.getUnsignedBytes = function () {
        var bytesHex = this.getBytesAsHex();
        var bytes = converters_1.hexStringToByteArray(bytesHex);
        return this.zeroSignature(bytes);
    };
    TransactionImpl.prototype.getSize = function () {
        return this.signatureOffset() + 64 + 4 + 4 + 8 + this.appendagesSize;
    };
    TransactionImpl.prototype.getFlags = function () {
        var flags = 0;
        var position = 1;
        if (this.message)
            flags |= position;
        position <<= 1;
        if (this.encryptedMessage != null)
            flags |= position;
        position <<= 1;
        if (this.publicKeyAnnouncement != null)
            flags |= position;
        position <<= 1;
        if (this.encryptToSelfMessage != null)
            flags |= position;
        position <<= 1;
        if (this.privateNameAnnouncement != null)
            flags |= position;
        position <<= 1;
        if (this.privateNameAssignment != null)
            flags |= position;
        position <<= 1;
        if (this.publicNameAnnouncement != null)
            flags |= position;
        position <<= 1;
        if (this.publicNameAssignment != null)
            flags |= position;
        return flags;
    };
    TransactionImpl.prototype.signatureOffset = function () {
        return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8;
    };
    TransactionImpl.prototype.zeroSignature = function (bytes) {
        var start = this.signatureOffset();
        for (var i = start; i < start + 64; i++) {
            bytes[i] = 0;
        }
        return bytes;
    };
    TransactionImpl.prototype.getByteBuffer = function () {
        var size = this.getSize();
        if (this.isTestnet)
            size += 8;
        var buffer = bytebuffer_1.default.allocate(size).order(bytebuffer_1.default.LITTLE_ENDIAN);
        buffer.writeByte(this.type.getType());
        buffer.writeByte((this.version << 4) | this.type.getSubtype());
        buffer.writeInt(this.timestamp);
        buffer.writeShort(this.deadline);
        for (var i = 0; i < this.senderPublicKey.length; i++)
            buffer.writeByte(this.senderPublicKey[i]);
        var recipient = long_1.default.fromString(this.type.canHaveRecipient() ? this.recipientId : "8150091319858025343", true);
        buffer.writeInt64(recipient);
        var amount = long_1.default.fromString(this.amountHQT, false);
        buffer.writeInt64(amount);
        var fee = long_1.default.fromString(this.feeHQT, false);
        buffer.writeInt64(fee);
        for (var i = 0; i < 64; i++)
            buffer.writeByte(this.signature ? this.signature[i] : 0);
        buffer.writeInt(this.getFlags());
        buffer.writeInt(this.ecBlockHeight);
        var ecBlockId = long_1.default.fromString(this.ecBlockId, true);
        buffer.writeInt64(ecBlockId);
        this.appendages.forEach(function (appendage) {
            appendage.putBytes(buffer);
        });
        if (this.genesisKey) {
            // replay on main net preventer
            this.genesisKey.forEach(function (byte) {
                buffer.writeByte(byte);
            });
        }
        buffer.flip();
        return buffer;
    };
    TransactionImpl.prototype.getBytes = function () {
        return this.getByteBuffer().buffer;
    };
    TransactionImpl.prototype.getBytesAsHex = function () {
        return this.getByteBuffer().toHex();
    };
    TransactionImpl.prototype.getRaw = function () {
        var raw = {};
        raw["type"] = this.type.getType();
        raw["subtype"] = this.type.getSubtype();
        raw["version"] = this.version;
        raw["timestamp"] = this.timestamp;
        raw["deadline"] = this.deadline;
        raw["senderPublicKey"] = this.senderPublicKey ? Buffer.from(this.senderPublicKey) : Buffer.allocUnsafeSlow(0);
        raw["recipientId"] = long_1.default.fromString(this.recipientId, true);
        raw["amountHQT"] = long_1.default.fromString(this.amountHQT);
        raw["feeHQT"] = long_1.default.fromString(this.feeHQT);
        raw["signature"] = this.signature ? Buffer.from(this.signature) : Buffer.allocUnsafeSlow(0);
        raw["flags"] = this.getFlags();
        raw["ecBlockHeight"] = this.ecBlockHeight;
        raw["ecBlockId"] = long_1.default.fromString(this.ecBlockId, true);
        var attachment = this.appendages[0];
        if (attachment.getSize() > 0) {
            var attachmentBytes = bytebuffer_1.default.allocate(attachment.getSize()).order(bytebuffer_1.default.LITTLE_ENDIAN);
            attachment.putBytes(attachmentBytes);
            raw["attachmentBytes"] = Buffer.from(attachmentBytes.buffer);
        }
        else {
            raw["attachmentBytes"] = Buffer.allocUnsafeSlow(0);
        }
        var totalSize = 0;
        for (var i = 1; i < this.appendages.length; i++) {
            totalSize += this.appendages[i].getSize();
        }
        if (totalSize > 0) {
            var appendixBytes = bytebuffer_1.default.allocate(totalSize).order(bytebuffer_1.default.LITTLE_ENDIAN);
            for (var i = 1; i < this.appendages.length; i++)
                this.appendages[i].putBytes(appendixBytes);
            raw["appendixBytes"] = Buffer.from(appendixBytes.buffer);
        }
        else {
            raw["appendixBytes"] = Buffer.allocUnsafeSlow(0);
        }
        return raw;
    };
    TransactionImpl.prototype.getJSONObject = function () {
        var json = {};
        json["type"] = this.type.getType();
        json["subtype"] = this.type.getSubtype();
        json["timestamp"] = this.timestamp;
        json["deadline"] = this.deadline;
        json["senderPublicKey"] = converters_1.byteArrayToHexString(this.senderPublicKey);
        if (this.type.canHaveRecipient()) {
            json["recipient"] = this.recipientId;
        }
        json["amount"] = this.amountHQT;
        json["fee"] = this.feeHQT;
        json["ecBlockHeight"] = this.ecBlockHeight;
        json["ecBlockId"] = this.ecBlockId;
        json["signature"] = converters_1.byteArrayToHexString(this.signature);
        var attachmentJSON = {};
        this.appendages.forEach(function (appendage) {
            utils_1.extend(attachmentJSON, appendage.getJSONObject());
        });
        if (!utils_1.isEmpty(attachmentJSON)) {
            json["attachment"] = attachmentJSON;
        }
        json["version"] = this.version;
        return json;
    };
    TransactionImpl.prototype.verifySignature = function () {
        if (!emptyArrayToNull(this.signature))
            throw new Error("Transaction is not signed");
        var signatureHex = converters_1.byteArrayToHexString(this.signature);
        var bytesHex = converters_1.byteArrayToHexString(this.getUnsignedBytes());
        var publicKeyHex = converters_1.byteArrayToHexString(this.senderPublicKey);
        return crypto_1.verifyBytes(signatureHex, bytesHex, publicKeyHex);
    };
    TransactionImpl.parseJSON = function (json, isTestnet) {
        var type = json.type;
        var subtype = json.subtype;
        var version = json.version;
        var timestamp = json.timestamp;
        var deadline = json.deadline;
        var senderPublicKey = [];
        if (json.senderPublicKey)
            senderPublicKey = converters_1.hexStringToByteArray(json.senderPublicKey);
        var recipientId = long_1.default.fromString(json.recipient, true);
        var amountHQT = long_1.default.fromString(json.amount);
        var feeHQT = long_1.default.fromString(json.fee);
        var signature = [];
        if (json.signature)
            signature = converters_1.hexStringToByteArray(json.signature);
        signature = emptyArrayToNull(signature);
        var ecBlockHeight = json.ecBlockHeight;
        var ecBlockId = long_1.default.fromString(json.ecBlockId, true);
        var transactionType = transaction_type_1.TransactionType.findTransactionType(type, subtype);
        if (!transactionType)
            throw new Error("Transaction type not implemented or undefined");
        var attachment = json.attachment;
        var builder = new Builder()
            .timestamp(timestamp)
            .version(version)
            .senderPublicKey(senderPublicKey)
            .amountHQT(amountHQT.toString())
            .feeHQT(feeHQT.toString())
            .deadline(deadline)
            .attachment(transactionType.parseAttachmentJSON(attachment))
            .timestamp(timestamp)
            .signature(signature)
            .ecBlockHeight(ecBlockHeight)
            .ecBlockId(ecBlockId.toUnsigned().toString())
            .isTestnet(!!isTestnet);
        if (transactionType.canHaveRecipient())
            builder.recipientId(recipientId.toUnsigned().toString());
        if (utils_1.isDefined(attachment["version.Message"]))
            builder.message(new appendix_1.AppendixMessage().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.EncryptedMessage"]))
            builder.encryptedMessage(new appendix_1.AppendixEncryptedMessage().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.PublicKeyAnnouncement"]))
            builder.publicKeyAnnouncement(new appendix_1.AppendixPublicKeyAnnouncement().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.EncryptToSelfMessage"]))
            builder.encryptToSelfMessage(new appendix_1.AppendixEncryptToSelfMessage().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.PrivateNameAnnouncement"]))
            builder.privateNameAnnouncement(new appendix_1.AppendixPrivateNameAnnouncement().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.PrivateNameAssignment"]))
            builder.privateNameAssignment(new appendix_1.AppendixPrivateNameAssignment().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.PublicNameAnnouncement"]))
            builder.publicNameAnnouncement(new appendix_1.AppendixPublicNameAnnouncement().parseJSON(attachment));
        if (utils_1.isDefined(attachment["version.PublicNameAssignment"]))
            builder.publicNameAssignment(new appendix_1.AppendixPublicNameAssignment().parseJSON(attachment));
        return new TransactionImpl(builder, null);
    };
    TransactionImpl.parse = function (transactionBytesHex, isTestnet) {
        var buffer = bytebuffer_1.default.wrap(transactionBytesHex, "hex", true);
        var type = buffer.readByte(); // 1
        var subtype = buffer.readByte(); // 1
        var version = (subtype & 0xf0) >> 4;
        subtype = subtype & 0x0f;
        var timestamp = buffer.readInt(); // 4
        var deadline = buffer.readShort(); // 2
        var senderPublicKey = []; // 32
        for (var i = 0; i < 32; i++)
            senderPublicKey[i] = buffer.readByte();
        var recipientId = buffer.readLong(); // 8
        var amountHQT = buffer.readLong(); // 8
        var feeHQT = buffer.readLong(); // 8
        var signature = []; // 64
        for (var i = 0; i < 64; i++)
            signature[i] = buffer.readByte();
        signature = emptyArrayToNull(signature);
        var flags = buffer.readInt(); // 4
        var ecBlockHeight = buffer.readInt(); // 4
        var ecBlockId = buffer.readLong(); // 8
        var transactionType = transaction_type_1.TransactionType.findTransactionType(type, subtype);
        if (!transactionType)
            throw new Error("Transaction type not implemented or undefined");
        var builder = new Builder()
            .version(version)
            .senderPublicKey(senderPublicKey)
            .amountHQT(amountHQT.toUnsigned().toString())
            .feeHQT(feeHQT.toUnsigned().toString())
            .deadline(deadline)
            .attachment(transactionType.parseAttachment(buffer))
            .timestamp(timestamp)
            .signature(signature)
            .ecBlockHeight(ecBlockHeight)
            .ecBlockId(ecBlockId.toUnsigned().toString());
        if (transactionType.canHaveRecipient())
            builder.recipientId(recipientId.toUnsigned().toString());
        var position = 1;
        if ((flags & position) != 0)
            builder.message(new appendix_1.AppendixMessage().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.encryptedMessage(new appendix_1.AppendixEncryptedMessage().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.publicKeyAnnouncement(new appendix_1.AppendixPublicKeyAnnouncement().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.encryptToSelfMessage(new appendix_1.AppendixEncryptToSelfMessage().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.privateNameAnnouncement(new appendix_1.AppendixPrivateNameAnnouncement().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.privateNameAssignment(new appendix_1.AppendixPrivateNameAssignment().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.publicNameAnnouncement(new appendix_1.AppendixPublicNameAnnouncement().parse(buffer));
        position <<= 1;
        if ((flags & position) != 0)
            builder.publicNameAssignment(new appendix_1.AppendixPublicNameAssignment().parse(buffer));
        if (isTestnet)
            buffer.readLong();
        return new TransactionImpl(builder, null);
    };
    return TransactionImpl;
}());
exports.TransactionImpl = TransactionImpl;
function emptyArrayToNull(array) {
    if (array == null || array == undefined)
        return null;
    for (var i = 0; i < array.length; i++) {
        if (array[i] != 0)
            return array;
    }
    return null;
}
