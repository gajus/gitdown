var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    requireNew = require('require-new');

chai.use(chaiAsPromised);

describe('Parser.helpers.date', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/date.js');
    });
    it('returns current UNIX timestamp', function () {
        expect(helper()).to.equal( ~~(new Date().getTime()/1000) + '' );
    });
    it('uses format parameter to adjust the format', function () {
        expect(helper('', {format: 'YYYY'})).to.equal(new Date().getUTCFullYear() + '');
    });
});