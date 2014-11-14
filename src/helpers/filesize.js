var helper,
    Promise = require('promise'),
    fs = require('fs'),
    zlib = require('zlib'),
    fileSize = require('filesize');

helper = function () {
    
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
            throw new Error('Input file does not exist.');
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
    return fileSize(bytes);
};


helper.weight = function () {
    return 1;
};

module.exports = helper