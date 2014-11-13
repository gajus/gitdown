var Gitdown = {},
    Promise = require('bluebird'),
    fs = require('fs');

/**
 * @param {String|Promise} input
 */
Gitdown = function Gitdown (input) {
    var gitdown;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(input);
    }

    gitdown = this;

    input = Promise.resolve(input);

    /**
     * Process input.
     * 
     * @return {Promise}
     */
    gitdown.get = function () {
        return input
            .then(function (inputString) {
                return inputString;
            });
    };

    /**
     * Write processed input to a file.
     *
     * @param {String} fileName
     */
    gitdown.write = function (fileName) {
        return gitdown
            .get()
            .then(function (outputString) {
                return fs.writeFileSync(fileName, outputString);
            });
    };
};

/**
 * Read input from a file.
 * 
 * @param {String} fileName
 * @return {Gitdown}
 */
Gitdown.read = function (fileName) {
    var input = fs.readFileSync(fileName, {
        encoding: 'utf8'
    });

    return Gitdown(input);
};

/**
 * @return {String} Path to the .git directory.
 */
Gitdown._getGitPath = function () {
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
Gitdown._getRepositoryPath = function () {
    return fs.realpathSync(Gitdown._getGitPath() + '/..');
};

Gitdown.util = {};
Gitdown.util.size = require('./util/size.js');
Gitdown.util.link = require('./util/link.js');

module.exports = Gitdown;