var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.contents', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/contents.js');
    });
    it('generates table of contents for a markdown document', function () {
        var contents = helper({}, {markdown: '\n# a\n## b\n\n##c '});

        expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n    * [c](#c)\n');
    });
});