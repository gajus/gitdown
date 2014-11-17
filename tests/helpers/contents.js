var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.contents', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/contents.js');
    });
    it('generates table of contents for a markdown document', function () {
        var contents = helper('test ## a\n## b\n\n##c ');

        console.log('contents\n\n', contents);
    });
});