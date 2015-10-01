'use strict';

var helper,
    fs,
    path;

helper = {};
fs = require('fs');
path = require('path');

/**
 * @typedef config
 * @property {String} file Path to a file.
 */

/**
 * @param {config} config
 * @param {Object} context
 */
helper.compile = function (config, context) {
    config = config || {};

    if (!config.file) {
        throw new Error('config.file must be provided.');
    }

    console.log('context', context);

    config.file = path.resolve(context.gitdown.getConfig().baseDirectory, config.file);

    if (!fs.existsSync(config.file)) {
        throw new Error('Input file does not exist.');
    }

    return fs.readFileSync(config.file, {
        encoding: 'utf8'
    });
};

helper.weight = 20;

module.exports = helper;
