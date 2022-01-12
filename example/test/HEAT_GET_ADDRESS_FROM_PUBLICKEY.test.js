const { expect } = require('chai');
const { HEAT_GET_ADDRESS_FROM_PUBLICKEY } = require('../src');

describe('HEAT_GET_ADDRESS_FROM_PUBLICKEY', () => {
  it('should return an address', () => {
    const publicKeyAsHex = '29d6b689261fceae9a5e56e01c9a447e28c7fb572dde6dc8ba6f00ebca871b40'
    const address = HEAT_GET_ADDRESS_FROM_PUBLICKEY({ publicKeyAsHex })
    expect(address).to.equal('14917505173645061641')
  });
});