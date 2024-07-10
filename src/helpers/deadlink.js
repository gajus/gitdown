const deadlink = {};

deadlink.compile = () => {
  throw new Error('This helper cannot be called from the context of the markdown document.');
};

deadlink.weight = 100;

export default deadlink;
