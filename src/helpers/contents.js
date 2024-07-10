import MarkdownContents from 'markdown-contents';

const helper = {};
helper.compile = (config = {}, context) => {
  let tree;

  config.maxLevel = config.maxLevel || 3;

  if (context.gitdown.getConfig().headingNesting.enabled) {
    tree = MarkdownContents(context.markdown).tree();
    tree = helper.nestIds(tree);
  } else {
    const articles = MarkdownContents(context.markdown).articles();

    tree = MarkdownContents.tree(articles, true, []);
  }

  if (config.rootId) {
    tree = helper.findRoot(tree, config.rootId).descendants;
  }

  tree = helper.maxLevel(tree, config.maxLevel);

  return MarkdownContents.treeToMarkdown(tree);
};

/**
 * Removes tree descendants with level greater than maxLevel.
 *
 * @private
 */
helper.maxLevel = (tree, maxLevel = 1) => {
  return tree.filter((article) => {
    if (article.level > maxLevel) {
      return false;
    } else {
      article.descendants = helper.maxLevel(article.descendants, maxLevel);

      return true;
    }
  });
};

/**
 * @private
 */
helper.findRoot = (tree, rootId, notFirst) => {
  let found;
  let index;

  index = tree.length;

  while (index--) {
    if (tree[index].id === rootId) {
      found = tree[index];

      break;
    } else {
      found = helper.findRoot(tree[index].descendants, rootId, true);
    }
  }

  if (!notFirst && !found) {
    throw new Error('Heading does not exist with rootId ("' + rootId + '").');
  }

  return found;
};

/**
 * @private
 */
helper.nestIds = (tree, parentIds = []) => {
  for (const article of tree) {
    const ids = parentIds.concat([
      article.id,
    ]);

    article.id = ids.join('-');

    helper.nestIds(article.descendants, ids);
  }

  return tree;
};

helper.weight = 100;

export default helper;
