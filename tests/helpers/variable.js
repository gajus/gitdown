import {expect} from 'chai';
const importFresh = (moduleName) => import(`${moduleName}?${Date.now()}`);

describe('Parser.helpers.variable', () => {
  let context;
  let helper;

  beforeEach(async () => {
    helper = (await importFresh('../../src/helpers/variable.js')).default;
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
      helper.compile({
        name: 'a.b.c',
      }, context);
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

    expect(helper.compile({
      name: 'foo.bar.baz',
    }, context)).to.equal('quux');
  });
});
