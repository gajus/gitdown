const expect = require('chai').expect;
const requireNew = require('require-uncached');

describe('Parser.helpers.date', () => {
  let helper;

  beforeEach(() => {
    helper = requireNew('../../src/helpers/date.js');
  });
  it('returns current UNIX timestamp', () => {
    expect(helper.compile()).to.equal(String(Math.floor(Date.now() / 1_000)));
  });
  it('uses format parameter to adjust the format', () => {
    expect(helper.compile({format: 'YYYY'})).to.equal(String(new Date().getUTCFullYear()));
  });
});
