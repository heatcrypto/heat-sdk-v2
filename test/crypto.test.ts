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
import "./jasmine"
import { calculateStringHash, calculateFullHash, fullNameToHash, fullNameToLong, calculateTransactionId, secretPhraseToPublicKey, getPrivateKey, getAccountId, getAccountIdFromPublicKey, signBytes, verifyBytes, encryptNote, decryptMessage, encryptBinaryNote, encryptMessage, passphraseEncrypt, passphraseDecrypt, random8Values, random16Values, random32Values, getPublicKeyFromPrivateKey } from "../src/crypto"
import { IEncryptOptions } from "../src/crypto"
import { hexStringToByteArray, stringToByteArray } from "../src/converters"
import * as Long from "long"

let bob = {
  secretPhrase: "floor battle paper consider stranger blind alter blur bless wrote prove cloud",
  publicKeyStr: "ef9baf978860b56d6a0d15638c9af11be687f90230ec839fad762d085fc5651a",
  privateKeyStr: "d0b857ee906717f40917f3a2c2c7e3fa0ffb3bc46edd1606b83f80bccf89065e",
  account: "2068178321230336428"
}

let alice = {
  secretPhrase: "user3",
  publicKeyStr: "4376219788e7d1946ad377196fd7103958d3d6d6618dc93d2d0d6b4f717b641d", //???
  privateKeyStr: "5860faf02b6bc6222ba5aca523560f0e364ccd8b67bee486fe8bf7c01d492c4b",
  account: "1522541402758811473"
}

describe("calculateStringHash test", () => {
  it("is a function", () => {
    expect(calculateStringHash).toBeInstanceOf(Function)
  })
  it("returns a hash", () => {
    expect(calculateStringHash("hello world")).toBe(
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    )
  })
})

describe("calculateFullHash test", () => {
  it("is a function", () => {
    expect(calculateFullHash).toBeInstanceOf(Function)
  })
  it("returns a full hash", () => {
    // testnet transaction: 4879568308965317604, TRANSFER HEAT From 4644748344150906433 to 4729421738299387565 amount 0.20000000 HEAT
    expect(
      calculateFullHash(
        "001015e33607a005b27b12f1982c6c57da981a4dcefe2ae75b00f0665b813e1b634c0b716e48524dad6e58700348a241002d31010000000040420f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000004a800300397775e7050e6bd60001cfa1a9c50f968a5679afc1bf655a57c304303b0ebb8e1bb47ef9d466494ac117ffffffffffffff7f",
        "f011760e7223ebd198ab1f482e594136583e80ab77d431800379a4510019450cda62b822c637806283d192134650a43f96b81354b2d5f8a9c9b0463440be20dc"
      )
    ).toBe("e49b212186b5b743b48c215a99e35bfe0c676dd5eb93bcea52e8026de896ce30")
  })
})

describe("fullNameToHash test", () => {
  it("is a function", () => {
    expect(fullNameToHash).toBeInstanceOf(Function)
  })
  it("returns a full name hash", () => {
    expect(fullNameToHash("oskol@heatwallet.com")).toBe("8932144534527668929")
  })
})

describe("fullNameToLong test", () => {
  it("is a function", () => {
    expect(fullNameToLong).toBeInstanceOf(Function)
  })
  it("returns a full name hash", () => {
    let bytes = stringToByteArray("oskol@heatwallet.com")
    expect(fullNameToLong(bytes)).toEqual(Long.fromString("8932144534527668929"))
  })
})

describe("calculateTransactionId test", () => {
  it("is a function", () => {
    expect(calculateTransactionId).toBeInstanceOf(Function)
  })
  it("calculates transaction id", () => {
    expect(
      calculateTransactionId(
        "e48a89bc32b628815f0323bcf888b00ee5903baee5af0fe55600c8f0e59b0d97"
      )
    ).toBe("9306888958988880612")
  })
})

describe("secretPhraseToPublicKey test", () => {
  it("is a function", () => {
    expect(secretPhraseToPublicKey).toBeInstanceOf(Function)
  })
  it("returns public key of secret phrase", () => {
    expect(secretPhraseToPublicKey(bob.secretPhrase)).toBe(bob.publicKeyStr)
    expect(secretPhraseToPublicKey(alice.secretPhrase)).toBe(alice.publicKeyStr)
  })
})

describe("getPrivateKey test", () => {
  it("is a function", () => {
    expect(getPrivateKey).toBeInstanceOf(Function)
  })
  it("returns private key", () => {
    expect(getPrivateKey(bob.secretPhrase)).toBe(bob.privateKeyStr)
    expect(getPrivateKey(alice.secretPhrase)).toBe(alice.privateKeyStr)
  })
})

describe("getPublicKeyFromPrivateKey test", () => {
  it("is a function", () => {
    expect(getPublicKeyFromPrivateKey).toBeInstanceOf(Function)
  })
  it("returns public key", () => {
    const privateKey = 'c7e7327f3f4dee9837a8e909945012a362022371edfbd5de5839579914de0b69'
    const publicKey = '29d6b689261fceae9a5e56e01c9a447e28c7fb572dde6dc8ba6f00ebca871b40'
    const accountId = '14917505173645061641'
    expect(getPublicKeyFromPrivateKey(privateKey)).toEqual(publicKey)
    expect(getAccountIdFromPublicKey(publicKey)).toEqual(accountId)
  })
})

describe("getAccountId test", () => {
  it("is a function", () => {
    expect(getAccountId).toBeInstanceOf(Function)
  })
  it("returns account id", () => {
    expect(getAccountId(bob.secretPhrase)).toBe(bob.account)
    expect(getAccountId(alice.secretPhrase)).toBe(alice.account)
  })
})

describe("getAccountIdFromPublicKey test", () => {
  it("is a function", () => {
    expect(getAccountIdFromPublicKey).toBeInstanceOf(Function)
  })
  it("returns account id", () => {
    expect(getAccountIdFromPublicKey(bob.publicKeyStr)).toBe(bob.account)
    expect(getAccountIdFromPublicKey(alice.publicKeyStr)).toBe(alice.account)
  })
})

describe("signBytes test", () => {
  it("is a function", () => {
    expect(signBytes).toBeInstanceOf(Function)
  })
  it("sign bytes", () => {
    expect(
      signBytes(
        "0010a0ed3607a005b27b12f1982c6c57da981a4dcefe2ae75b00f0665b813e1b634c0b716e48524dac1119b939a5b31c00e1f5050000000040420f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a7800300e01292c7e82a773f00ffffffffffffff7f",
        "7573657231" /*from API: TODO pass secretphrase as string instead of HEX string, convert to hex string ourselves.*/
      )
    ).toBe(
      "8846c5e5e5ebd31a1bea3b8dd9b2a336830c262906faf21f9ca8c3a75813790ab9e0886ce865c209f8df73ce44445fcf4c7115d099335dd2c404ae3a248162de"
    )
  })
})

describe("verifyBytes test", () => {
  it("is a function", () => {
    expect(verifyBytes).toBeInstanceOf(Function)
  })
  it("verify bytes", () => {
    expect(
      verifyBytes(
        "04ddc8ca22d67bb8e65226add5a3857a64cc0d1851ea60f118a7f52968e690049bcb0ab367b2aa313a0eedcf89ca0579f9c1ff1ba7c74085227ff82d92b1daac",
        "001075ea3607a005b27b12f1982c6c57da981a4dcefe2ae75b00f0665b813e1b634c0b716e48524dac1119b939a5b31c0065cd1d0000000040420f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000086800300dd2fc17fe7ccdd5c00ffffffffffffff7f",
        "b27b12f1982c6c57da981a4dcefe2ae75b00f0665b813e1b634c0b716e48524d"
      )
    ).toBe(true)
  })
})

describe("encryptNote test", () => {
  it("is a function", () => {
    expect(encryptNote).toBeInstanceOf(Function)
  })
  it("returns encrypted note", () => {
    let text = "qwerty1 näkökenttäsi лыжи 政府信息公开发布平台"
    let options: IEncryptOptions = {
      account: bob.account,
      privateKey: hexStringToByteArray(bob.privateKeyStr),
      publicKey: hexStringToByteArray(bob.publicKeyStr)
    }
    return encryptNote(text, options, bob.secretPhrase)
      .then(encrypted => {
        let decrypted = decryptMessage(
          encrypted.message,
          encrypted.nonce,
          bob.publicKeyStr,
          bob.secretPhrase
        )
        return expect(decrypted).toBe(text)
      })
      .catch(console.error)
  })
})

describe("encryptBinaryNote test", () => {
  it("is a function", () => {
    expect(encryptBinaryNote).toBeInstanceOf(Function)
  })
  it("encrypts binary note", () => {
    let text = "qwerty1"
    let options: IEncryptOptions = {
      account: bob.account,
      privateKey: hexStringToByteArray(bob.privateKeyStr),
      publicKey: hexStringToByteArray(bob.publicKeyStr)
    }

    return encryptBinaryNote(stringToByteArray(text), options, bob.secretPhrase /*todo with true*/)
      .then(encrypted => {
        let decrypted = decryptMessage(
          encrypted.message,
          encrypted.nonce,
          bob.publicKeyStr,
          bob.secretPhrase
        )
        return expect(decrypted).toBe(text)
      })
  })
})

describe("encryptMessage, decryptMessage test", () => {
  it("is a function", () => {
    expect(encryptMessage).toBeInstanceOf(Function)
    expect(decryptMessage).toBeInstanceOf(Function)
  })
  it("encrypts, decrypts message", () => {
    let text = "qwerty ♠═~☺"
    return encryptMessage(text, bob.publicKeyStr, bob.secretPhrase).then(encrypted => {
      let decrypted = decryptMessage(
        encrypted.data,
        encrypted.nonce,
        bob.publicKeyStr,
        bob.secretPhrase
      )
      expect(encrypted.isText).toBe(true)
      return expect(decrypted).toBe(text)
    })
  })
})

describe("passphraseEncrypt, passphraseDecrypt test", () => {
  it("is a function", () => {
    expect(passphraseEncrypt).toBeInstanceOf(Function)
    expect(passphraseDecrypt).toBeInstanceOf(Function)
  })
  it("encrypts, decrypts text using passprase", () => {
    let text = "qwerty !@#$%^ 12345"
    let passphrase = "qaz plm [].,/"
    let encrypted = passphraseEncrypt(text, passphrase)
    let decrypted = passphraseDecrypt(encrypted, passphrase)

    expect(decrypted).toBe(text)
  })
})

describe("random8Values, random16Values, random32Values test", () => {
  it("are functions", () => {
    expect(random8Values).toBeInstanceOf(Function)
    expect(random16Values).toBeInstanceOf(Function)
    expect(random32Values).toBeInstanceOf(Function)
  })
  it("returns Uint8Array", () => {
    return random8Values(4).then(array => {
      expect(array).toBeInstanceOf(Uint8Array)
      return expect(array.length).toBe(4)
    })
  })
  it("returns Uint16Array", () => {
    return random16Values(4).then(array => {
      expect(array).toBeInstanceOf(Uint16Array)
      return expect(array.length).toBe(4)
    })
  })
  it("returns Uint32Array", () => {
    return random32Values(4).then(array => {
      expect(array).toBeInstanceOf(Uint32Array)
      return expect(array.length).toBe(4)
    })
  })

  it("generate randoms", () => {
    // const GROUPNUM = 8
    // const N = 1000
    // let random8 = new Uint8Array(GROUPNUM)
    // let random8Stats: number[] = new Array(GROUPNUM)
    // random8Stats.fill(0)
    // let random16: Uint16Array
    // let random16Stats: number[] = new Array(GROUPNUM)
    // random16Stats.fill(0)
    // let random32: Uint32Array
    // let random32Stats: number[] = new Array(GROUPNUM)
    // random32Stats.fill(0)
    // for (let i = 0; i < N; i++) {
    //   random8 = getRandomValues(random8)
    //   random8.map(v => random8Stats[v % GROUPNUM]++)
    //   random32 = random32Values(GROUPNUM)
    //   random32.map(v => random32Stats[v % GROUPNUM]++)
    //   random16 = random16Values(GROUPNUM)
    //   random16.map(v => random16Stats[v % GROUPNUM]++)
    // }
    // console.log(
    //   N + " random 8 bits numbers distribution in 8 groups: " + random8Stats
    // )
    // console.log(
    //   N + " random 16 bits numbers distribution in 8 groups: " + random16Stats
    // )
    // console.log(
    //   N + " random 32 bits numbers distribution in 8 groups: " + random32Stats
    // )
    // random8 = getRandomValues(random8)
    // random16 = random16Values(8)
    // random32 = random32Values(8)
    // expect(random8.length).toBe(8)
    // expect(random16.length).toBe(8)
    // expect(random32.length).toBe(8)
  })
})
