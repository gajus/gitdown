var Gitdown,
    Parser = require('./parser.js'),
    fs = require('fs'),
    Deadlink = require('deadlink'),
    Promise = require('bluebird');

/**
 * @param {String} input Gitdown flavored markdown.
 */
Gitdown = function Gitdown (input) {
    var gitdown,
        config,
        logger;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(input);
    }

    gitdown = this;

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
                return gitdown._resolveURLs(state.markdown)
                    .then(function () {
                        return state.markdown;
                    });
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
        if (setConfig === undefined) {
            return config;
        } else {
            config = setConfig;
        }
    };

    /**
     * Returns the first directory in the callstack that is not this directory.
     *
     * @return {String} Path to the directory where Gitdown was invoked.
     */
    gitdown._executionContext = function () {
        var stackTrace = require('stack-trace').get(),
            path = require('path'),
            stackTraceLength = stackTrace.length,
            stackDirectory,
            i = 0;

        while (i++ < stackTraceLength) {
            stackDirectory = path.dirname(stackTrace[i].getFileName());
            
            if (__dirname != stackDirectory) {
                return stackDirectory;
            }
        }

        throw new Error('Execution context cannot be determined.');
    };

    /**
     * @param {String} markdown
     */
    gitdown._resolveURLs = function (markdown) {
        var deadlink,
            urls,
            promises;

        deadlink = Deadlink();
        urls = deadlink.matchURLs(markdown);

        return new Promise(function (resolve, reject) {
            if (!urls.length || !config.deadlink.findDeadURLs) {
                return resolve();
            }

            if (config.deadlink.findDeadFragmentIdentifiers) {
                promises = deadlink.resolve(urls);
            } else {
                promises = deadlink.resolveURLs(urls);
            }

            Promise.all(promises).then(function () {
                promises.forEach(function (promise) {
                    var Resolution = promise.value();

                    if (Resolution.error) {
                        if (Resolution.fragmentIdentifier) {
                            logger.warn('Unresolved URL and/or the fragment identifier:', Resolution.url, Resolution.fragmentIdentifier);
                        } else {
                            logger.warn('Unresolved URL:', Resolution.url);
                        }  
                    } else {
                        if (Resolution.fragmentIdentifier) {
                            logger.info('Resolved URL and the fragment identifier:', Resolution.url, Resolution.fragmentIdentifier);
                        } else {
                            logger.info('Resolved URL:', Resolution.url);
                        }                        
                    }
                });

                resolve();
            });
        });
    };

    config = {};
    config.deadlink = {};
    config.deadlink.findDeadURLs = true;
    config.deadlink.findDeadFragmentIdentifiers = true;
    config.gitinfo = {};
    config.gitinfo.gitPath = gitdown._executionContext();

    /**
     * Get/set 
     */
    gitdown.logger = function (_logger) {
        if (!_logger) {
            return logger;
        }

        if (!_logger.info) {
            throw new Error('Logger must implement logger.info method.');
        }

        if (!_logger.warn) {
            throw new Error('Logger must implement logger.warn method.');
        }

        logger = {
            info: _logger.info,
            warn: _logger.warn
        };

        return logger;
    };

    gitdown.logger(console);
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