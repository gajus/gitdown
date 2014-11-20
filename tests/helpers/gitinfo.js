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
            helper({}, context);
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if unsupported config.name property is provided', function () {
        expect(function () {
            helper({name: 'foo'}, context);
        }).to.throw(Error, 'Unexpected config.name value ("foo").');
    });
    it('calls gitinfo method of the same name', function () {
        expect(helper({name: 'name'}, context)).to.equal('gitdown');
    });
});