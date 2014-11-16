var expect = require('chai').expect,
    sinon = require('sinon'),
    requireNew = require('require-new');

describe('Gitdown.Parser', function () {
    var Parser,
        parser,
        spy;
    beforeEach(function () {
        Parser = requireNew('../src/main.js').Parser;
        parser = Parser();
    });
    afterEach(function () {
        if (spy) {
            spy.restore();
        }
    });
    it('returns the input content', function () {
        return parser
            .play('foo')
            .then(function (state) {
                expect(state.markdown).to.equal('foo');
            });
    });
    it('ignores content starting with a <!-- gitdown: off --> HTML comment tag', function () {
        return parser
            .play('<<{"gitdown": "test"}>><!-- gitdown: off --><<{"gitdown": "test"}>>')
            .then(function (state) {
                expect(state.markdown).to.equal('test<!-- gitdown: off --><<{"gitdown": "test"}>>');
            });
    });
    it('ignores content between <!-- gitdown: off --> and <!-- gitdown: on --> HTML comment tags', function () {
        return parser
            .play('<!-- gitdown: off --><<{"gitdown": "test"}>><!-- gitdown: on --><!-- gitdown: off --><<{"gitdown": "test"}>><!-- gitdown: on -->')
            .then(function (state) {
                expect(state.markdown).to.equal('<!-- gitdown: off --><<{"gitdown": "test"}>><!-- gitdown: on --><!-- gitdown: off --><<{"gitdown": "test"}>><!-- gitdown: on -->');
            });
    });
    it('interprets JSON starting with \'<<{"gitdown"\' and ending with \'}>>\'', function () {
        return parser
            .play('<<{"gitdown": "test"}>><<{"gitdown": "test"}>>')
            .then(function (state) {
                expect(state.markdown).to.equal('testtest');
            });
    });
    it('invokes a helper function with the markdown and the definition parameters', function () {
        spy = sinon.spy(Parser.helpers, 'test');

        return parser
            .play('<<{"gitdown": "test", "foo": "bar"}>>')
            .then(function (state) {
                expect(spy.calledWith('⊂⊂1⊃⊃', {foo: "bar"})).to.true;
            });
    });
    it('throws an error if an unknown helper is invoked', function () {
        return expect(function () {
            parser
                .play('<<{"gitdown": "does-not-exist"}>>');
        }).to.throw(Error, 'Unknown helper "does-not-exist".');
    });
    it('descends to the helper with the lowest weight after each iteration', function () {
        // Helper "include" is weight 20
        // Helper "test" is weight 10
        return parser
            .play('<<{"gitdown": "include", "file": "./tests/fixtures/include_test_weight_10.txt"}>>')
            .then(function (state) {
                expect(state.markdown).to.equal('test')
            });
    });
});

describe('Parser.helpers', function () {
    var helpers = requireNew('../src/main.js').Parser.helpers;

    Object.keys(helpers).forEach(function (helperName) {
        describe(helperName, function () {
            it('has weight()', function () {
                expect(helpers[helperName].weight()).to.not.equal(0);
            });
        });
    });
});