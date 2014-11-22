var helper = {},
    fs = require('fs');

/**
 *
 */
helper.compile = function (config) {
    config = config || {};

    if (!config.file) {
        throw new Error('config.file must be provided.');
    }

    if (!fs.existsSync(config.file)) {
        throw new Error('Input file does not exist.');
    }

    return fs.readFileSync(config.file, {
        encoding: 'utf8'
    });
};

helper.weight = 20;

module.exports = helper;