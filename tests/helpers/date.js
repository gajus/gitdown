import {
  expect,
} from 'chai';

const importFresh = (moduleName) => {
  return import(`${moduleName}?${Date.now()}`);
};

describe('Parser.helpers.date', () => {
  let helper;

  beforeEach(async () => {
    helper = (await importFresh('../../src/helpers/date.js')).default;
  });
  it('returns current UNIX timestamp', () => {
    expect(helper.compile()).to.equal(String(Math.floor(Date.now() / 1_000)));
  });
  it('uses format parameter to adjust the format', () => {
    expect(helper.compile({
      format: 'YYYY',
    })).to.equal(String(new Date().getUTCFullYear()));
  });
});
