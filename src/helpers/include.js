const helper = {};
const fs = require('fs');
const path = require('path');

/**
 * @typedef config
 * @property {String} file Path to a file.
 */

/**
 * @param {config} config
 * @param {Object} context
 */
helper.compile = (config = {}, context) => {
  if (!config.file) {
    throw new Error('config.file must be provided.');
  }

  config.file = path.resolve(context.gitdown.getConfig().baseDirectory, config.file);

  if (!fs.existsSync(config.file)) {
    // eslint-disable-next-line no-console
    console.log('config.file', config.file);

    throw new Error('Input file does not exist.');
  }

  return fs.readFileSync(config.file, {
    encoding: 'utf8'
  });
};

helper.weight = 20;

module.exports = helper;
