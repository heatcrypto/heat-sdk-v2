const { expect } = require('chai');
const { HEAT_TRANSFER_HEAT } = require('../src');

// TODO Test is incomplete.. Have to parse the result and confirm

describe('HEAT_TRANSFER_HEAT', () => {
  it("should support 'transferHeat'", async function () {
    const key = 'privatekey',
      recipientAddress = '1234',
      recipientPublicKey = null,
      amount = '10000000',
      fee = '1000000',
      networkType = 'test',
      message = null,
      messageIsPrivate = false,
      messageIsBinary = false;
    const params = {
      key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary
    }
    // @ts-ignore
    let bytes = await HEAT_TRANSFER_HEAT(params)
    expect(bytes).to.be.string
  })
});