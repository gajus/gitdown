/* eslint-disable canonical/filename-match-exported */
import fs from 'fs';
import Path from 'path';
import {
  fileURLToPath,
} from 'url';

const theDirname = Path.dirname(fileURLToPath(import.meta.url));

const Locator = {};

/**
 * Returns path to the .git directory.
 *
 * @returns {string}
 */
Locator.gitPath = () => {
  let dirname;
  let gitpath;

  dirname = theDirname;

  do {
    if (fs.existsSync(dirname + '/.git')) {
      gitpath = dirname + '/.git';

      break;
    }

    dirname = fs.realpathSync(dirname + '/..');
  } while (fs.existsSync(dirname) && dirname !== '/');

  if (!gitpath) {
    throw new Error('.git path cannot be located.');
  }

  return gitpath;
};

/**
 * Returns the parent path of the .git path.
 *
 * @returns {string} Path to the repository.
 */
Locator.repositoryPath = () => {
  return fs.realpathSync(Path.resolve(Locator.gitPath(), '..'));
};

export default Locator;
