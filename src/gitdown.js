var Gitdown,
    Parser = require('./parser.js'),
    fs = require('fs');

/**
 * @param {String} GFM Gitdown favored markdown.
 */
Gitdown = function Gitdown (GFM) {
    var gitdown;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(GFM);
    }

    gitdown = this;

    /**
     * Parse and process input.
     * 
     * @return {Promise}
     */
    gitdown.get = function () {
        var parser;

        parser = Parser();

        return parser
            .play(GFM)
            .then(function (state) {
                return state.markdown;
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
 * Returns path to the .git directory.
 * 
 * @return {String}
 */
Gitdown._pathGit = function () {
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
Gitdown._pathRepository = function () {
    return fs.realpathSync(Gitdown._pathGit() + '/..');
};

module.exports = Gitdown;