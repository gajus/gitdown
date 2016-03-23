/* eslint-disable import/no-commonjs */

const helper = {};
const _ = require('lodash');

helper.compile = (config = {}, context) => {
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

helper.weight = 10;

module.exports = helper;
