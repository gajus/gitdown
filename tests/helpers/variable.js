const expect = require('chai').expect;
const requireNew = require('require-uncached');

describe('Parser.helpers.variable', () => {
  let context;
  let helper;

  beforeEach(() => {
    helper = requireNew('../../src/helpers/variable.js');
    context = {
      gitdown: {
        getConfig: () => {
          return {
            variable: {
              scope: {},
            },
          };
        },
      },
    };
  });
  it('throws an error if variable name is not given', () => {
    expect(() => {
      helper.compile({}, context);
    }).to.throw(Error, 'config.name must be provided.');
  });
  it('throws an error if variable does not resolve to a defined value', () => {
    expect(() => {
      helper.compile({name: 'a.b.c'}, context);
    }).to.throw(Error, 'config.name "a.b.c" does not resolve to a defined value.');
  });
  it('returns the resolved value', () => {
    context = {
      gitdown: {
        getConfig: () => {
          return {
            variable: {
              scope: {
                foo: {
                  bar: {
                    baz: 'quux',
                  },
                },
              },
            },
          };
        },
      },
    };

    expect(helper.compile({name: 'foo.bar.baz'}, context)).to.equal('quux');
  });
});
