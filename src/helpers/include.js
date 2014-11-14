var util = {},
    Promise = require('bluebird'),
    fs = require('fs');

util = function (markdown, parameters) {
    return new Promise(function (resolve) {
        if (!parameters.file) {
            throw new Error('File parameter is required.');
        }

        fs.readFile(parameters.file, {
            encoding: 'utf8'
        }, function (err, data) {
            resolve(data);
        });
    });
};

util.weight = function () {
    return 20;
};

module.exports = util;