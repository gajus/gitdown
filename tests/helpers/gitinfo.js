import {expect} from 'chai';
import { fileURLToPath } from 'url';
import Path from 'path';

const __dirname = Path.dirname(fileURLToPath(import.meta.url));

const importFresh = (moduleName) => import(`${moduleName}?${Date.now()}`);

describe('Parser.helpers.gitinfo', () => {
  let context;
  let helper;

  beforeEach(async () => {
    helper = (await importFresh('../../src/helpers/gitinfo.js')).default;
    context = {
      gitdown: {
        getConfig: () => {
          return {
            gitinfo: {
              gitPath: __dirname,
            },
          };
        },
      },
    };
  });
  it('throws an error if config.name is not provided', () => {
    expect(() => {
      helper.compile({}, context);
    }).to.throw(Error, 'config.name must be provided.');
  });
  it('throws an error if unsupported config.name property is provided', () => {
    expect(() => {
      helper.compile({
        name: 'foo',
      }, context);
    }).to.throw(Error, 'Unexpected config.name value ("foo").');
  });
  it.skip('calls gitinfo method of the same name', () => {
    expect(helper.compile({
      name: 'name',
    }, context)).to.equal('gitdown');
  });
});
