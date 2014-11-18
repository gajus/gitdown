var helper = {},
    moment = require('moment');

helper = function (config) {
    config = config || {};
    config.format = config.format || 'X';

    return moment().format(config.format);
};

helper.weight = function () {
    return 10;
};

module.exports = helper;