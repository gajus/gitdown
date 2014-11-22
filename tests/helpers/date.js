var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.date', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/date.js');
    });
    it('returns current UNIX timestamp', function () {
        expect(helper.compile()).to.equal( ~~(new Date().getTime()/1000) + '' );
    });
    it('uses format parameter to adjust the format', function () {
        expect(helper.compile({format: 'YYYY'})).to.equal(new Date().getUTCFullYear() + '');
    });
});