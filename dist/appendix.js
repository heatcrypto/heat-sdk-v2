"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendixPublicNameAssignment = exports.AppendixPublicNameAnnouncement = exports.AppendixPrivateNameAssignment = exports.AppendixPrivateNameAnnouncement = exports.AppendixPublicKeyAnnouncement = exports.AppendixEncryptToSelfMessage = exports.AppendixEncryptedMessage = exports.AbstractAppendixEncryptedMessage = exports.AppendixMessage = exports.AbstractAppendix = void 0;
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
const converters_1 = require("./converters");
const utils_1 = require("./utils");
const long_1 = __importDefault(require("long"));
const fee_1 = require("./fee");
const constants_1 = require("./constants");
const crypto_1 = require("./crypto");
class AbstractAppendix {
    constructor(buffer) {
        this.version = 1;
        if (buffer)
            this.parse(buffer);
    }
    getSize() {
        return this.getMySize() + 1;
    }
    putBytes(buffer) {
        buffer.writeByte(this.version);
        this.putMyBytes(buffer);
    }
    parse(buffer) {
        this.version = buffer.readByte();
        return this;
    }
    parseJSON(json) {
        this.version = json["version." + this.getAppendixName()];
        return this;
    }
    getJSONObject() {
        let json = {};
        json["version." + this.getAppendixName()] = this.version;
        this.putMyJSON(json);
        return json;
    }
    getVersion() {
        return this.version;
    }
}
exports.AbstractAppendix = AbstractAppendix;
class AppendixMessage extends AbstractAppendix {
    init(message, isText) {
        this.message = message;
        this.isText = isText;
        return this;
    }
    getFee() {
        return fee_1.Fee.MESSAGE_APPENDIX_FEE;
    }
    getAppendixName() {
        return "Message";
    }
    getMySize() {
        return 4 + this.message.length;
    }
    parse(buffer) {
        super.parse(buffer);
        let messageLength = buffer.readInt();
        this.isText = messageLength < 0;
        if (messageLength < 0)
            messageLength &= constants_1.MAX_INT32;
        this.message = [];
        for (let i = 0; i < messageLength; i++)
            this.message.push(buffer.readByte());
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt(this.isText ? this.message.length | constants_1.MIN_INT32 : this.message.length);
        this.message.forEach(byte => {
            buffer.writeByte(byte);
        });
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.isText = json["messageIsText"];
        this.message = this.isText
            ? converters_1.stringToByteArray(json["message"])
            : converters_1.hexStringToByteArray(json["message"]);
        return this;
    }
    putMyJSON(json) {
        json["message"] = this.isText
            ? converters_1.byteArrayToString(this.message)
            : converters_1.byteArrayToHexString(this.message);
        json["messageIsText"] = this.isText;
    }
    getMessage() {
        return this.message;
    }
    getIsText() {
        return this.isText;
    }
}
exports.AppendixMessage = AppendixMessage;
class AbstractAppendixEncryptedMessage extends AbstractAppendix {
    init(message, isText) {
        this.encryptedMessage = message;
        this.isText_ = isText;
        return this;
    }
    getFee() {
        return fee_1.Fee.ENCRYPTED_MESSAGE_APPENDIX_FEE;
    }
    getMySize() {
        return 4 + this.encryptedMessage.data.length + this.encryptedMessage.nonce.length;
    }
    parse(buffer) {
        super.parse(buffer);
        let length = buffer.readInt32();
        this.isText_ = length < 0;
        if (length < 0)
            length &= constants_1.MAX_INT32;
        if (length == 0) {
            this.encryptedMessage = {
                isText: this.isText_,
                data: "",
                nonce: ""
            };
            return this;
        }
        if (length > constants_1.MAX_ENCRYPTED_MESSAGE_LENGTH)
            throw new Error("Max encrypted data length exceeded: " + length);
        let messageBytes = new Array(length);
        for (let i = 0; i < length; i++)
            messageBytes[i] = buffer.readByte();
        let nonceBytes = new Array(32);
        for (let i = 0; i < 32; i++)
            nonceBytes[i] = buffer.readByte();
        this.encryptedMessage = {
            isText: this.isText_,
            data: converters_1.byteArrayToHexString(messageBytes),
            nonce: converters_1.byteArrayToHexString(nonceBytes)
        };
        return this;
    }
    putMyBytes(buffer) {
        let messageBytes = converters_1.hexStringToByteArray(this.encryptedMessage.data);
        let length = messageBytes.length;
        buffer.writeInt32(this.isText_ ? length | constants_1.MIN_INT32 : length);
        messageBytes.forEach(byte => {
            buffer.writeByte(byte);
        });
        converters_1.hexStringToByteArray(this.encryptedMessage.nonce).forEach(byte => {
            buffer.writeByte(byte);
        });
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.isText_ = json["isText"];
        this.encryptedMessage = {
            isText: this.isText_,
            data: json["data"],
            nonce: json["nonce"]
        };
        return this;
    }
    putMyJSON(json) {
        json["data"] = this.encryptedMessage.data;
        json["nonce"] = this.encryptedMessage.nonce;
        json["isText"] = this.isText;
    }
    isText() {
        return this.isText_;
    }
}
exports.AbstractAppendixEncryptedMessage = AbstractAppendixEncryptedMessage;
class AppendixEncryptedMessage extends AbstractAppendixEncryptedMessage {
    getAppendixName() {
        return "EncryptedMessage";
    }
    parseJSON(json) {
        super.parseJSON(json["encryptedMessage"]);
        return this;
    }
    putMyJSON(json) {
        super.putMyJSON(json);
        json["encryptedMessage"] = json;
    }
}
exports.AppendixEncryptedMessage = AppendixEncryptedMessage;
class AppendixEncryptToSelfMessage extends AbstractAppendixEncryptedMessage {
    getAppendixName() {
        return "EncryptToSelfMessage";
    }
    parseJSON(json) {
        super.parseJSON(json["encryptToSelfMessage"]);
        return this;
    }
    putMyJSON(json) {
        super.putMyJSON(json);
        json["encryptToSelfMessage"] = json;
    }
}
exports.AppendixEncryptToSelfMessage = AppendixEncryptToSelfMessage;
class AppendixPublicKeyAnnouncement extends AbstractAppendix {
    init(publicKey) {
        this.publicKey = publicKey;
        return this;
    }
    parse(buffer) {
        super.parse(buffer);
        this.publicKey = utils_1.readBytes(buffer, 32);
        return this;
    }
    getFee() {
        return fee_1.Fee.PUBLICKEY_ANNOUNCEMENT_APPENDIX_FEE;
    }
    getAppendixName() {
        return "PublicKeyAnnouncement";
    }
    getMySize() {
        return 32;
    }
    putMyBytes(buffer) {
        utils_1.writeBytes(buffer, this.publicKey);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.publicKey = converters_1.hexStringToByteArray(json["recipientPublicKey"]);
        return this;
    }
    putMyJSON(json) {
        json["recipientPublicKey"] = converters_1.byteArrayToHexString(this.publicKey);
    }
}
exports.AppendixPublicKeyAnnouncement = AppendixPublicKeyAnnouncement;
class AppendixPrivateNameAnnouncement extends AbstractAppendix {
    getFee() {
        return fee_1.Fee.PRIVATE_NAME_ANNOUNCEMENT_APPENDIX_FEE;
    }
    getAppendixName() {
        return "PrivateNameAnnouncement";
    }
    getMySize() {
        return 8;
    }
    putMyBytes(buffer) { }
    putMyJSON(json) { }
    getName() {
        return this.privateNameAnnouncement;
    }
}
exports.AppendixPrivateNameAnnouncement = AppendixPrivateNameAnnouncement;
class AppendixPrivateNameAssignment extends AbstractAppendix {
    getFee() {
        return fee_1.Fee.PRIVATE_NAME_ASSIGNEMENT_APPENDIX_FEE;
    }
    getAppendixName() {
        return "PrivateNameAssignment";
    }
    getMySize() {
        return 8 + 64;
    }
    parse(buffer) {
        super.parse(buffer);
        this.privateNameAssignment = buffer.readInt64();
        this.signature = utils_1.readBytes(buffer, 64);
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeInt64(this.privateNameAssignment);
        utils_1.writeBytes(buffer, this.signature);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.privateNameAssignment = long_1.default.fromString(json["privateNameAssignment"], true);
        this.signature = converters_1.hexStringToByteArray(json["signature"]);
        return this;
    }
    putMyJSON(json) {
        json["privateNameAssignment"] = this.privateNameAssignment.toUnsigned().toString();
        json["signature"] = converters_1.byteArrayToHexString(this.signature);
    }
    getName() {
        return this.privateNameAssignment;
    }
}
exports.AppendixPrivateNameAssignment = AppendixPrivateNameAssignment;
class AppendixPublicNameAnnouncement extends AbstractAppendix {
    getFee() {
        return fee_1.Fee.PUBLIC_NAME_ANNOUNCEMENT_APPENDIX_FEE;
    }
    getAppendixName() {
        return "PublicNameAnnouncement";
    }
    getMySize() {
        return 1 + this.publicNameAnnouncement.length;
    }
    putMyBytes(buffer) { }
    putMyJSON(json) { }
    getFullName() {
        return this.publicNameAnnouncement;
    }
    getNameHash() {
        return this.nameHash;
    }
}
exports.AppendixPublicNameAnnouncement = AppendixPublicNameAnnouncement;
class AppendixPublicNameAssignment extends AbstractAppendix {
    getFee() {
        return fee_1.Fee.PUBLIC_NAME_ASSIGNEMENT_APPENDIX_FEE;
    }
    getAppendixName() {
        return "PublicAccountNameAssignment";
    }
    getMySize() {
        return 1 + this.publicNameAssignment.length + 64;
    }
    parse(buffer) {
        super.parse(buffer);
        this.publicNameAssignment = utils_1.readBytes(buffer, buffer.readByte());
        this.signature = utils_1.readBytes(buffer, 64);
        this.nameHash = crypto_1.fullNameToLong(this.publicNameAssignment);
        return this;
    }
    putMyBytes(buffer) {
        buffer.writeByte(this.publicNameAssignment.length);
        utils_1.writeBytes(buffer, this.publicNameAssignment);
        utils_1.writeBytes(buffer, this.signature);
    }
    parseJSON(json) {
        super.parseJSON(json);
        this.publicNameAssignment = converters_1.hexStringToByteArray(json["publicNameAssignment"]);
        this.signature = converters_1.hexStringToByteArray(json["signature"]);
        this.nameHash = crypto_1.fullNameToLong(this.publicNameAssignment);
        return this;
    }
    putMyJSON(json) {
        json["publicNameAssignment"] = converters_1.byteArrayToHexString(this.publicNameAssignment);
        json["signature"] = converters_1.byteArrayToHexString(this.signature);
    }
    getFullName() {
        return this.publicNameAssignment;
    }
    getNameHash() {
        return this.nameHash;
    }
}
exports.AppendixPublicNameAssignment = AppendixPublicNameAssignment;
