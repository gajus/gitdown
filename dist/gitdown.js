/**
 * @version 1.0.0
 * @link https://github.com/gajus/gitdown for the canonical source repository
 * @license https://github.com/gajus/gitdown/blob/master/LICENSE BSD 3-Clause
 */
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
     * Renders input.
     * 
     * @return {Promise}
     */
    gitdown.get = function () {
        return input
            .then(function (inputString) {
                return inputString;
            });
    };

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
 * @param {String} dirname Path to start the iteration with.
 * @return {String} Path to the .git directory
 */
Gitdown.getGitPath = function (dirname) {
    var gitpath;

    dirname = dirname || __dirname;

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
 * @return {String} Path to the repository.
 */
Gitdown.getRepositoryPath = function () {
    return fs.realpathSync(Gitdown.getGitPath() + '/..');
};

Gitdown.util = {};
Gitdown.util.size = require('./util/size.js');
Gitdown.util.link = require('./util/link.js');

module.exports = Gitdown;