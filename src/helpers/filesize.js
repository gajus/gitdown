'use strict';

var helper = {},
    Promise = require('bluebird'),
    fs = require('fs'),
    zlib = require('zlib'),
    formatFileSize = require('filesize');

helper.compile = function (config) {
    config = config || {};
    config.gzip = config.gzip || false;

    if (!config.file) {
        return Promise.reject(new Error('config.file must be provided.'));
    }

    return helper._file(config.file, config.gzip)
        .then(function (fileSize) {
            return helper._format(fileSize);
        });
};

/**
 * Calculates size of a file. If gzip parameter is true,
 * calculates the gzipped size of a file.
 *
 * @param {String} file
 * @param {Boolean} gzip
 */
helper._file = function (file, gzip) {
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(file)) {
            return reject(new Error('Input file does not exist.'));
        }

        if (gzip) {
            fs.readFile(file, function (err, buf) {
                if (err) {
                    throw new Error(err);
                }

                zlib.gzip(buf, function (err, data) {
                    if (err) {
                        throw new Error(err);
                    }

                    resolve(data.length);
                });
            });
        } else {
            fs.stat(file, function (err, data) {
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
 * @param {Number} bytes
 * @param {String}
 */
helper._format = function (bytes) {
    return formatFileSize(bytes);
};

helper.weight = 10;

module.exports = helper;
