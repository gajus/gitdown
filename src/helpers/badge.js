var helper = {},
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    exec = require('child_process').exec
    Promise = require('bluebird');

helper = function (config, context) {
    config = config || {};

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    helper.service_npm_version = function () {
        var pkg = context.locator.repositoryPath() + '/package.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./package.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![NPM version](http://img.shields.io/npm/v/' + pkg.name + '.svg?style=flat)](https://www.npmjs.org/package/' + pkg.name + ')';
    };

    helper.service_bower_version = function () {
        var pkg = context.locator.repositoryPath() + '/bower.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./bower.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![Bower version](http://img.shields.io/bower/v/' + pkg.name + '.svg?style=flat)](http://bower.io/search/?q=' + pkg.name + ')';
    };

    helper.service_travis = function () {
        return new Promise(function (resolve) {
            exec('git config --get remote.origin.url | cut -d: -f2 | rev | cut -c 5- | rev; git rev-parse --abbrev-ref HEAD', function (err, env) {
                env = env.trim().split('\n');

                resolve('[![Travis build status](http://img.shields.io/travis/' + env[0] + '/' + env[1] + '.svg?style=flat)](https://travis-ci.org/' + env[0] + ')');
            })
        });
    };

    if (!helper['service_' + config.name.replace(/-/g, '_')]) {
        throw new Error('config.name "' + config.name + '" is unknown service.');
    }

    return helper['service_' + config.name.replace(/-/g, '_')]();
};

helper.weight = function () {
    return 10;
};

module.exports = helper;