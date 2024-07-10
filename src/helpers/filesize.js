import fs from 'fs';
import zlib from 'zlib';
import Promise from 'bluebird';
import formatFileSize from 'filesize';

const helper = {};

helper.compile = async (config = {}) => {
  config.gzip = config.gzip || false;

  if (!config.file) {
    throw new Error('config.file must be provided.');
  }

  const fileSize = await helper.file(config.file, config.gzip);

  return helper.format(fileSize);
};

/**
 * Calculates size of a file. If gzip parameter is true,
 * calculates the gzipped size of a file.
 *
 * @private
 * @param {string} file
 * @param {boolean} gzip
 */
helper.file = (file, gzip) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(file)) {
      // eslint-disable-next-line no-console
      console.log('file', file);

      reject(new Error('Input file does not exist.'));

      return;
    }

    if (gzip) {
      fs.readFile(file, (readFileError, buf) => {
        if (readFileError) {
          throw new Error(readFileError);
        }

        zlib.gzip(buf, (zlibError, data) => {
          if (zlibError) {
            throw new Error(zlibError);
          }

          resolve(data.length);
        });
      });
    } else {
      fs.stat(file, (statError, data) => {
        if (statError) {
          throw new Error(statError);
        }

        resolve(data.size);
      });
    }
  });
};

/**
 * Formats size in bytes to a human friendly format.
 *
 * @private
 * @param {number} bytes
 */
helper.format = (bytes) => {
  return formatFileSize(bytes);
};

helper.weight = 10;

export default helper;
