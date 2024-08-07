import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Path from 'path';
import {
  fileURLToPath,
} from 'url';

const dirname = Path.dirname(fileURLToPath(import.meta.url));
const importFresh = (moduleName) => {
  return import(`${moduleName}?${Date.now()}`);
};

const {
  expect,
} = chai;

chai.use(chaiAsPromised);

describe('Parser.helpers.filesize', () => {
  let helper;

  beforeEach(async () => {
    helper = (await importFresh('./../../src/helpers/filesize.js')).default;
  });
  it('is rejected with an error when config.file is not provided', () => {
    const result = helper.compile();

    return expect(result).to.rejectedWith(Error, 'config.file must be provided.');
  });
  it('is rejected with an error when file is not found', () => {
    const result = helper.compile({
      file: '/does-not-exist',
    });

    return expect(result).to.rejectedWith(Error, 'Input file does not exist.');
  });

  it('returns formatted file size', () => {
    const result = helper.compile({
      file: Path.resolve(dirname, './../fixtures/filesize.txt'),
    });

    return expect(result).to.eventually.equal('191 B');
  });
  it('returns gziped formatted file size', () => {
    const result = helper.compile({
      file: Path.resolve(dirname, './../fixtures/filesize.txt'),
      gzip: true,
    });

    return expect(result).to.eventually.equal('145 B');
  });

  describe('.file(filename)', () => {
    it('throws an error if file is not found', () => {
      const result = helper.file(Path.resolve(dirname, './does-not-exist'));

      return expect(result).rejectedWith(Error, 'Input file does not exist.');
    });
    it('returns the file size in bytes', () => {
      const result = helper.file(Path.resolve(dirname, './../fixtures/filesize.txt'));

      return expect(result).eventually.equal(191);
    });
  });
  describe('.file(filename, true)', () => {
    it('returns gziped file size in bytes', () => {
      const result = helper.file(Path.resolve(dirname, './../fixtures/filesize.txt'), true);

      return expect(result).eventually.equal(145);
    });
  });
  describe('.format(size)', () => {
    it('returns file size as a human readable string', () => {
      const result = helper.format(1_024);

      expect(result).to.equal('1.02 kB');
    });
  });
});
