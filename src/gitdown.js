var Gitdown = {},
    Promise = require('bluebird'),
    fs = require('fs');

/**
 * @param {String|Promise} input
 */
Gitdown = function Gitdown (input) {
    var gitdown;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(input);
    }

    gitdown = this;

    input = Promise.resolve(input);

    /**
     * Renders input.
     * 
     * @return {Promise}
     */
    gitdown.get = function () {
        return input
            .then(function (inputString) {
                return inputString;
            });
    };

    gitdown.write = function (fileName) {
        return new Promise(function (resolve, reject) {
            gitdown
                .get()
                .then(function (outputString) {
                    fs.writeFile(fileName, outputString, function () {
                        resolve();
                    });
                });
        });
    };
};

/**
 * Read input from a file.
 * 
 * @param {String} fileName
 * @return {Gitdown}
 */
Gitdown.read = function (fileName) {
    var input = new Promise(function (resolve, reject) {
        fs.readFile(fileName, {
            encoding: 'utf8'
        }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return Gitdown(input);
};

Gitdown.util = {};
Gitdown.util.size = require('./util/size.js');
Gitdown.util.link = require('./util/link.js');

module.exports = Gitdown;