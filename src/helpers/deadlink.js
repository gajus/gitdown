var helper = {},
    deadlink = require('deadlink');

helper.compile = function (config, context) {
    throw new Error('This helper cannot be called from the context of the markdown document.');
};

helper.weight = 100;

module.exports = helper;