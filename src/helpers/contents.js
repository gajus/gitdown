var helper = {},
    MarkdownContents = require('markdown-contents');

helper = function (config, context) {
    var articles,
        tree;

    config = config || {};
    config.maxLevel = config.maxLevel || 3;

    tree = MarkdownContents(context.markdown).tree();
    tree = helper.nestIds(tree);

    if (config.rootId) {
        tree = helper.findRoot(tree, config.rootId).descendants;
    }

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

/**
 * 
 */
helper.findRoot = function (tree, rootId, notFirst) {
    var found,
        i = tree.length;

    while (i--) {
        if (tree[i].id == rootId) {
            found = tree[i];

            break;
        } else {
            found = helper.findRoot(tree[i].descendants, rootId, true);
        }
    }

    if (!notFirst && !found) {
        throw new Error('Heading does not exist with rootId ("' + rootId + '").');
    }

    return found;
};

/**
 * 
 */
helper.nestIds = function (tree, parentIds) {
    parentIds = parentIds || [];

    tree.forEach(function (article) {
        var ids = parentIds.concat([article.id]);
        
        article.id = ids.join('-');

        helper.nestIds(article.descendants, ids);
    });

    return tree;
};

helper.weight = function () {
    return 100;
};

module.exports = helper;