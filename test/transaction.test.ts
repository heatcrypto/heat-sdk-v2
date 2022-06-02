/*
 * The MIT License (MIT)
 * Copyright (c) 2017-2021 Heat Ledger Ltd.
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

/*
To run tests in the file  test/ts  must be actual values for 
The tests passes until the account balance has the money.
 */
import "./jasmine"
import {ASSET_1, ASSET_2, ACCOUNT_1, ACCOUNT_2} from "./testnet"
import { Configuration, HeatSDK } from "../src/heat-sdk"
import * as crypto from "../src/crypto"
import { AtomicTransfer } from "../src/attachment"
import { TransactionImpl } from "../src/builder"
import {AssetPropertiesProtocol1, IHeatBundleAssetProperties} from "../src/bundle";

/*
function handleBroadcastResult(promise: Promise<any>, done: () => {}) {
  promise
    .then((data: IBroadcastOutput) => {
      //console.log(data)
      expect(data.fullHash).toBeDefined()
      done()
    })
    .catch(reason => {
      console.error(reason)
      expect(reason).toBeUndefined()
      done()
    })
}
*/

/* the tests passes until the account balance has the money */

describe("Transaction API", () => {
  const config = new Configuration({
    isTestnet: true
    // baseURL: "http://localhost:7733/api/v1",
    // websocketURL: "ws://localhost:7755/ws/"
  })
  const heatsdk = new HeatSDK(config)

  /*it("broadcast payment", done => {
    /!* the test passes until the account balance has the money *!/
    let promise = heatsdk
      .payment("4644748344150906433", "0.001")
      .publicMessage("heat-sdk test")
      .deadline(1440 * 150)
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("broadcast arbitrary message", done => {
    const promise = heatsdk
      .arbitraryMessage("4644748344150906433", "Qwerty Йцукен")
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("broadcast private message", done => {
    const promise = heatsdk
      .privateMessage(crypto.secretPhraseToPublicKey("user1"), "Private Info")
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("broadcast private message to self", done => {
    const promise = heatsdk
      .privateMessageToSelf("Private message to self")
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("Asset Issuance", done => {
    // issue standard asset
    let promise = heatsdk
      .assetIssuance(0, "https://heatsdktest/assetN02", null, "1000", 0, true)
      .publicMessage("heat-sdk test")
      .sign(ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
    //issue private asset with expiration
    promise = heatsdk
      .assetIssuance(1, "https://heatsdktest/assetN03", null, "1000", 0, true, 444444440)
      .publicMessage("heat-sdk test")
      .sign(ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })*/

  it("Asset Issuance with properties", done => {
    // create a asset properties bundle, pass asset=0 to have the bundle replicator
    // take the asset id from the current transaction (since the asset does not exist yet)
    const assetProperties: AssetPropertiesProtocol1 = new AssetPropertiesProtocol1(
      "0", {symbol: "GLD", name: "Gold"}
    )
    const promise = heatsdk
      .assetIssuance("https://heatsdktest/assetN02", null, "1000000", 3, false, assetProperties)
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => console.log(JSON.stringify(transaction)))
  })


/*
  it("Asset Transfer", done => {
    let promise = heatsdk
      .assetTransfer(ASSET_2.ISSUER.ID, ASSET_1.ID, "4")
      .publicMessage("heat-sdk test")
      .sign(ASSET_1.ISSUER.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
    //transfer back
    promise = heatsdk
      .assetTransfer(ASSET_1.ISSUER.ID, ASSET_1.ID, "4")
      .publicMessage("heat-sdk test")
      .sign(ASSET_2.ISSUER.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("Atomic Multi Asset Transfer", done => {
    // let promise = heatsdk
    //   .atomicMultiTransfer(ASSET_2.ISSUER.ID, ASSET_1.ID, "4")
    //   .publicMessage("heat-sdk test")
    //   .sign(ASSET_1.ISSUER.SECRET_PHRASE)
    //   .then(transaction => transaction.broadcast())
    // handleResult(promise, done)
    // //transfer back
    // promise = heatsdk
    //   .assetTransfer(ASSET_1.ISSUER.ID, ASSET_1.ID, "4")
    //   .publicMessage("heat-sdk test")
    //   .sign(ASSET_2.ISSUER.SECRET_PHRASE)
    //   .then(transaction => transaction.broadcast())
    // handleResult(promise, done)

    let transfers: AtomicTransfer[] = [
      {
        quantity: "2",
        assetId: ASSET_1.ID,
        recipient: ACCOUNT_2.ID
      },
      {
        quantity: "3",
        assetId: ASSET_2.ID,
        recipient: ACCOUNT_3.ID
      },
      {
        quantity: "25",
        assetId: ASSET_1.ID,
        recipient: ACCOUNT_3.ID
      }
    ]
    let promise = heatsdk
      .atomicMultiTransfer(ACCOUNT_1.ID, transfers)
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("Asset Expiration", done => {
    let promise = heatsdk
      .assetExpiration(testnet2.ASSET_1.ID, 444444443)
      .publicMessage("heat-sdk test")
      .sign(testnet2.ASSET_1.ISSUER.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("place Ask Order", done => {
    let promise = heatsdk
      .placeAskOrder(ASSET_1.ID, ASSET_2.ID, "400000", "2000000", 3600)
      .publicMessage("heat-sdk test")
      .sign(ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    promise = heatsdk
      .placeAskOrder(ASSET_1.ID, ASSET_2.ID, "400000", "2000000", 3600)
      .publicMessage("heat-sdk test")
      .sign(ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("place Bid Order", done => {
    let promise = heatsdk
      .placeBidOrder(ASSET_1.ID, ASSET_2.ID, "400000", "2000000", 3600)
      .publicMessage("heat-sdk test")
      .sign(ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("cancel Ask Order", done => {
    heatsdk.api.get("/order/asks/0/100").then((data: any) => {
      if (data.length > 0) {
        for (let i in data) {
          let orderData = data[i]
          //search order's account. Need an order for which the account is known,
          // because the order can be cancelled by account that created it
          let account = OBJECTS_BY_ID[orderData.account]
          if (account) {
            let promise = heatsdk
              .cancelAskOrder(orderData.order)
              .publicMessage("heat-sdk test")
              .sign(account.SECRET_PHRASE)
              .then(transaction => transaction.broadcast())
            handleResult(promise, done)
            break
          }
        }
      }
      done()
    })
  })

  it("cancel Bid Order", done => {
    heatsdk.api.get("/order/bids/0/100").then((data: any) => {
      if (data.length > 0) {
        for (const i in data) {
          const orderData = data[i]
          // search order's account. Need an order for which the account is known,
          // because the order can be cancelled by account that created it
          let account = OBJECTS_BY_ID[orderData.account]
          if (account) {
            let promise = heatsdk
              .cancelBidOrder(orderData.order)
              .publicMessage("heat-sdk test")
              .sign(account.SECRET_PHRASE)
              .then(transaction => transaction.broadcast())
            handleResult(promise, done)
            break
          }
        }
      }
      done()
    })
  })
*/
})
