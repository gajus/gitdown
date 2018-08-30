const fs = require('fs');
const Path = require('path');
const expect = require('chai').expect;
const requireNew = require('require-uncached');

xdescribe('Locator', () => {
  let Locator;

  beforeEach(() => {
    Locator = requireNew('../src/locator');
  });
  describe('.gitPath()', () => {
    it('returns absolute path to the .git/ directory', () => {
      expect(Locator.gitPath()).to.equal(fs.realpathSync(Path.resolve(__dirname, './../.git')));
    });
  });
  describe('.repositoryPath()', () => {
    it('returns absolute path to the parent of the _getGitPath() directory', () => {
      expect(Locator.repositoryPath()).to.equal(fs.realpathSync(Locator.gitPath() + '/..'));
    });
  });
});
