import MarkdownContents from 'markdown-contents';

const contents = {};
contents.compile = (config = {}, context) => {
  let tree;

  config.maxLevel = config.maxLevel || 3;

  if (context.gitdown.getConfig().headingNesting.enabled) {
    tree = MarkdownContents(context.markdown).tree();
    tree = contents.nestIds(tree);
  } else {
    const articles = MarkdownContents(context.markdown).articles();

    tree = MarkdownContents.tree(articles, true, []);
  }

  if (config.rootId) {
    tree = contents.findRoot(tree, config.rootId).descendants;
  }

  tree = contents.maxLevel(tree, config.maxLevel);

  return MarkdownContents.treeToMarkdown(tree);
};

/**
 * Removes tree descendants with level greater than maxLevel.
 *
 * @private
 */
contents.maxLevel = (tree, maxLevel = 1) => {
  return tree.filter((article) => {
    if (article.level > maxLevel) {
      return false;
    } else {
      article.descendants = contents.maxLevel(article.descendants, maxLevel);

      return true;
    }
  });
};

/**
 * @private
 */
contents.findRoot = (tree, rootId, notFirst) => {
  let found;
  let index;

  index = tree.length;

  while (index--) {
    if (tree[index].id === rootId) {
      found = tree[index];

      break;
    } else {
      found = contents.findRoot(tree[index].descendants, rootId, true);
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
contents.nestIds = (tree, parentIds = []) => {
  for (const article of tree) {
    const ids = parentIds.concat([
      article.id,
    ]);

    article.id = ids.join('-');

    contents.nestIds(article.descendants, ids);
  }

  return tree;
};

contents.weight = 100;

export default contents;
