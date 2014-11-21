var helper = {},
    MarkdownContents = require('markdown-contents');

helper = function (config, context) {
    var tree;

    config = config || {};
    config.maxLevel = config.maxLevel || 3;

    tree = MarkdownContents(context.markdown).tree();
    tree = helper.maxLevel(tree, config.maxLevel);

    return MarkdownContents.treeToMarkdown(tree);
};

/**
 * Removes tree descendants with level greater than maxLevel
 */
helper.maxLevel = function (tree, maxLevel) {
    maxLevel = maxLevel || 1;

    tree.forEach(function (article, index) {
        if (article.level > maxLevel) {
            delete tree[index];
        } else {
            article.descendants = helper.maxLevel(article.descendants, maxLevel)
        }
    });

    return tree;
};

helper.weight = function () {
    return 100;
};

module.exports = helper;