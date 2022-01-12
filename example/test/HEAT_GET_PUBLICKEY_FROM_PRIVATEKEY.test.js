const { expect } = require('chai');
const { HEAT_GET_PUBLICKEY_FROM_PRIVATEKEY } = require('../src');

describe('HEAT_GET_PUBLICKEY_FROM_PRIVATEKEY', () => {
  it('should return an public key', () => {
    const privateKeyAsHex = 'c7e7327f3f4dee9837a8e909945012a362022371edfbd5de5839579914de0b69'
    const publicKey = HEAT_GET_PUBLICKEY_FROM_PRIVATEKEY({privateKeyAsHex})
    expect(publicKey).to.equal('29d6b689261fceae9a5e56e01c9a447e28c7fb572dde6dc8ba6f00ebca871b40')
  });
});