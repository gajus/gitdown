var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.variable', function () {
    var helper,
        context;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/variable.js');
        context = {
            gitdown: {
                config: {
                    variable: {
                        scope: {}
                    }
                }
            }
        };
    });
    it('throws an error if variable name is not given', function () {
        expect(function () {
            helper.compile(null, context);
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if variable does not resolve to a defined value', function () {
        expect(function() {
            helper.compile({name: 'a.b.c'}, context);
        }).to.throw(Error, 'config.name "a.b.c" does not resolve to a defined value.');
    });
    it('returns the resolved value', function () {
        context.gitdown.config.variable.scope = {
            a: {
                b: {
                    c: 'd'
                }
            }
        };

        expect(helper.compile({name: 'a.b.c'}, context)).to.equal('d');
    });
});