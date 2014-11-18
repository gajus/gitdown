var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.variable', function () {
    var helper,
        contextFactory;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/variable.js');
        contextFactory = function (variables) {
            var context,
                config;

            config = function () {
                return {
                    variables: variables
                }
            };

            context = {
                gitdown: {
                    config: config
                }
            };

            return context;
        };
    });
    it('throws an error if variable name is not given', function () {
        var context = contextFactory({});

        expect(function () {
            helper(null, context);
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if variable does not resolve to a defined value', function () {
        var context = contextFactory({});

        expect(function() {
            helper({name: 'a.b.c'}, context);
        }).to.throw(Error, 'config.name "a.b.c" does not resolve to a defined value.');
    });
    it('returns the resolves value if it is defined', function () {
        var context = contextFactory({
            a: {
                b: {
                    c: 'd'
                }
            }
        });

        expect(helper({name: 'a.b.c'}, context)).to.equal('d');
    });
});