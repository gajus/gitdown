/* eslint-disable import/no-commonjs, max-nested-callbacks */

const expect = require('chai').expect;
const sinon = require('sinon');
const requireNew = require('require-new');

describe('Gitdown.Parser', () => {
    let Parser,
        parser,
        spy;

    beforeEach(() => {
        Parser = requireNew('./../src/').Parser;
        parser = Parser();
    });
    afterEach(() => {
        if (spy) {
            spy.restore();
        }
    });
    it('returns the input content', () => {
        return parser
            .play('foo')
            .then((state) => {
                expect(state.markdown).to.equal('foo');
            });
    });
    it('ignores content starting with a <!-- gitdown: off --> HTML comment tag', () => {
        return parser
            .play('{"gitdown": "test"}<!-- gitdown: off -->{"gitdown": "test"}')
            .then((state) => {
                expect(state.markdown).to.equal('test<!-- gitdown: off -->{"gitdown": "test"}');
            });
    });
    it('ignores content between <!-- gitdown: off --> and <!-- gitdown: on --> HTML comment tags', () => {
        return parser
            .play('<!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on --><!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on -->')
            .then((state) => {
                expect(state.markdown).to.equal('<!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on --><!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on -->');
            });
    });
    it('interprets JSON starting with \'{"gitdown"\' and ending with \'}\'', () => {
        return parser
            .play('{"gitdown": "test"}{"gitdown": "test"}')
            .then((state) => {
                expect(state.markdown).to.equal('testtest');
            });
    });
    it('throws an error if invalid Gitdown JSON hook is encountered', () => {
        return expect(() => {
            parser.play('{"gitdown": invalid}');
        }).to.throw(Error, 'Invalid Gitdown JSON ("{"gitdown": invalid}").');
    });
    it('invokes a helper function with the markdown', () => {
        spy = sinon.spy(parser.helpers().test, 'compile');

        return parser
            .play('{"gitdown": "test", "foo": "bar"}')
            .then(() => {
                expect(spy.calledWith({foo: 'bar'})).to.be.equal(true);
            });
    });
    it('throws an error if an unknown helper is invoked', () => {
        return expect(() => {
            parser
                .play('{"gitdown": "does-not-exist"}');
        }).to.throw(Error, 'Unknown helper "does-not-exist".');
    });
    it('descends to the helper with the lowest weight after each iteration', () => {
        parser = Parser({
            getConfig: () => {
                return {
                    baseDirectory: __dirname
                };
            }
        });

        // Helper "include" is weight 20
        // Helper "test" is weight 10
        return parser
            .play('{"gitdown": "include", "file": "./fixtures/include_test_weight_10.txt"}')
            .then((state) => {
                expect(state.markdown).to.equal('test');
            });
    });
});

/* eslint-disable global-require */
describe('Parser.helpers', () => {
    const glob = require('glob');
    const path = require('path');

    glob.sync('./../src/helpers/*.js').forEach((helperName) => {
        const helper = require(helperName);

        describe(path.basename(helperName, '.js'), () => {
            it('has compile method', () => {
                expect(helper).to.have.property('compile');
            });
            it('has weight property', () => {
                expect(helper).to.have.property('weight');
            });
        });
    });
});
/* eslint-enable global-require */
