var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    requireNew = require('require-new');

chai.use(chaiAsPromised);

describe('Parser.helpers.filesize', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/filesize.js');
    });
    it('is rejected with an error when config.file is not provided', function () {
        return expect(helper())
            .to.rejectedWith(Error, 'config.file must be provided.');
    });
    it('is rejected with an error when file is not found', function () {
        return expect(helper('', {file: __dirname + '/does-not-exist'}))
            .to.rejectedWith(Error, 'Input file does not exist.');
    });

    it('returns formatted file size', function () {
        return expect(helper('', {file: __dirname + '/../fixtures/filesize.txt'}))
            .to.eventually.equal('191 B');
    });
    it('returns gziped formatted file size', function () {
        return expect(helper('', {file: __dirname + '/../fixtures/filesize.txt', gzip: true}))
            .to.eventually.equal('148 B');
    });
    
    describe('.file(filename)', function () {
        it('throws an error if file is not found', function () {
            return expect(helper.file(__dirname + '/does-not-exist')).rejectedWith(Error, 'Input file does not exist.');
        });
        it('returns the file size in bytes', function () {
            return expect(helper.file(__dirname + '/../fixtures/filesize.txt')).eventually.equal(191);
        });
    });
    describe('.file(filename, true)', function () {
        it('returns gziped file size in bytes', function () {
            return expect(helper.file(__dirname + '/../fixtures/filesize.txt', true)).eventually.equal(148);
        });
    });
    describe('.format(size)', function () {
        it('returns file size as a human readable string', function () {
            expect(helper.format(1000)).to.equal('1.00 kB');
        });
    });
});