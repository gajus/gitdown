'use strict';

var helper = {},
    MarkdownContents = require('markdown-contents');

helper.compile = function (config, context) {
    var articles,
        tree;

    config = config || {};
    config.maxLevel = config.maxLevel || 3;

    if (context.gitdown.config.headingNesting.enabled) {
        tree = MarkdownContents(context.markdown).tree();
        tree = helper._nestIds(tree);
    } else {
        articles = MarkdownContents(context.markdown).articles();
        tree = MarkdownContents.tree(articles, true, []);
    }

    if (config.rootId) {
        tree = helper._findRoot(tree, config.rootId).descendants;
    }

    tree = helper._maxLevel(tree, config.maxLevel);

    return MarkdownContents.treeToMarkdown(tree);
};

/**
 * Removes tree descendants with level greater than maxLevel
 */
helper._maxLevel = function (tree, maxLevel) {
    maxLevel = maxLevel || 1;

    tree.forEach(function (article, index) {
        if (article.level > maxLevel) {
            delete tree[index];
        } else {
            article.descendants = helper._maxLevel(article.descendants, maxLevel);
        }
    });

    return tree;
};

/**
 *
 */
helper._findRoot = function (tree, rootId, notFirst) {
    var found,
        i = tree.length;

    while (i--) {
        if (tree[i].id === rootId) {
            found = tree[i];

            break;
        } else {
            found = helper._findRoot(tree[i].descendants, rootId, true);
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
helper._nestIds = function (tree, parentIds) {
    parentIds = parentIds || [];

    tree.forEach(function (article) {
        var ids = parentIds.concat([article.id]);

        article.id = ids.join('-');

        helper._nestIds(article.descendants, ids);
    });

    return tree;
};

helper.weight = 100;

module.exports = helper;
