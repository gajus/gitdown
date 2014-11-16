var Locator = {},
    fs = require('fs');

/**
 * Returns path to the .git directory.
 * 
 * @return {String}
 */
Locator.gitPath = function () {
    var gitpath;

    dirname = __dirname;

    do {
        if (fs.existsSync(dirname + '/.git')) {
            gitpath = dirname + '/.git';

            break;
        }

        dirname = fs.realpathSync(dirname + '/..');
    } while (fs.existsSync(dirname) && dirname != '/');

    if (!gitpath) {
        throw new Error('.git path cannot be located.');
    }

    return gitpath;
};

/**
 * Returns the parent path of the .git path.
 * 
 * @return {String} Path to the repository.
 */
Locator.repositoryPath = function () {
    return fs.realpathSync(Locator.gitPath() + '/..');
};

module.exports = Locator;