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
import { Builder, TransactionImpl } from "./builder"
import { isDefined, epochTime, isPublicKey } from "./utils"
import { AppendixPublicKeyAnnouncement, AppendixMessage, AppendixEncryptedMessage, AppendixEncryptToSelfMessage } from "./appendix"
import { hexStringToByteArray, stringToByteArray } from "./converters"
import { secretPhraseToPublicKey, getAccountIdFromPublicKey, encryptMessage } from "./crypto"
import { HeatSDK } from "./heat-sdk"

export class Transaction {
  private publicMessage_: string | undefined
  private privateMessage_: string | undefined
  private privateMessageToSelf_: string | undefined
  private messageIsBinary_: boolean | undefined
  private deadline_: number | undefined
  private transaction_: TransactionImpl | undefined

  constructor(
    private heatsdk: HeatSDK,
    private recipientOrRecipientPublicKey: string | null,
    private builder: Builder
  ) { }

  public sign(secretPhrase: string): Promise<Transaction> {
    return this.build(secretPhrase).then(() => {
      this.transaction_ = this.builder.build(secretPhrase)
      return this
    })
  }

  /**
   * Return signed transaction
   */
  public getTransaction() {
    if (!isDefined(this.transaction_)) throw new Error("Must call sign() first")
    return this.transaction_
  }

  private build(secretPhrase: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.builder
        .deadline(isDefined(this.deadline_) ? this.deadline_! : 1440)
        .timestamp(epochTime())
        .ecBlockHeight(1)
        .ecBlockId("0")

      let recipientPublicKeyHex
      if (isDefined(this.privateMessageToSelf_))
        recipientPublicKeyHex = secretPhraseToPublicKey(secretPhrase)

      if (!recipientPublicKeyHex)
        recipientPublicKeyHex = isPublicKey(this.recipientOrRecipientPublicKey!)
          ? this.recipientOrRecipientPublicKey
          : null

      if (recipientPublicKeyHex) {
        this.builder
          .publicKeyAnnouncement(
            new AppendixPublicKeyAnnouncement().init(
              hexStringToByteArray(recipientPublicKeyHex)
            )
          )
          .recipientId(getAccountIdFromPublicKey(recipientPublicKeyHex))
      } else {
        this.builder.recipientId(this.recipientOrRecipientPublicKey!)
      }

      if (isDefined(this.publicMessage_)) {
        let a = new AppendixMessage().init(
          this.messageIsBinary_
            ? hexStringToByteArray(this.publicMessage_!)
            : stringToByteArray(this.publicMessage_!),
          !this.messageIsBinary_
        )
        this.builder.message(a)
      } else {
        let isPrivate = isDefined(this.privateMessage_)
        let isPrivateToSelf = isDefined(this.privateMessageToSelf_)
        if (isPrivate || isPrivateToSelf) {
          if (!recipientPublicKeyHex) throw new Error("Recipient public key not provided")
          encryptMessage(
            isPrivate ? this.privateMessage_! : this.privateMessageToSelf_!,
            recipientPublicKeyHex,
            secretPhrase
          )
            .then(encryptedMessage => {
              let a = (isPrivate
                ? new AppendixEncryptedMessage()
                : new AppendixEncryptToSelfMessage()
              ).init(encryptedMessage, !this.messageIsBinary_)
              this.builder.encryptToSelfMessage(a)
              resolve() // resolve in encryptMessage callback
            })
            .catch(reject)
          return // exit here to not touch the final resolve
        }
      }
      resolve()
    })
  }

  private hasMessage() {
    return (
      isDefined(this.publicMessage_) ||
      isDefined(this.privateMessage_) ||
      isDefined(this.privateMessageToSelf_)
    )
  }

  public publicMessage(message: string, isBinary?: boolean) {
    if (this.hasMessage()) throw new Error("Transaction already has a message")
    this.messageIsBinary_ = !!isBinary
    this.publicMessage_ = message
    return this
  }

  public privateMessage(message: string, isBinary?: boolean) {
    if (this.hasMessage()) throw new Error("Transaction already has a message")
    this.messageIsBinary_ = !!isBinary
    this.privateMessage_ = message
    return this
  }

  public privateMessageToSelf(message: string, isBinary?: boolean) {
    if (this.hasMessage()) throw new Error("Transaction already has a message")
    this.messageIsBinary_ = !!isBinary
    this.privateMessageToSelf_ = message
    return this
  }

  public deadline(deadline: number) {
    this.deadline_ = deadline
    return this
  }
}
