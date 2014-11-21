var helper = {},
    MarkdownContents = require('markdown-contents');

helper = function (config, context) {
    var tree;

    config = config || {};
    config.maxDepth = config.maxDepth || 3;

    tree = MarkdownContents(context.markdown).tree();
    tree = helper.maxDepth(tree, config.maxDepth);

    return MarkdownContents.treeToMarkdown(tree);
};

helper.maxDepth = function (tree, maxDepth) {
    maxDepth = maxDepth || 1;

    tree.forEach(function (article, index) {
        if (article.level > maxDepth) {
            delete tree[index];
        } else {
            article.descendants = helper.maxDepth(article.descendants, maxDepth)
        }
    });

    return tree;
};

helper.weight = function () {
    return 100;
};

module.exports = helper;