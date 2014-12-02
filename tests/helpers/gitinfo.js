var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.gitinfo', function () {
    var helper,
        context;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/gitinfo.js');
        context = {
            gitdown: {
                config: {
                    gitinfo: {
                        gitPath: __dirname
                    }
                }
            }
        };
    });
    it('throws an error if config.name is not provided', function () {
        expect(function () {
            helper.compile({}, context);
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if unsupported config.name property is provided', function () {
        expect(function () {
            helper.compile({name: 'foo'}, context);
        }).to.throw(Error, 'Unexpected config.name value ("foo").');
    });
    // @todo Fix this failing test.
    it.skip('calls gitinfo method of the same name', function () {
        expect(helper.compile({name: 'name'}, context)).to.equal('gitdown');
    });
});