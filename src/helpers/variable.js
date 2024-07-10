import _ from 'lodash';

const variable = {};
variable.compile = (config = {}, context) => {
  const scope = context.gitdown.getConfig().variable.scope;

  if (!config.name) {
    throw new Error('config.name must be provided.');
  }

  const magicUndefined = 'undefined-' + Math.random();
  const value = _.get(scope, config.name, magicUndefined);

  if (value === magicUndefined) {
    throw new Error('config.name "' + config.name + '" does not resolve to a defined value.');
  }

  return value;
};

variable.weight = 10;

export default variable;
