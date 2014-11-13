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
    var Parser,
        parser;
    beforeEach(function () {
        Parser = requireNew('../src/gitdown.js').Parser;
        parser = Parser();
    });
    describe('.parse()', function () {
        it('interprets occurrences of JSON stating with <<{"gitdown" and ending }>>', function () {
            var play;

            //instructions = parser.parse('<<{"gitdown":"test_weight_20"}>> <<{"gitdown":"test_weight_10"}>>');
            //parser.execute(instructions);

            play = parser.play('<<{"gitdown":"test_weight_20"}>> <<{"gitdown":"test_weight_10"}>>');

            return play.then(function (state) {
                console.log(state.markdown);
            });
        });
    });
});