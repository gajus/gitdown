import {
  expect,
} from 'chai';
import path from 'path';
import {
  fileURLToPath,
} from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const importFresh = (moduleName) => {
  return import(`${moduleName}?${Date.now()}`);
};

describe('Parser.helpers.include', () => {
  let helper;

  beforeEach(async () => {
    helper = (await importFresh('./../../src/helpers/include.js')).default;
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
            baseDirectory: dirname,
          };
        },
      },
    };

    expect(() => {
      helper.compile({
        file: path.join(dirname, './does-not-exist'),
      }, context);
    }).to.throw(Error, 'Input file does not exist.');
  });
});
