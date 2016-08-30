const path = require('path');
const expect = require('chai').expect;
const requireNew = require('require-new');

describe('Parser.helpers.include', () => {
  let helper;

  beforeEach(() => {
    helper = requireNew('./../../src/helpers/include.js');
  });
  it('is rejected with an error when config.file is not provided', () => {
    expect(() => {
      helper.compile();
    }).to.throw(Error, 'config.file must be provided.');
  });
  it('is rejected with an error when file is not found', () => {
    const context = {
      gitdown: {
        getConfig: () => {
          return {
            baseDirectory: __dirname
          };
        }
      }
    };

    expect(() => {
      helper.compile({
        file: path.join(__dirname, './does-not-exist')
      }, context);
    }).to.throw(Error, 'Input file does not exist.');
  });
});
