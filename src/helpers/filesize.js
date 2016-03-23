/* eslint-disable import/no-commonjs */

const helper = {};
const Promise = require('bluebird');
const fs = require('fs');
const zlib = require('zlib');
const formatFileSize = require('filesize');

helper.compile = (config = {}) => {
    config.gzip = config.gzip || false;

    if (!config.file) {
        return Promise.reject(new Error('config.file must be provided.'));
    }

    return helper
        .file(config.file, config.gzip)
        .then((fileSize) => {
            return helper.format(fileSize);
        });
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
            /* eslint-disable no-console */
            console.log('file', file);
            /* eslint-enable */

            return reject(new Error('Input file does not exist.'));
        }

        if (gzip) {
            fs.readFile(file, (err, buf) => {
                if (err) {
                    throw new Error(err);
                }

                zlib.gzip(buf, (zlibErr, data) => {
                    if (zlibErr) {
                        throw new Error(zlibErr);
                    }

                    resolve(data.length);
                });
            });
        } else {
            fs.stat(file, (err, data) => {
                if (err) {
                    throw new Error(err);
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

module.exports = helper;
