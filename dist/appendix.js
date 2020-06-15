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
var converters_1 = require("./converters");
var utils_1 = require("./utils");
var long_1 = __importDefault(require("long"));
var fee_1 = require("./fee");
var constants_1 = require("./constants");
var crypto_1 = require("./crypto");
var AbstractAppendix = /** @class */ (function () {
    function AbstractAppendix(buffer) {
        this.version = 1;
        if (buffer)
            this.parse(buffer);
    }
    AbstractAppendix.prototype.getSize = function () {
        return this.getMySize() + 1;
    };
    AbstractAppendix.prototype.putBytes = function (buffer) {
        buffer.writeByte(this.version);
        this.putMyBytes(buffer);
    };
    AbstractAppendix.prototype.parse = function (buffer) {
        this.version = buffer.readByte();
        return this;
    };
    AbstractAppendix.prototype.parseJSON = function (json) {
        this.version = json["version." + this.getAppendixName()];
        return this;
    };
    AbstractAppendix.prototype.getJSONObject = function () {
        var json = {};
        json["version." + this.getAppendixName()] = this.version;
        this.putMyJSON(json);
        return json;
    };
    AbstractAppendix.prototype.getVersion = function () {
        return this.version;
    };
    return AbstractAppendix;
}());
exports.AbstractAppendix = AbstractAppendix;
var AppendixMessage = /** @class */ (function (_super) {
    __extends(AppendixMessage, _super);
    function AppendixMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixMessage.prototype.init = function (message, isText) {
        this.message = message;
        this.isText = isText;
        return this;
    };
    AppendixMessage.prototype.getFee = function () {
        return fee_1.Fee.MESSAGE_APPENDIX_FEE;
    };
    AppendixMessage.prototype.getAppendixName = function () {
        return "Message";
    };
    AppendixMessage.prototype.getMySize = function () {
        return 4 + this.message.length;
    };
    AppendixMessage.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        var messageLength = buffer.readInt();
        this.isText = messageLength < 0;
        if (messageLength < 0)
            messageLength &= constants_1.MAX_INT32;
        this.message = [];
        for (var i = 0; i < messageLength; i++)
            this.message.push(buffer.readByte());
        return this;
    };
    AppendixMessage.prototype.putMyBytes = function (buffer) {
        buffer.writeInt(this.isText ? this.message.length | constants_1.MIN_INT32 : this.message.length);
        this.message.forEach(function (byte) {
            buffer.writeByte(byte);
        });
    };
    AppendixMessage.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.isText = json["messageIsText"];
        this.message = this.isText
            ? converters_1.stringToByteArray(json["message"])
            : converters_1.hexStringToByteArray(json["message"]);
        return this;
    };
    AppendixMessage.prototype.putMyJSON = function (json) {
        json["message"] = this.isText
            ? converters_1.byteArrayToString(this.message)
            : converters_1.byteArrayToHexString(this.message);
        json["messageIsText"] = this.isText;
    };
    AppendixMessage.prototype.getMessage = function () {
        return this.message;
    };
    AppendixMessage.prototype.getIsText = function () {
        return this.isText;
    };
    return AppendixMessage;
}(AbstractAppendix));
exports.AppendixMessage = AppendixMessage;
var AbstractAppendixEncryptedMessage = /** @class */ (function (_super) {
    __extends(AbstractAppendixEncryptedMessage, _super);
    function AbstractAppendixEncryptedMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractAppendixEncryptedMessage.prototype.init = function (message, isText) {
        this.encryptedMessage = message;
        this.isText_ = isText;
        return this;
    };
    AbstractAppendixEncryptedMessage.prototype.getFee = function () {
        return fee_1.Fee.ENCRYPTED_MESSAGE_APPENDIX_FEE;
    };
    AbstractAppendixEncryptedMessage.prototype.getMySize = function () {
        return 4 + this.encryptedMessage.data.length + this.encryptedMessage.nonce.length;
    };
    AbstractAppendixEncryptedMessage.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        var length = buffer.readInt32();
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
        var messageBytes = new Array(length);
        for (var i = 0; i < length; i++)
            messageBytes[i] = buffer.readByte();
        var nonceBytes = new Array(32);
        for (var i = 0; i < 32; i++)
            nonceBytes[i] = buffer.readByte();
        this.encryptedMessage = {
            isText: this.isText_,
            data: converters_1.byteArrayToHexString(messageBytes),
            nonce: converters_1.byteArrayToHexString(nonceBytes)
        };
        return this;
    };
    AbstractAppendixEncryptedMessage.prototype.putMyBytes = function (buffer) {
        var messageBytes = converters_1.hexStringToByteArray(this.encryptedMessage.data);
        var length = messageBytes.length;
        buffer.writeInt32(this.isText_ ? length | constants_1.MIN_INT32 : length);
        messageBytes.forEach(function (byte) {
            buffer.writeByte(byte);
        });
        converters_1.hexStringToByteArray(this.encryptedMessage.nonce).forEach(function (byte) {
            buffer.writeByte(byte);
        });
    };
    AbstractAppendixEncryptedMessage.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.isText_ = json["isText"];
        this.encryptedMessage = {
            isText: this.isText_,
            data: json["data"],
            nonce: json["nonce"]
        };
        return this;
    };
    AbstractAppendixEncryptedMessage.prototype.putMyJSON = function (json) {
        json["data"] = this.encryptedMessage.data;
        json["nonce"] = this.encryptedMessage.nonce;
        json["isText"] = this.isText;
    };
    AbstractAppendixEncryptedMessage.prototype.isText = function () {
        return this.isText_;
    };
    return AbstractAppendixEncryptedMessage;
}(AbstractAppendix));
exports.AbstractAppendixEncryptedMessage = AbstractAppendixEncryptedMessage;
var AppendixEncryptedMessage = /** @class */ (function (_super) {
    __extends(AppendixEncryptedMessage, _super);
    function AppendixEncryptedMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixEncryptedMessage.prototype.getAppendixName = function () {
        return "EncryptedMessage";
    };
    AppendixEncryptedMessage.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json["encryptedMessage"]);
        return this;
    };
    AppendixEncryptedMessage.prototype.putMyJSON = function (json) {
        _super.prototype.putMyJSON.call(this, json);
        json["encryptedMessage"] = json;
    };
    return AppendixEncryptedMessage;
}(AbstractAppendixEncryptedMessage));
exports.AppendixEncryptedMessage = AppendixEncryptedMessage;
var AppendixEncryptToSelfMessage = /** @class */ (function (_super) {
    __extends(AppendixEncryptToSelfMessage, _super);
    function AppendixEncryptToSelfMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixEncryptToSelfMessage.prototype.getAppendixName = function () {
        return "EncryptToSelfMessage";
    };
    AppendixEncryptToSelfMessage.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json["encryptToSelfMessage"]);
        return this;
    };
    AppendixEncryptToSelfMessage.prototype.putMyJSON = function (json) {
        _super.prototype.putMyJSON.call(this, json);
        json["encryptToSelfMessage"] = json;
    };
    return AppendixEncryptToSelfMessage;
}(AbstractAppendixEncryptedMessage));
exports.AppendixEncryptToSelfMessage = AppendixEncryptToSelfMessage;
var AppendixPublicKeyAnnouncement = /** @class */ (function (_super) {
    __extends(AppendixPublicKeyAnnouncement, _super);
    function AppendixPublicKeyAnnouncement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixPublicKeyAnnouncement.prototype.init = function (publicKey) {
        this.publicKey = publicKey;
        return this;
    };
    AppendixPublicKeyAnnouncement.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.publicKey = utils_1.readBytes(buffer, 32);
        return this;
    };
    AppendixPublicKeyAnnouncement.prototype.getFee = function () {
        return fee_1.Fee.PUBLICKEY_ANNOUNCEMENT_APPENDIX_FEE;
    };
    AppendixPublicKeyAnnouncement.prototype.getAppendixName = function () {
        return "PublicKeyAnnouncement";
    };
    AppendixPublicKeyAnnouncement.prototype.getMySize = function () {
        return 32;
    };
    AppendixPublicKeyAnnouncement.prototype.putMyBytes = function (buffer) {
        utils_1.writeBytes(buffer, this.publicKey);
    };
    AppendixPublicKeyAnnouncement.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.publicKey = converters_1.hexStringToByteArray(json["recipientPublicKey"]);
        return this;
    };
    AppendixPublicKeyAnnouncement.prototype.putMyJSON = function (json) {
        json["recipientPublicKey"] = converters_1.byteArrayToHexString(this.publicKey);
    };
    return AppendixPublicKeyAnnouncement;
}(AbstractAppendix));
exports.AppendixPublicKeyAnnouncement = AppendixPublicKeyAnnouncement;
var AppendixPrivateNameAnnouncement = /** @class */ (function (_super) {
    __extends(AppendixPrivateNameAnnouncement, _super);
    function AppendixPrivateNameAnnouncement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixPrivateNameAnnouncement.prototype.getFee = function () {
        return fee_1.Fee.PRIVATE_NAME_ANNOUNCEMENT_APPENDIX_FEE;
    };
    AppendixPrivateNameAnnouncement.prototype.getAppendixName = function () {
        return "PrivateNameAnnouncement";
    };
    AppendixPrivateNameAnnouncement.prototype.getMySize = function () {
        return 8;
    };
    AppendixPrivateNameAnnouncement.prototype.putMyBytes = function (buffer) { };
    AppendixPrivateNameAnnouncement.prototype.putMyJSON = function (json) { };
    AppendixPrivateNameAnnouncement.prototype.getName = function () {
        return this.privateNameAnnouncement;
    };
    return AppendixPrivateNameAnnouncement;
}(AbstractAppendix));
exports.AppendixPrivateNameAnnouncement = AppendixPrivateNameAnnouncement;
var AppendixPrivateNameAssignment = /** @class */ (function (_super) {
    __extends(AppendixPrivateNameAssignment, _super);
    function AppendixPrivateNameAssignment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixPrivateNameAssignment.prototype.getFee = function () {
        return fee_1.Fee.PRIVATE_NAME_ASSIGNEMENT_APPENDIX_FEE;
    };
    AppendixPrivateNameAssignment.prototype.getAppendixName = function () {
        return "PrivateNameAssignment";
    };
    AppendixPrivateNameAssignment.prototype.getMySize = function () {
        return 8 + 64;
    };
    AppendixPrivateNameAssignment.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.privateNameAssignment = buffer.readInt64();
        this.signature = utils_1.readBytes(buffer, 64);
        return this;
    };
    AppendixPrivateNameAssignment.prototype.putMyBytes = function (buffer) {
        buffer.writeInt64(this.privateNameAssignment);
        utils_1.writeBytes(buffer, this.signature);
    };
    AppendixPrivateNameAssignment.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.privateNameAssignment = long_1.default.fromString(json["privateNameAssignment"], true);
        this.signature = converters_1.hexStringToByteArray(json["signature"]);
        return this;
    };
    AppendixPrivateNameAssignment.prototype.putMyJSON = function (json) {
        json["privateNameAssignment"] = this.privateNameAssignment.toUnsigned().toString();
        json["signature"] = converters_1.byteArrayToHexString(this.signature);
    };
    AppendixPrivateNameAssignment.prototype.getName = function () {
        return this.privateNameAssignment;
    };
    return AppendixPrivateNameAssignment;
}(AbstractAppendix));
exports.AppendixPrivateNameAssignment = AppendixPrivateNameAssignment;
var AppendixPublicNameAnnouncement = /** @class */ (function (_super) {
    __extends(AppendixPublicNameAnnouncement, _super);
    function AppendixPublicNameAnnouncement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixPublicNameAnnouncement.prototype.getFee = function () {
        return fee_1.Fee.PUBLIC_NAME_ANNOUNCEMENT_APPENDIX_FEE;
    };
    AppendixPublicNameAnnouncement.prototype.getAppendixName = function () {
        return "PublicNameAnnouncement";
    };
    AppendixPublicNameAnnouncement.prototype.getMySize = function () {
        return 1 + this.publicNameAnnouncement.length;
    };
    AppendixPublicNameAnnouncement.prototype.putMyBytes = function (buffer) { };
    AppendixPublicNameAnnouncement.prototype.putMyJSON = function (json) { };
    AppendixPublicNameAnnouncement.prototype.getFullName = function () {
        return this.publicNameAnnouncement;
    };
    AppendixPublicNameAnnouncement.prototype.getNameHash = function () {
        return this.nameHash;
    };
    return AppendixPublicNameAnnouncement;
}(AbstractAppendix));
exports.AppendixPublicNameAnnouncement = AppendixPublicNameAnnouncement;
var AppendixPublicNameAssignment = /** @class */ (function (_super) {
    __extends(AppendixPublicNameAssignment, _super);
    function AppendixPublicNameAssignment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendixPublicNameAssignment.prototype.getFee = function () {
        return fee_1.Fee.PUBLIC_NAME_ASSIGNEMENT_APPENDIX_FEE;
    };
    AppendixPublicNameAssignment.prototype.getAppendixName = function () {
        return "PublicAccountNameAssignment";
    };
    AppendixPublicNameAssignment.prototype.getMySize = function () {
        return 1 + this.publicNameAssignment.length + 64;
    };
    AppendixPublicNameAssignment.prototype.parse = function (buffer) {
        _super.prototype.parse.call(this, buffer);
        this.publicNameAssignment = utils_1.readBytes(buffer, buffer.readByte());
        this.signature = utils_1.readBytes(buffer, 64);
        this.nameHash = crypto_1.fullNameToLong(this.publicNameAssignment);
        return this;
    };
    AppendixPublicNameAssignment.prototype.putMyBytes = function (buffer) {
        buffer.writeByte(this.publicNameAssignment.length);
        utils_1.writeBytes(buffer, this.publicNameAssignment);
        utils_1.writeBytes(buffer, this.signature);
    };
    AppendixPublicNameAssignment.prototype.parseJSON = function (json) {
        _super.prototype.parseJSON.call(this, json);
        this.publicNameAssignment = converters_1.hexStringToByteArray(json["publicNameAssignment"]);
        this.signature = converters_1.hexStringToByteArray(json["signature"]);
        this.nameHash = crypto_1.fullNameToLong(this.publicNameAssignment);
        return this;
    };
    AppendixPublicNameAssignment.prototype.putMyJSON = function (json) {
        json["publicNameAssignment"] = converters_1.byteArrayToHexString(this.publicNameAssignment);
        json["signature"] = converters_1.byteArrayToHexString(this.signature);
    };
    AppendixPublicNameAssignment.prototype.getFullName = function () {
        return this.publicNameAssignment;
    };
    AppendixPublicNameAssignment.prototype.getNameHash = function () {
        return this.nameHash;
    };
    return AppendixPublicNameAssignment;
}(AbstractAppendix));
exports.AppendixPublicNameAssignment = AppendixPublicNameAssignment;
