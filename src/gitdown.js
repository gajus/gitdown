'use strict';

var Gitdown,
    Parser = require('./parser.js'),
    fs = require('fs'),
    Promise = require('bluebird');

/**
 * @param {String} input Gitdown flavored markdown.
 */
Gitdown = function Gitdown (input) {
    var gitdown,
        parser;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(input);
    }

    gitdown = this;
    parser = Parser(gitdown);

    /**
     * Process template.
     *
     * @return {Promise}
     */
    gitdown.get = function () {
        return parser
            .play(input)
            .then(function (state) {
                var markdown = state.markdown;

                if (gitdown.config.headingNesting.enabled) {
                    markdown = Gitdown._nestHeadingIds(markdown);
                }

                return gitdown._resolveURLs(markdown)
                    .then(function () {
                        return Gitdown.notice() + markdown;
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
     * @param {String} name
     * @param {Object} helper
     */
    gitdown.registerHelper = function (name, helper) {
        parser.registerHelper(name, helper);
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

            if (__dirname !== stackDirectory) {
                return stackDirectory;
            }
        }

        throw new Error('Execution context cannot be determined.');
    };

    /**
     * @param {String} markdown
     */
    gitdown._resolveURLs = function (markdown) {
        var Deadlink = require('deadlink'),
            URLExtractor = require('url-extractor'),
            gitinfo = require('./helpers/gitinfo.js'),
            deadlink,
            repositoryURL,
            urls,
            promises;

        repositoryURL = gitinfo.compile({name: 'url'}, {gitdown: gitdown}) + '/tree/' + gitinfo.compile({name: 'branch'}, {gitdown: gitdown});

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

        if (!urls.length || !gitdown.config.deadlink.findDeadURLs) {
            return Promise.resolve([]);
        }

        if (gitdown.config.deadlink.findDeadFragmentIdentifiers) {
            promises = deadlink.resolve(urls);
        } else {
            promises = deadlink.resolveURLs(urls);
        }

        gitdown.logger.info('Resolving URLs', urls);

        return Promise
            .all(promises)
            .each(function (Resolution) {
                if (Resolution.error && Resolution.fragmentIdentifier && !(Resolution.error instanceof Deadlink.URLResolution && !Resolution.error.error)) {
                    // Ignore the fragment identifier error if resource resolution failed.
                    gitdown.logger.warn('Unresolved fragment identifier:', Resolution.url);
                } else if (Resolution.error && !Resolution.fragmentIdentifier) {
                    gitdown.logger.warn('Unresolved URL:', Resolution.url);
                } else if (Resolution.fragmentIdentifier) {
                    gitdown.logger.info('Resolved fragment identifier:', Resolution.url);
                } else if (!Resolution.fragmentIdentifier) {
                    gitdown.logger.info('Resolved URL:', Resolution.url);
                }
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
                if (!_config.variable || typeof _config.variable.scope !== 'object') {
                    throw new Error('config.variable.scope must be set and must be an object.');
                }

                if (!_config.deadlink || typeof _config.deadlink.findDeadURLs !== 'boolean') {
                    throw new Error('config.deadlink.findDeadURLs must be set and must be a boolean value');
                }

                if (!_config.deadlink || typeof _config.deadlink.findDeadFragmentIdentifiers !== 'boolean') {
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
            headingNesting: {
                enabled: true
            },
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
        };

        gitdown.logger = console;
    }());
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
 * @return {String}
 */
Gitdown.notice = function () {
    return '<!--\nThis file has been generated using Gitdown (https://github.com/gajus/gitdown).\nDirect edits to this will be be overwritten. Look for Gitdown markup file under ./.gitdown/ path.\n-->\n';
};

/**
 * Iterates through each heading in the document (defined using markdown)
 * and prefixes heading ID using parent heading ID.
 *
 * @param {String} markdown
 * @return {String} markdown
 */
Gitdown._nestHeadingIds = function (markdown) {
    var MarkdownContents = require('markdown-contents'),
        contents = require('./helpers/contents.js'),
        articles = [],
        tree,
        codeblocks = [];

    markdown = markdown.replace(/^```[\s\S]*?\n```/mg, function (match) {
        codeblocks.push(match);

        return '⊂⊂⊂C:' + codeblocks.length + '⊃⊃⊃';
    });

    markdown = markdown.replace(/^(#+)(.*$)/mg, function (match, level, name) {
        level = level.length;
        name = name.trim();

        articles.push({
            level: level,
            id: name.toLowerCase().replace(/[^\w]+/g, '-'),
            name: name
        });

        return '<h' + level + ' id="⊂⊂⊂H:' + articles.length + '⊃⊃⊃">' + name + '</h' + level + '>';
    });

    markdown = markdown.replace(/^⊂⊂⊂C:(\d+)⊃⊃⊃/mg, function () {
        return codeblocks.shift();
    });

    tree = contents._nestIds(MarkdownContents.tree(articles));

    Gitdown._nestHeadingIds.iterateTree(tree, function (index, article) {
        markdown = markdown.replace('⊂⊂⊂H:' + index + '⊃⊃⊃', article.id);
    });

    return markdown;
};

/**
 *
 *
 * @param {Array} tree
 * @param {Function} callback
 * @param {Number} index
 */
Gitdown._nestHeadingIds.iterateTree = function (tree, callback, index) {
    index = index || 1;

    tree.forEach(function (article) {
        callback(index++, article);

        if (article.descendants) {
            index = Gitdown._nestHeadingIds.iterateTree(article.descendants, callback, index);
        }
    });

    return index;
};

module.exports = Gitdown;
