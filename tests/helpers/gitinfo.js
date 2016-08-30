const expect = require('chai').expect;
const requireNew = require('require-new');

describe('Parser.helpers.gitinfo', () => {
  let context,
    helper;

  beforeEach(() => {
    helper = requireNew('../../src/helpers/gitinfo.js');
    context = {
      gitdown: {
        getConfig: () => {
          return {
            gitinfo: {
              gitPath: __dirname
            }
          };
        }
      }
    };
  });
  it('throws an error if config.name is not provided', () => {
    expect(() => {
      helper.compile({}, context);
    }).to.throw(Error, 'config.name must be provided.');
  });
  it('throws an error if unsupported config.name property is provided', () => {
    expect(() => {
      helper.compile({name: 'foo'}, context);
    }).to.throw(Error, 'Unexpected config.name value ("foo").');
  });
  it('calls gitinfo method of the same name', () => {
    expect(helper.compile({name: 'name'}, context)).to.equal('gitdown');
  });
});
