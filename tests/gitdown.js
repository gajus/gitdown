var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised');
    nock = require('nock');

chai.use(chaiAsPromised);

describe('Gitdown.util.size', function () {
    var util;
    beforeEach(function () {
        util = require('../src/gitdown.js').util.size;
    });
    describe('.file(filename)', function () {
        it('throws an error if file is not found', function () {
            return expect(util.file(__dirname + '/does-not-exist')).rejectedWith(Error, 'Input file does not exist.');
        });
        it('returns file size in bytes', function () {
            return expect(util.file(__dirname + '/fixtures/filesize')).eventually.equal(191);
        });
    });
    describe('.file(filename, true)', function () {
        it('returns gziped file size in bytes', function () {
            return expect(util.file(__dirname + '/fixtures/filesize', true)).eventually.equal(148);
        });
    });
    describe('.format(size)', function () {
        it('returns file size as human readable string', function () {
            expect(util.format(1000)).to.equal('1.00 kB');
        });
    });
});