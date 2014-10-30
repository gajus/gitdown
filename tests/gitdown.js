var chai = require('chai'),
    expect = chai.expect,
    spies = require('chai-spies'),
    fs = require('fs');

chai.use(spies);

describe('Gitdown', function () {
    var Gitdown;

    beforeEach(function () {
        Gitdown = require('../src/gitdown.js');
    });

    describe('.getGitPath()', function () {
        it('returns absolute path to the .git directory', function () {
            expect(Gitdown.getGitPath()).to.equal(fs.realpathSync(__dirname + '/../.git'));
        });
        it('throws error if .git path cannot be located', function () {
            expect(function () {
                Gitdown.getGitPath('/');
            }).to.throw(Error, '.git path cannot be located.');
        });
    });

    describe('.getRepositoryPath()', function () {
        it('returns absolute path to the parent of the getGitPath() directory', function () {
            expect(Gitdown.getRepositoryPath()).to.equal(fs.realpathSync(Gitdown.getGitPath() + '/..'));
        });
    });

    describe('.readFile()', function () {
        it('throws error if file does not exist', function () {
            expect(function () {
                Gitdown.readFile(__dirname + '/does-not-exist');
            }).to.throw(Error, 'Input file does not exist.');
        });
        it('uses Gitdown.read() to interpret the input', function () {
            var spy = chai.spy();
            Gitdown.read = spy;
            Gitdown.readFile(__dirname + '/fixtures/foo.md');
            expect(spy).to.have.been.called.with('bar');
        });
    });

    describe('#render()', function () {
        it('returns input', function () {
            var gitdown = Gitdown('foo');
            expect(gitdown.render()).to.equal('foo');
        });
        it('returns input with curly brackets intact', function () {
            var gitdown = Gitdown('{{foo}}');
            expect(gitdown.render()).to.equal('{{foo}}');
        });
        it('expands curly bracket to values under gitdown namespace', function () {
            var gitdown = Gitdown('{{gitdown.foo}}');
            expect(gitdown.render()).to.equal('bar');
        });
    });

    describe('.render', function () {
        describe('.contents()', function () {
            it('generates table of contents', function () {
                expect(Gitdown.render.contents("# foo\n## bar")).to.equal("*[bar](#bar)\n");
            });
        });
    });
});