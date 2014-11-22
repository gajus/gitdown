var helper = {},
    moment = require('moment');

helper.compile = function (config) {
    config = config || {};
    config.format = config.format || 'X';

    return moment().format(config.format);
};

helper.weight = 10;

module.exports = helper;