var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    requireNew = require('require-new');

chai.use(chaiAsPromised);

describe('Parser.helpers.include', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/include.js');
    });
    it('is rejected with an error when config.file is not provided', function () {
        return expect(helper())
            .to.rejectedWith(Error, 'config.file must be provided.');
    });
    it('is rejected with an error when file is not found', function () {
        return expect(helper('', {file: __dirname + '/does-not-exist'}))
            .to.rejectedWith(Error, 'Input file does not exist.');
    });
});