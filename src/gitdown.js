const Gitdown = {};
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const Deadlink = require('deadlink');
const getUrls = require('get-urls');
const _ = require('lodash');
const MarkdownContents = require('markdown-contents');
const marked = require('marked');
const StackTrace = require('stack-trace');
const contents = require('./helpers/contents');
const gitinfo = require('./helpers/gitinfo');
const Parser = require('./parser');

/**
 * @param {string} input Gitdown flavored markdown.
 */
Gitdown.read = (input) => {
  let instanceConfig;
  let instanceLogger;

  instanceConfig = {};

  const gitdown = {};
  const parser = Parser(gitdown);

  /**
   * Process template.
   *
   * @returns {Promise}
   */
  gitdown.get = async () => {
    const state = await parser.play(input);

    let markdown;
    markdown = state.markdown;

    if (gitdown.getConfig().headingNesting.enabled) {
      markdown = Gitdown.nestHeadingIds(markdown);
    }

    markdown = Gitdown.prefixRelativeUrls(markdown);

    await gitdown.resolveURLs(markdown);

    return markdown.replace(/<!--\sgitdown:\s(:?off|on)\s-->/g, '');
  };

  /**
   * Write processed template to a file.
   *
   * @param {string} fileName
   * @returns {Promise}
   */
  gitdown.writeFile = async (fileName) => {
    const outputString = await gitdown.get();

    return fs.writeFileSync(fileName, outputString);
  };

  /**
   * @param {string} name
   * @param {object} helper
   */
  gitdown.registerHelper = (name, helper) => {
    parser.registerHelper(name, helper);
  };

  /**
   * Returns the first directory in the callstack that is not this directory.
   *
   * @private
   * @returns {string} Path to the directory where Gitdown was invoked.
   */
  gitdown.executionContext = () => {
    let index;

    const stackTrace = StackTrace.get();
    const stackTraceLength = stackTrace.length;

    index = 0;

    while (index++ < stackTraceLength) {
      const stackDirectory = path.dirname(stackTrace[index].getFileName());

      if (__dirname !== stackDirectory) {
        return stackDirectory;
      }
    }

    throw new Error('Execution context cannot be determined.');
  };

  /**
   * @private
   * @param {string} markdown
   */
  gitdown.resolveURLs = (markdown) => {
    let promises;
    let urls;

    const repositoryURL = gitinfo.compile({name: 'url'}, {gitdown}) + '/tree/' + gitinfo.compile({name: 'branch'}, {gitdown});
    const deadlink = Deadlink();

    urls = Array.from(getUrls(markdown));

    urls = urls.map((url) => {
      let resolvedUrl;

      // @todo What if it isn't /README.md?
      // @todo Test.
      if (_.startsWith(url, '#')) {
        // Github is using JavaScript to resolve anchor tags under #uses-content- ID.
        resolvedUrl = repositoryURL + '#user-content-' + url.slice(1);
      } else {
        resolvedUrl = url;
      }

      return resolvedUrl;
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
      .each((Resolution) => {
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
   * @param {object} logger
   */
  gitdown.setLogger = (logger) => {
    if (!logger.info) {
      throw new Error('Logger must implement logger.info function.');
    }

    if (!logger.warn) {
      throw new Error('Logger must implement logger.warn function.');
    }

    instanceLogger = {
      info: logger.info,
      warn: logger.warn,
    };
  };

  /**
   * @returns {object}
   */
  gitdown.getLogger = () => {
    return instanceLogger;
  };

  /**
   * @typedef {object} config
   * @property {}
   */

  /**
   * @param {object} config
   * @returns {undefined}
   */
  gitdown.setConfig = (config) => {
    if (!_.isPlainObject(config)) {
      throw new TypeError('config must be a plain object.');
    }

    if (config.variable && !_.isObject(config.variable.scope)) {
      throw new Error('config.variable.scope must be set and must be an object.');
    }

    if (config.deadlink && !_.isBoolean(config.deadlink.findDeadURLs)) {
      throw new Error('config.deadlink.findDeadURLs must be set and must be a boolean value');
    }

    if (config.deadlink && !_.isBoolean(config.deadlink.findDeadFragmentIdentifiers)) {
      throw new Error('config.deadlink.findDeadFragmentIdentifiers must be set and must be a boolean value');
    }

    if (config.gitinfo && !fs.realpathSync(config.gitinfo.gitPath)) {
      throw new Error('config.gitinfo.gitPath must be set and must resolve an existing file path.');
    }

    instanceConfig = _.defaultsDeep(config, instanceConfig);
  };

  /**
   * @returns {object}
   */
  gitdown.getConfig = () => {
    return instanceConfig;
  };

  gitdown.setConfig({
    baseDirectory: process.cwd(),
    deadlink: {
      findDeadFragmentIdentifiers: false,
      findDeadURLs: false,
    },
    gitinfo: {
      gitPath: gitdown.executionContext(),
    },
    headingNesting: {
      enabled: true,
    },
    variable: {
      scope: {},
    },

  });

  return gitdown;
};

/**
 * Read input from a file.
 *
 * @param {string} fileName
 * @returns {Gitdown}
 */
Gitdown.readFile = (fileName) => {
  if (!path.isAbsolute(fileName)) {
    throw new Error('fileName must be an absolute path.');
  }

  const input = fs.readFileSync(fileName, {
    encoding: 'utf8',
  });

  const gitdown = Gitdown.read(input);

  const directoryName = path.dirname(fileName);

  gitdown.setConfig({
    baseDirectory: directoryName,
    gitinfo: {
      gitPath: directoryName,
    },
  });

  return gitdown;
};

/**
 * Prefixes "user-content-" to each Markdown internal link.
 *
 * @private
 * @param {string} inputMarkdown
 * @returns {string}
 */
Gitdown.prefixRelativeUrls = (inputMarkdown) => {
  return inputMarkdown.replace(/\[(.*?)]\(#(.*?)\)/gm, (match, text, anchor) => {
    return `[${text}](#user-content-${anchor})`;
  });
};

/**
 * Iterates through each heading in the document (defined using markdown)
 * and prefixes heading ID using parent heading ID.
 *
 * @private
 * @param {string} inputMarkdown
 * @returns {string}
 */
Gitdown.nestHeadingIds = (inputMarkdown) => {
  let outputMarkdown;

  const articles = [];
  const codeblocks = [];

  outputMarkdown = inputMarkdown;

  outputMarkdown = outputMarkdown.replace(/^```[\S\s]*?\n```/gm, (match) => {
    codeblocks.push(match);

    return '⊂⊂⊂C:' + codeblocks.length + '⊃⊃⊃';
  });

  outputMarkdown = outputMarkdown.replace(/^(#+)(.*$)/gm, (match, level, name) => {
    let normalizedName;

    const normalizedLevel = level.length;

    normalizedName = name.trim();

    articles.push({
      // `foo bar`
      // -foo-bar-
      // foo-bar
      id: _.trim(normalizedName.toLowerCase().replace(/\W+/g, '-'), '-'),
      level: normalizedLevel,
      name: normalizedName,
    });

    // `test`
    normalizedName = _.trim(marked(normalizedName));

    // <p><code>test</code></p>
    normalizedName = normalizedName.slice(3, -4);

    // <code>test</code>

    return `<a name="user-content-⊂⊂⊂H:${articles.length}⊃⊃⊃"></a>
<a name="⊂⊂⊂H:${articles.length}⊃⊃⊃"></a>
${_.repeat('#', normalizedLevel)} ${normalizedName}`;
  });

  outputMarkdown = outputMarkdown.replace(/^⊂⊂⊂C:(\d+)⊃⊃⊃/gm, () => {
    return codeblocks.shift();
  });

  const tree = contents.nestIds(MarkdownContents.tree(articles));

  Gitdown.nestHeadingIds.iterateTree(tree, (index, article) => {
    outputMarkdown = outputMarkdown.replace(new RegExp('⊂⊂⊂H:' + index + '⊃⊃⊃', 'g'), article.id);
  });

  return outputMarkdown;
};

/**
 * @private
 * @param {Array} tree
 * @param {Function} callback
 * @param {number} index
 */
Gitdown.nestHeadingIds.iterateTree = (tree, callback, index = 1) => {
  let nextIndex;

  nextIndex = index;

  tree.forEach((article) => {
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    callback(nextIndex++, article);

    if (article.descendants) {
      nextIndex = Gitdown.nestHeadingIds.iterateTree(article.descendants, callback, nextIndex);
    }
  });

  return nextIndex;
};

module.exports = Gitdown;
