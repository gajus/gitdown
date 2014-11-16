var helper,
    Promise = require('bluebird'),
    fs = require('fs'),
    zlib = require('zlib'),
    formatFileSize = require('filesize');

helper = function (markdown, config) {
    config = config || {};
    config.gzip = config.gzip || false;

    if (!config.file) {
        return Promise.reject(new Error('config.file must be provided.'));
    }

    return helper.file(config.file, config.gzip)
        .then(function (fileSize) {
            return helper.format(fileSize);
        });
};

/**
 * Calculates size of a file. If gzip parameter is true,
 * calculates the gzipped size of a file.
 *
 * @param {String} file
 * @param {Boolean} gzip
 */
helper.file = function (file, gzip) {
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(file)) {
            return reject(new Error('Input file does not exist.'));
        }

        if (gzip) {
            fs.readFile(file, function (err, buf) {
                zlib.gzip(buf, function (err, data) {
                    resolve(data.length);
                });
            });
        } else {
            fs.stat(file, function (err, data) {
                resolve(data['size']);
            });
        }
    });
};

/**
 * Formats size in bytes to a human friendly format.
 * 
 * @param {Number} bytes
 * @param {String}
 */
helper.format = function (bytes) {
    return formatFileSize(bytes);
};

/**
 *
 */
helper.weight = function () {
    return 10;
};

module.exports = helper