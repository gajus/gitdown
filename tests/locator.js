var expect = require('chai').expect,
    fs = require('fs'),
    requireNew = require('require-new');

describe('Locator', function () {
    var Locator;
    beforeEach(function () {
        Locator = requireNew('../src/locator.js');
    });
    describe('.gitPath()', function () {
        it('returns absolute path to the .git/ directory', function () {
            expect(Locator.gitPath()).to.equal(fs.realpathSync(__dirname + '/../.git'));
        });
    });
    describe('.repositoryPath()', function () {
        it('returns absolute path to the parent of the _getGitPath() directory', function () {
            expect(Locator.repositoryPath()).to.equal(fs.realpathSync(Locator.gitPath() + '/..'));
        });
    });
});