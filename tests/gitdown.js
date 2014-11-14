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
        var spy = sinon.spy(Gitdown.helpers, 'test');

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
                expect(state.markdown).to.equal('test')
            });
    });
});

describe('Gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('._gitPath()', function () {
        it('returns absolute path to the .git directory', function () {
            expect(Gitdown._pathGit()).to.equal(fs.realpathSync(__dirname + '/../.git'));
        });
    });
    describe('._repositoryPath()', function () {
        it('returns absolute path to the parent of the _getGitPath() directory', function () {
            expect(Gitdown._pathRepository()).to.equal(fs.realpathSync(Gitdown._pathGit() + '/..'));
        });
    });
});

describe('Gitdown.helpers.size', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../src/gitdown.js').helpers.size;
    });
    describe('.file(filename)', function () {
        it('throws an error if file is not found', function () {
            return expect(helper.file(__dirname + '/does-not-exist')).rejectedWith(Error, 'Input file does not exist.');
        });
        it('returns file size in bytes', function () {
            return expect(helper.file(__dirname + '/fixtures/filesize.txt')).eventually.equal(191);
        });
    });
    describe('.file(filename, true)', function () {
        it('returns gziped file size in bytes', function () {
            return expect(helper.file(__dirname + '/fixtures/filesize.txt', true)).eventually.equal(148);
        });
    });
    describe('.format(size)', function () {
        it('returns file size as human readable string', function () {
            expect(helper.format(1000)).to.equal('1.00 kB');
        });
    });
});