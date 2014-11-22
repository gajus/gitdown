var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.include', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/include.js');
    });
    it('is rejected with an error when config.file is not provided', function () {
        expect(function () {
            helper.compile();
        }).to.throw(Error, 'config.file must be provided.');
    });
    it('is rejected with an error when file is not found', function () {
        expect(function () {
            helper.compile({file: __dirname + '/does-not-exist'});
        }).to.throw(Error, 'Input file does not exist.');
    });
});