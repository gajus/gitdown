import fs from 'fs';
import path from 'path';

const include = {};

/**
 * @typedef config
 * @property {string} file Path to a file.
 */

/**
 * @param {config} config
 * @param {object} context
 */
include.compile = (config = {}, context) => {
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
    encoding: 'utf8',
  });
};

include.weight = 20;

export default include;
