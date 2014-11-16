var expect = require('chai').expect,
    fs = require('fs'),
    requireNew = require('require-new');

describe('Gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('._pathGit()', function () {
        it('returns absolute path to the .git/ directory', function () {
            expect(Gitdown._pathGit()).to.equal(fs.realpathSync(__dirname + '/../.git'));
        });
    });
    describe('._pathRepository()', function () {
        it('returns absolute path to the parent of the _getGitPath() directory', function () {
            expect(Gitdown._pathRepository()).to.equal(fs.realpathSync(Gitdown._pathGit() + '/..'));
        });
    });
});

describe('gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });

    describe('.get()', function () {
        it('is using Parser to produce the response', function () {
            return Gitdown('<<{"gitdown": "test"}>>')
                .get()
                .then(function (response) {
                    expect(response).to.equal('test');
                });
        });
    });
    describe('.read()', function () {
        it('returns an instance of Gitdown', function () {
            return expect(Gitdown.read(__dirname + '/fixtures/foo.txt')).to.instanceof(Gitdown);
        });
        it('calls Gitdown using the contents of the file', function () {
            var gitdown = Gitdown.read(__dirname + '/fixtures/foo.txt');

            return gitdown
                .get()
                .then(function (response) {
                    expect(response).to.equal('bar');
                });
        });
    });
    describe('.write()', function () {
        it('writes the output of .get() to a file', function () {
            var fileName = __dirname + '/fixtures/write.txt',
                randomString = Math.random() + '',
                gitdown = Gitdown(randomString);

            return gitdown
                .write(fileName)
                .then(function () {
                    expect(fs.readFileSync(fileName, {encoding: 'utf8'})).to.equal(randomString);
                });
        });
    });
});