const { expect } = require('chai');
const {HEAT_ADDRESS_FROM_PRIVATEKEY} = require("../src")

describe('HEAT_ADDRESS_FROM_PRIVATEKEY', () => {
  it('should return an address', () => {
    const privateKey = 'c7e7327f3f4dee9837a8e909945012a362022371edfbd5de5839579914de0b69'
    const address = HEAT_ADDRESS_FROM_PRIVATEKEY({ privateKeyAsHex: privateKey})
    expect(address).to.equal('14917505173645061641')
  });
});