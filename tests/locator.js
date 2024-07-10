import fs from 'fs';
import Path from 'path';
import {expect} from 'chai';
import { fileURLToPath } from 'url';

const __dirname = Path.dirname(fileURLToPath(import.meta.url));
const importFresh = (moduleName) => import(`${moduleName}?${Date.now()}`);

xdescribe('Locator', () => {
  let Locator;

  beforeEach(async () => {
    Locator = (await importFresh('../src/locator.js')).Parser;
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
