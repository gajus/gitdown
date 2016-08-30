const helper = {};
const moment = require('moment');

helper.compile = (config = {}) => {
  config.format = config.format || 'X';

  return moment().format(config.format);
};

helper.weight = 10;

module.exports = helper;
