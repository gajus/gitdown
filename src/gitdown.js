'use strict';

/* global Promise: true */

var Gitdown = {},
    Parser = require('./parser.js'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    marked = require('marked');

/**
 * @param {String} input Gitdown flavored markdown.
 */
Gitdown.read = function (input) {
    var gitdown,
        parser,
        instanceLogger,
        instanceConfig;

    gitdown = {};

    instanceConfig = {};

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

                if (gitdown.getConfig().headingNesting.enabled) {
                    markdown = Gitdown._nestHeadingIds(markdown);
                }

                return gitdown
                    ._resolveURLs(markdown)
                    .then(function () {
                        return markdown.replace(/<!--\sgitdown:\s(:?off|on)\s-->/g, '');
                    });
            });
    };

    /**
     * Write processed template to a file.
     *
     * @param {String} fileName
     * @return {Promise}
     */
    gitdown.writeFile = function (fileName) {
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
        var Deadlink,
            URLExtractor,
            gitinfo,
            deadlink,
            repositoryURL,
            urls,
            promises;

        Deadlink = require('deadlink');
        URLExtractor = require('url-extractor');
        gitinfo = require('./helpers/gitinfo.js');

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

        if (!urls.length || !gitdown.getConfig().deadlink.findDeadURLs) {
            return Promise.resolve([]);
        }

        if (gitdown.getConfig().deadlink.findDeadFragmentIdentifiers) {
            promises = deadlink.resolve(urls);
        } else {
            promises = deadlink.resolveURLs(urls);
        }

        gitdown.getLogger().info('Resolving URLs', urls);

        return Promise
            .all(promises)
            .each(function (Resolution) {
                if (Resolution.error && Resolution.fragmentIdentifier && !(Resolution.error instanceof Deadlink.URLResolution && !Resolution.error.error)) {
                    // Ignore the fragment identifier error if resource resolution failed.
                    gitdown.getLogger().warn('Unresolved fragment identifier:', Resolution.url);
                } else if (Resolution.error && !Resolution.fragmentIdentifier) {
                    gitdown.getLogger().warn('Unresolved URL:', Resolution.url);
                } else if (Resolution.fragmentIdentifier) {
                    gitdown.getLogger().info('Resolved fragment identifier:', Resolution.url);
                } else if (!Resolution.fragmentIdentifier) {
                    gitdown.getLogger().info('Resolved URL:', Resolution.url);
                }
            });
    };

    /**
     * @param {Object} config
     * @returns {undefined}
     */
    gitdown.setLogger = function (logger) {
        if (!logger.info) {
            throw new Error('Logger must implement logger.info function.');
        }

        if (!logger.warn) {
            throw new Error('Logger must implement logger.warn function.');
        }

        instanceLogger = {
            info: logger.info,
            warn: logger.warn
        };
    };

    /**
     * @returns {Object}
     */
    gitdown.getLogger = function () {
        return instanceLogger;
    };

    /**
     * @typedef {Object} config
     * @property {}
     */

    /**
     * @param {Object} config
     * @returns {undefined}
     */
    gitdown.setConfig = function (config) {
        if (!_.isPlainObject(config)) {
            throw new Error('config must be a plain object.');
        }

        if (config.variable && typeof config.variable.scope !== 'object') {
            throw new Error('config.variable.scope must be set and must be an object.');
        }

        if (config.deadlink && typeof config.deadlink.findDeadURLs !== 'boolean') {
            throw new Error('config.deadlink.findDeadURLs must be set and must be a boolean value');
        }

        if (config.deadlink && typeof config.deadlink.findDeadFragmentIdentifiers !== 'boolean') {
            throw new Error('config.deadlink.findDeadFragmentIdentifiers must be set and must be a boolean value');
        }

        if (config.gitinfo && !fs.realpathSync(config.gitinfo.gitPath)) {
            throw new Error('config.gitinfo.gitPath must be set and must resolve an existing file path.');
        }

        instanceConfig = _.defaultsDeep(config, instanceConfig);
    };

    /**
     * @returns {Object}
     */
    gitdown.getConfig = function () {
        return instanceConfig;
    };

    gitdown.setConfig({
        baseDirectory: process.cwd(),
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
    });

    return gitdown;
};

/**
 * Read input from a file.
 *
 * @param {String} fileName
 * @return {Gitdown}
 */
Gitdown.readFile = function (fileName) {
    var directoryName,
        gitdown,
        input;

    if (!path.isAbsolute(fileName)) {
        throw new Error('fileName must be an absolute path.');
    }

    input = fs.readFileSync(fileName, {
        encoding: 'utf8'
    });

    gitdown = Gitdown.read(input);

    directoryName = path.dirname(fileName);

    gitdown.setConfig({
        baseDirectory: directoryName,
        gitinfo: {
            gitPath: directoryName
        }
    });

    return gitdown;
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
            // `foo bar`
            // -foo-bar-
            // foo-bar
            id: _.trim(name.toLowerCase().replace(/[^\w]+/g, '-'), '-'),
            name: name
        });

        // `test`
        name = _.trim(marked(name));
        // <p><code>test</code></p>
        name = name.slice(3, -4);
        // <code>test</code>

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
