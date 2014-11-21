var Gitdown,
    Parser = require('./parser.js'),
    fs = require('fs'),
    Deadlink = require('deadlink'),
    Promise = require('bluebird'),
    URLExtractor = require('url-extractor');

/**
 * @param {String} input Gitdown flavored markdown.
 */
Gitdown = function Gitdown (input) {
    var gitdown;

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
            repositoryURL,
            urls,
            promises;

        repositoryURL = Parser.helpers.gitinfo({name: 'url'}, {gitdown: gitdown}) + '/tree/' + Parser.helpers.gitinfo({name: 'branch'}, {gitdown: gitdown});

        deadlink = Deadlink();
        urls = URLExtractor.extract(markdown, URLExtractor.SOURCE_TYPE_MARKDOWN);

        urls = urls.map(function (url) {
            // @todo What if it isn't /README.md?
            // @todo Test.
            if (url.indexOf('#') === 0) {
                // Github is using JavaScript to resolve anchor tags under #uses-content- ID.
                url = repositoryURL + '#user-content-' + url.substr(1);
            }

            return url;
        });

        return new Promise(function (resolve, reject) {
            if (!urls.length || !gitdown.config.deadlink.findDeadURLs) {
                return resolve();
            }

            if (gitdown.config.deadlink.findDeadFragmentIdentifiers) {
                promises = deadlink.resolve(urls);
            } else {
                promises = deadlink.resolveURLs(urls);
            }

            gitdown.logger.info('Resolving URLs', urls);

            Promise.all(promises).then(function () {
                promises.forEach(function (promise) {
                    var Resolution = promise.value();

                    if (Resolution.error) {
                        if (Resolution.fragmentIdentifier) {
                            // Ignore the error if resource resolution failed.
                            if (!(Resolution.error instanceof Deadlink.URLResolution && !Resolution.error.error)) {
                                gitdown.logger.warn('Unresolved fragment identifier:', Resolution.url);
                            }
                        } else {
                            gitdown.logger.warn('Unresolved URL:', Resolution.url);
                        }  
                    } else {
                        if (Resolution.fragmentIdentifier) {
                            gitdown.logger.info('Resolved fragment identifier:', Resolution.url);
                        } else {
                            gitdown.logger.info('Resolved URL:', Resolution.url);
                        }                        
                    }
                });

                resolve();
            });
        });
    };

    (function () {
        var config,
            logger;

        Object.defineProperty(gitdown, 'config', {
            get: function () {
                return config;
            },
            set: function (_config) {
                if (!_config.variable || typeof _config.variable.scope != 'object') {
                    throw new Error('config.variable.scope must be set and must be an object.');
                }

                if (!_config.deadlink || typeof _config.deadlink.findDeadURLs != 'boolean') {
                    throw new Error('config.deadlink.findDeadURLs must be set and must be a boolean value');
                }

                if (!_config.deadlink || typeof _config.deadlink.findDeadFragmentIdentifiers != 'boolean') {
                    throw new Error('config.deadlink.findDeadFragmentIdentifiers must be set and must be a boolean value');
                }

                if (!_config.gitinfo || !fs.realpathSync(_config.gitinfo.gitPath)) {
                    throw new Error('config.gitinfo.gitPath must be set and must resolve an existing file path.');
                }

                config = _config;
            }
        });

        Object.defineProperty(gitdown, 'logger', {
            get: function () {
                return logger;
            },
            set: function (_logger) {
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
            }
        });

        gitdown.config = {
            variable: {
                scope: {}
            },
            deadlink: {
                findDeadURLs: false,
                findDeadFragmentIdentifiers: false
            },
            gitinfo: {
                gitPath: gitdown._executionContext()
            }
        }

        gitdown.logger = console;
    } ());
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

Gitdown._nestHeadingIds = function (markdown) {
    var MarkdownContents = require('markdown-contents'),
        contents = Parser.helpers.contents,
        articles = [],
        tree;

    markdown = markdown.replace(/^(#+)(.*$)/mg, function (match, level, name) {
        level = level.length;
        name = name.trim();

        articles.push({
            level: level,
            id: name.toLowerCase().replace(/[^\w]+/g, '-'),
            name: name
        });

        return '<h' + level + ' id="⊂⊂H:' + articles.length + '⊃⊃">' + name + '</h' + level + '>'
    });

    tree = contents.nestIds(MarkdownContents.tree(articles));

    Gitdown._nestHeadingIds.iterate(tree, function (index, article) {
        markdown = markdown.replace('⊂⊂H:' + index + '⊃⊃', article.id);
    });

    return markdown;
};

Gitdown._nestHeadingIds.iterate = function (tree, callback, index) {
    index = index || 1;

    tree.forEach(function (article) {
        callback(index++, article);

        if (article.descendants) {
            Gitdown._nestHeadingIds.iterate(article.descendants, callback, index);
        }
    });
};

module.exports = Gitdown;