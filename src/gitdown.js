var Gitdown,
    Parser = require('./parser.js'),
    fs = require('fs');

/**
 * @param {String} input Gitdown flavored markdown.
 */
Gitdown = function Gitdown (input) {
    var gitdown,
        config;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(input);
    }

    gitdown = this;
    config = {};

    /**
     * Process template.
     * 
     * @return {Promise}
     */
    gitdown.get = function () {
        var parser;

        parser = Parser(gitdown);

        return parser
            .play(input)
            .then(function (state) {
                return state.markdown;
            });
    };

    /**
     * Write processed template to a file.
     *
     * @param {String} fileName
     * @return {Promise}
     */
    gitdown.write = function (fileName) {
        return gitdown
            .get()
            .then(function (outputString) {
                return fs.writeFileSync(fileName, outputString);
            });
    };

    /**
     * Get or set the configuration.
     * 
     * @param {Object} setConfig
     * @return {Object} Current configuration.
     */
    gitdown.config = function (setConfig) {
        if (_config === undefined) {
            return config;
        } else {
            config = _config;
        }
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

module.exports = Gitdown;