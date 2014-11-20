var helper = {},
    deadlink = require('deadlink');

helper = function (config, context) {
    throw new Error('This helper cannot be called from the context of the markdown document.');
};

helper.weight = function () {
    return 100;
};

module.exports = helper;