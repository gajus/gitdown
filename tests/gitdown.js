var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    nock = require('nock'),
    fs = require('fs');

chai.use(chaiAsPromised);
chai.use(sinonChai);

/**
 * @see http://stackoverflow.com/a/11477602/368691
 */
function requireNew (module) {
    var modulePath = require.resolve(module);
    
    delete require.cache[modulePath];

    return require(modulePath);
};

describe('Gitdown.Parser', function () {
    var Gitdown,
        parser;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
        parser = Gitdown.Parser();
    });
    it('interprets occurrences of JSON stating with <<{"gitdown" and ending }>>', function () {
        return parser
            .play('<<{"gitdown": "test"}>>')
            .then(function (state) {
                expect(state.markdown).to.equal('test');
            });
    });
    it('invokes the utility function with the markdown and parameters', function () {
        var spy = sinon.spy(Gitdown.utils, 'test');

        return parser
            .play('<<{"gitdown": "test", "foo": "bar"}>>')
            .then(function (state) {
                expect(spy).to.have.been.calledWith('⊂⊂1⊃⊃', {foo: "bar"});
            });
    });
    it('descends to the command with the lowest weight after each iteration', function () {
        return parser
            .play('<<{"gitdown": "include", "file": "./tests/fixtures/include_test_weight_10.txt"}>>')
            .then(function (state) {
                expect(state.markdown).to.equal('10')
            });
    });
});