var helper = {},
    Promise = require('bluebird'),
    fs = require('fs');

helper = function (markdown, config) {
    config = config || {};

    return new Promise(function (resolve, reject) {
        if (!config.file) {
            return reject(new Error('config.file must be provided.'));
        }

        if (!fs.existsSync(config.file)) {
            return reject(new Error('Input file does not exist.'));
        }

        fs.readFile(config.file, {
            encoding: 'utf8'
        }, function (err, data) {
            resolve(data);
        });
    });
};

helper.weight = function () {
    return 20;
};

module.exports = helper;