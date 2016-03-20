/* eslint-disable import/no-commonjs */

const helper = {};
const _ = require('lodash');

helper.compile = (config = {}, context) => {
    const scope = context.gitdown.getConfig().variable.scope;

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    const value = helper.resolve(scope, config.name);

    if (value === false) {
        throw new Error('config.name "' + config.name + '" does not resolve to a defined value.');
    }

    return value;
};

/**
 * @private
 */
helper.resolve = (obj, path = '') => {
    let resolvedValue;

    if (path.indexOf('[') !== -1) {
        throw new Error('Unsupported object path notation.');
    }

    const stoneList = path.split('.');

    resolvedValue = obj;

    do {
        if (_.isUndefined(resolvedValue)) {
            return false;
        }

        const stone = stoneList.shift();

        if (!resolvedValue.hasOwnProperty(stone)) {
            return false;
        }

        resolvedValue = resolvedValue[stone];
    } while (stoneList.length);

    return resolvedValue;
};

helper.weight = 10;

module.exports = helper;
