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
import { TransactionType } from "./transaction-type"
import { Attachment } from "./attachment"
import { AppendixMessage, AppendixEncryptedMessage, AppendixEncryptToSelfMessage, 
  AppendixPublicKeyAnnouncement, AppendixPrivateNameAnnouncement, AppendixPrivateNameAssignment, 
  AppendixPublicNameAnnouncement, AppendixPublicNameAssignment, Appendix } from "./appendix"
import { isDefined, extend, isEmpty } from "./utils"
import { hexStringToByteArray, byteArrayToHexString, stringToHexString } from "./converters"
import { secretPhraseToPublicKey, signBytes, verifyBytes } from "./crypto"
import Long from "long"
import ByteBuffer from "bytebuffer"

export class Builder {
  public _deadline = 1440
  public _senderPublicKey: Array<number> | undefined
  public _amountHQT: string | undefined
  public _feeHQT: string | undefined
  public _type: TransactionType | undefined
  public _version = 1
  public _attachment: Attachment | undefined
  public _recipientId: string | undefined
  public _signature: Array<number> | undefined
  public _message: AppendixMessage | undefined
  public _encryptedMessage: AppendixEncryptedMessage | undefined
  public _encryptToSelfMessage: AppendixEncryptToSelfMessage | undefined
  public _publicKeyAnnouncement: AppendixPublicKeyAnnouncement | undefined
  public _privateNameAnnouncement: AppendixPrivateNameAnnouncement | undefined
  public _privateNameAssignment: AppendixPrivateNameAssignment | undefined
  public _publicNameAnnouncement: AppendixPublicNameAnnouncement | undefined
  public _publicNameAssignment: AppendixPublicNameAssignment | undefined
  public _isTestnet: boolean | undefined
  public _genesisKey: Array<number> | undefined
  public _timestamp: number | undefined
  public _ecBlockHeight: number | undefined
  public _ecBlockId: string | undefined

  public deadline(deadline: number) {
    this._deadline = deadline
    return this
  }
  public senderPublicKey(senderPublicKey: Array<number>) {
    this._senderPublicKey = senderPublicKey
    return this
  }
  public amountHQT(amountHQT: string) {
    this._amountHQT = amountHQT
    return this
  }
  public feeHQT(feeHQT: string) {
    this._feeHQT = feeHQT
    return this
  }
  public version(version: number) {
    this._version = version
    return this
  }
  public attachment(attachment: Attachment) {
    this._attachment = attachment
    this._type = attachment.getTransactionType()
    return this
  }
  public recipientId(recipientId: string) {
    this._recipientId = recipientId
    return this
  }
  public signature(signature: Array<number>) {
    this._signature = signature
    return this
  }
  public message(message: AppendixMessage) {
    this._message = message
    return this
  }
  public encryptMessage(encryptedMessage: AppendixEncryptedMessage) {
    this._encryptedMessage = encryptedMessage
    return this
  }
  public encryptToSelfMessage(encryptToSelfMessage: AppendixEncryptToSelfMessage) {
    this._encryptToSelfMessage = encryptToSelfMessage
    return this
  }
  public publicKeyAnnouncement(publicKeyAnnouncement: AppendixPublicKeyAnnouncement) {
    this._publicKeyAnnouncement = publicKeyAnnouncement
    return this
  }
  public privateNameAnnouncement(
    privateNameAnnouncement: AppendixPrivateNameAnnouncement
  ) {
    this._privateNameAnnouncement = privateNameAnnouncement
    return this
  }
  public privateNameAssignment(privateNameAssignment: AppendixPrivateNameAssignment) {
    this._privateNameAssignment = privateNameAssignment
    return this
  }
  public publicNameAnnouncement(publicNameAnnouncement: AppendixPublicNameAnnouncement) {
    this._publicNameAnnouncement = publicNameAnnouncement
    return this
  }
  public publicNameAssignment(publicNameAssignment: AppendixPublicNameAssignment) {
    this._publicNameAssignment = publicNameAssignment
    return this
  }
  public isTestnet(isTestnet: boolean) {
    this._isTestnet = isTestnet
    return this
  }
  public genesisKey(genesisKey: Array<number> | undefined) {
    this._genesisKey = genesisKey
    return this
  }
  public timestamp(timestamp: number) {
    this._timestamp = timestamp
    return this
  }
  public ecBlockId(ecBlockId: string) {
    this._ecBlockId = ecBlockId
    return this
  }
  public ecBlockHeight(ecBlockHeight: number) {
    this._ecBlockHeight = ecBlockHeight
    return this
  }

  public build(secretPhrase: string): TransactionImpl {
    return new TransactionImpl(this, secretPhrase)
  }
}

export class TransactionImpl {
  private appendages: Array<Appendix>
  private appendagesSize: number
  private height = 0x7fffffff
  private signature: Array<number> | undefined
  private type: TransactionType
  private version: number
  private timestamp: number | undefined
  private deadline: number | undefined
  private senderPublicKey: Array<number> | undefined
  private recipientId: string | undefined
  private amountHQT: string | undefined
  private feeHQT: string | undefined
  private message: AppendixMessage | undefined
  private encryptedMessage: AppendixEncryptedMessage | undefined
  private encryptToSelfMessage: AppendixEncryptToSelfMessage | undefined
  private publicKeyAnnouncement: AppendixPublicKeyAnnouncement | undefined
  private privateNameAnnouncement: AppendixPrivateNameAnnouncement | undefined
  private privateNameAssignment: AppendixPrivateNameAssignment | undefined
  private publicNameAnnouncement: AppendixPublicNameAnnouncement | undefined
  private publicNameAssignment: AppendixPublicNameAssignment | undefined
  private ecBlockHeight: number | undefined
  private ecBlockId: string | undefined
  private isTestnet: boolean
  private genesisKey: Array<number> | undefined

  constructor(builder: Builder, secretPhrase: string | null) {
    this.appendages = []
    this.isTestnet = builder._isTestnet || false
    this.genesisKey = builder._genesisKey
    this.timestamp = builder._timestamp
    this.type = builder._type!
    this.version = builder._version
    this.deadline = builder._deadline
    this.senderPublicKey = builder._senderPublicKey
    this.recipientId = builder._recipientId
    this.amountHQT = builder._amountHQT
    this.feeHQT = builder._feeHQT
    this.signature = builder._signature
    this.message = builder._message
    this.encryptedMessage = builder._encryptedMessage
    this.encryptToSelfMessage = builder._encryptToSelfMessage
    this.publicKeyAnnouncement = builder._publicKeyAnnouncement
    this.privateNameAnnouncement = builder._privateNameAnnouncement
    this.privateNameAssignment = builder._privateNameAssignment
    this.publicNameAnnouncement = builder._publicNameAnnouncement
    this.publicNameAssignment = builder._publicNameAssignment
    this.ecBlockHeight = builder._ecBlockHeight
    this.ecBlockId = builder._ecBlockId
    this.senderPublicKey
    if (isDefined(builder._senderPublicKey)) this.senderPublicKey = builder._senderPublicKey
    else if (secretPhrase)
      this.senderPublicKey = hexStringToByteArray(
        secretPhraseToPublicKey(secretPhrase)
      )

    if (!isDefined(builder._attachment)) throw new Error("Must provide attachment")
    this.appendages.push(builder._attachment!)

    if (!isDefined(builder._feeHQT)) this.feeHQT = builder._attachment!.getFee()

    if (builder._message) this.appendages.push(builder._message)
    if (builder._encryptedMessage) this.appendages.push(builder._encryptedMessage)
    if (builder._publicKeyAnnouncement) this.appendages.push(builder._publicKeyAnnouncement)
    if (builder._encryptToSelfMessage) this.appendages.push(builder._encryptToSelfMessage)
    if (builder._privateNameAnnouncement) this.appendages.push(builder._privateNameAnnouncement)
    if (builder._privateNameAssignment) this.appendages.push(builder._privateNameAssignment)
    if (builder._publicNameAnnouncement) this.appendages.push(builder._publicNameAnnouncement)
    if (builder._publicNameAssignment) this.appendages.push(builder._publicNameAssignment)
    this.appendagesSize = 0
    this.appendages.forEach(appendage => {
      this.appendagesSize += appendage.getSize()
    })

    if (builder._signature && secretPhrase != null) throw new Error("Transaction is already signed")
    else if (secretPhrase) {
      let unsignedBytes = this.getUnsignedBytes()
      let unsignedHex = byteArrayToHexString(unsignedBytes)
      let signatureHex = signBytes(unsignedHex, stringToHexString(secretPhrase))
      if (signatureHex) this.signature = hexStringToByteArray(signatureHex)
      else throw new Error("Could not create signature")
    }
  }

  public getSignature() {
    return this.signature
  }

  public getUnsignedBytes(): Array<number> {
    let bytesHex = this.getBytesAsHex()
    let bytes = hexStringToByteArray(bytesHex)
    return this.zeroSignature(bytes)
  }

  private getSize() {
    return this.signatureOffset() + 64 + 4 + 4 + 8 + this.appendagesSize
  }

  private getFlags() {
    let flags = 0
    let position = 1
    if (this.message) flags |= position
    position <<= 1
    if (this.encryptedMessage != null) flags |= position
    position <<= 1
    if (this.publicKeyAnnouncement != null) flags |= position
    position <<= 1
    if (this.encryptToSelfMessage != null) flags |= position
    position <<= 1
    if (this.privateNameAnnouncement != null) flags |= position
    position <<= 1
    if (this.privateNameAssignment != null) flags |= position
    position <<= 1
    if (this.publicNameAnnouncement != null) flags |= position
    position <<= 1
    if (this.publicNameAssignment != null) flags |= position
    return flags
  }

  private signatureOffset() {
    return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8
  }

  private zeroSignature(bytes: Array<number>): Array<number> {
    let start = this.signatureOffset()
    for (let i = start; i < start + 64; i++) {
      bytes[i] = 0
    }
    return bytes
  }

  public getByteBuffer() {
    let size = this.getSize()
    if (this.isTestnet) size += 8

    let buffer = ByteBuffer.allocate(size).order(ByteBuffer.LITTLE_ENDIAN)
    buffer.writeByte(this.type.getType())
    buffer.writeByte((this.version << 4) | this.type.getSubtype())
    buffer.writeInt(this.timestamp!)
    buffer.writeShort(this.deadline!)
    for (let i = 0; i < this.senderPublicKey!.length; i++) buffer.writeByte(this.senderPublicKey![i])

    let recipient = Long.fromString(
      this.type.canHaveRecipient() ? this.recipientId! : "8150091319858025343",
      true
    )
    buffer.writeInt64(recipient)

    let amount = Long.fromString(this.amountHQT!, false)
    buffer.writeInt64(amount)

    let fee = Long.fromString(this.feeHQT!, false)
    buffer.writeInt64(fee)

    for (let i = 0; i < 64; i++) buffer.writeByte(this.signature ? this.signature[i] : 0)

    buffer.writeInt(this.getFlags())
    buffer.writeInt(this.ecBlockHeight!)

    let ecBlockId = Long.fromString(this.ecBlockId!, true)
    buffer.writeInt64(ecBlockId)

    this.appendages.forEach(appendage => {
      appendage.putBytes(buffer)
    })

    if (this.genesisKey) {
      // replay on main net preventer
      this.genesisKey.forEach(byte => {
        buffer.writeByte(byte)
      })
    }

    buffer.flip()
    return buffer
  }

  public getBytes(): Buffer {
    return this.getByteBuffer().buffer
  }

  public getBytesAsHex() {
    return this.getByteBuffer().toHex()
  }

  public getRaw() {
    let raw: any = {}
    raw["type"] = this.type.getType()
    raw["subtype"] = this.type.getSubtype()
    raw["version"] = this.version
    raw["timestamp"] = this.timestamp
    raw["deadline"] = this.deadline
    raw["senderPublicKey"] = this.senderPublicKey ? Buffer.from(this.senderPublicKey) : Buffer.allocUnsafeSlow(0)
    raw["recipientId"] = Long.fromString(this.recipientId!, true)
    raw["amountHQT"] = Long.fromString(this.amountHQT!)
    raw["feeHQT"] = Long.fromString(this.feeHQT!)
    raw["signature"] = this.signature ? Buffer.from(this.signature) : Buffer.allocUnsafeSlow(0)
    raw["flags"] = this.getFlags()
    raw["ecBlockHeight"] = this.ecBlockHeight
    raw["ecBlockId"] = Long.fromString(this.ecBlockId!, true)
    let attachment = this.appendages[0]
    if (attachment.getSize() > 0) {
      let attachmentBytes = ByteBuffer.allocate(attachment.getSize()).order(
        ByteBuffer.LITTLE_ENDIAN
      )
      attachment.putBytes(attachmentBytes)
      raw["attachmentBytes"] = Buffer.from(attachmentBytes.buffer)
    } else {
      raw["attachmentBytes"] = Buffer.allocUnsafeSlow(0)
    }
    let totalSize = 0
    for (let i = 1; i < this.appendages.length; i++) {
      totalSize += this.appendages[i].getSize()
    }
    if (totalSize > 0) {
      let appendixBytes = ByteBuffer.allocate(totalSize).order(ByteBuffer.LITTLE_ENDIAN)
      for (let i = 1; i < this.appendages.length; i++) this.appendages[i].putBytes(appendixBytes)
      raw["appendixBytes"] = Buffer.from(appendixBytes.buffer)
    } else {
      raw["appendixBytes"] = Buffer.allocUnsafeSlow(0)
    }
    return raw
  }

  public getJSONObject() {
    let json: { [key: string]: any } = {}
    json["type"] = this.type.getType()
    json["subtype"] = this.type.getSubtype()
    json["timestamp"] = this.timestamp
    json["deadline"] = this.deadline
    json["senderPublicKey"] = byteArrayToHexString(this.senderPublicKey!)
    if (this.type.canHaveRecipient()) {
      json["recipient"] = this.recipientId
    }
    json["amount"] = this.amountHQT
    json["fee"] = this.feeHQT
    json["ecBlockHeight"] = this.ecBlockHeight
    json["ecBlockId"] = this.ecBlockId
    json["signature"] = byteArrayToHexString(this.signature!)

    let attachmentJSON = {}
    this.appendages.forEach(appendage => {
      extend(attachmentJSON, appendage.getJSONObject())
    })
    if (!isEmpty(attachmentJSON)) {
      json["attachment"] = attachmentJSON
    }
    json["version"] = this.version
    return json
  }

  public verifySignature(): boolean {
    if (!emptyArrayToNull(this.signature!)) throw new Error("Transaction is not signed")
    let signatureHex = byteArrayToHexString(this.signature!)
    let bytesHex = byteArrayToHexString(this.getUnsignedBytes())
    let publicKeyHex = byteArrayToHexString(this.senderPublicKey!)
    return verifyBytes(signatureHex, bytesHex, publicKeyHex)
  }

  public static parseJSON(json: { [key: string]: any }, isTestnet?: boolean) {
    let type = json.type
    let subtype = json.subtype
    let version = json.version
    let timestamp = json.timestamp
    let deadline = json.deadline
    let senderPublicKey: number[] = []
    if (json.senderPublicKey)
      senderPublicKey = hexStringToByteArray(json.senderPublicKey)

    let recipientId = Long.fromString(json.recipient, true)
    let amountHQT = Long.fromString(json.amount)
    let feeHQT = Long.fromString(json.fee)
    let signature: number[] = []
    if (json.signature) signature = hexStringToByteArray(json.signature)
    signature = <number[]>emptyArrayToNull(signature)

    let ecBlockHeight = json.ecBlockHeight
    let ecBlockId = Long.fromString(json.ecBlockId, true)

    let transactionType = TransactionType.findTransactionType(type, subtype)
    if (!transactionType) throw new Error("Transaction type not implemented or undefined")

    let attachment = json.attachment
    let builder = new Builder()
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
      .isTestnet(!!isTestnet)
    if (transactionType.canHaveRecipient()) builder.recipientId(recipientId.toUnsigned().toString())

    if (isDefined(attachment["version.Message"]))
      builder.message(new AppendixMessage().parseJSON(attachment))
    if (isDefined(attachment["version.EncryptedMessage"]))
      builder.encryptMessage(new AppendixEncryptedMessage().parseJSON(attachment))
    if (isDefined(attachment["version.PublicKeyAnnouncement"]))
      builder.publicKeyAnnouncement(
        new AppendixPublicKeyAnnouncement().parseJSON(attachment)
      )
    if (isDefined(attachment["version.EncryptToSelfMessage"]))
      builder.encryptToSelfMessage(
        new AppendixEncryptToSelfMessage().parseJSON(attachment)
      )
    if (isDefined(attachment["version.PrivateNameAnnouncement"]))
      builder.privateNameAnnouncement(
        new AppendixPrivateNameAnnouncement().parseJSON(attachment)
      )
    if (isDefined(attachment["version.PrivateNameAssignment"]))
      builder.privateNameAssignment(
        new AppendixPrivateNameAssignment().parseJSON(attachment)
      )
    if (isDefined(attachment["version.PublicNameAnnouncement"]))
      builder.publicNameAnnouncement(
        new AppendixPublicNameAnnouncement().parseJSON(attachment)
      )
    if (isDefined(attachment["version.PublicNameAssignment"]))
      builder.publicNameAssignment(
        new AppendixPublicNameAssignment().parseJSON(attachment)
      )

    return new TransactionImpl(builder, null)
  }

  public static parse(transactionBytesHex: string, isTestnet?: boolean) {
    let buffer = ByteBuffer.wrap(transactionBytesHex, "hex", true)

    let type = buffer.readByte() // 1
    let subtype = buffer.readByte() // 1
    let version = (subtype & 0xf0) >> 4
    subtype = subtype & 0x0f
    let timestamp = buffer.readInt() // 4
    let deadline = buffer.readShort() // 2
    let senderPublicKey: number[] = [] // 32
    for (let i = 0; i < 32; i++) senderPublicKey[i] = buffer.readByte()

    let recipientId = buffer.readLong() // 8
    let amountHQT = buffer.readLong() // 8
    let feeHQT = buffer.readLong() // 8
    let signature: number[] = [] // 64
    for (let i = 0; i < 64; i++) signature[i] = buffer.readByte()
    signature = <number[]>emptyArrayToNull(signature)
    let flags = buffer.readInt() // 4
    let ecBlockHeight = buffer.readInt() // 4
    let ecBlockId = buffer.readLong() // 8

    let transactionType = TransactionType.findTransactionType(type, subtype)
    if (!transactionType) throw new Error("Transaction type not implemented or undefined")
    let builder = new Builder()
      .version(version)
      .senderPublicKey(senderPublicKey)
      .amountHQT(amountHQT.toUnsigned().toString())
      .feeHQT(feeHQT.toUnsigned().toString())
      .deadline(deadline)
      .attachment(transactionType.parseAttachment(buffer))
      .timestamp(timestamp)
      .signature(signature)
      .ecBlockHeight(ecBlockHeight)
      .ecBlockId(ecBlockId.toUnsigned().toString())
    if (transactionType.canHaveRecipient()) builder.recipientId(recipientId.toUnsigned().toString())

    let position = 1
    if ((flags & position) != 0) builder.message(new AppendixMessage().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.encryptMessage(new AppendixEncryptedMessage().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.publicKeyAnnouncement(new AppendixPublicKeyAnnouncement().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.encryptToSelfMessage(new AppendixEncryptToSelfMessage().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.privateNameAnnouncement(new AppendixPrivateNameAnnouncement().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.privateNameAssignment(new AppendixPrivateNameAssignment().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.publicNameAnnouncement(new AppendixPublicNameAnnouncement().parse(buffer))
    position <<= 1
    if ((flags & position) != 0)
      builder.publicNameAssignment(new AppendixPublicNameAssignment().parse(buffer))
    if (isTestnet) buffer.readLong()

    return new TransactionImpl(builder, null)
  }
}

function emptyArrayToNull(array: number[]) {
  if (array == null || array == undefined) return null
  for (let i = 0; i < array.length; i++) {
    if (array[i] != 0) return array
  }
  return null
}
