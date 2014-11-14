var helper = {},
    Promise = require('bluebird'),
    fs = require('fs');

helper = function (markdown, parameters) {
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

helper.weight = function () {
    return 20;
};

module.exports = helper;