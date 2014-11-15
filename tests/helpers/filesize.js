var chai = require('chai'),
    expect = chai.expect,
    fs = require('fs'),
    requireNew = require('require-new'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Parser.helpers.filesize', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/filesize.js');
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