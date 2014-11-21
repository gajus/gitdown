var helper = {},
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    exec = require('child_process').exec
    Promise = require('bluebird'),
    gitinfo = require(__dirname + '/gitinfo.js');

helper = function (config, context) {
    config = config || {};

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    helper.service = {};

    helper.service.npm_version = function () {
        var pkg = context.locator.repositoryPath() + '/package.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./package.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![NPM version](http://img.shields.io/npm/v/' + pkg.name + '.svg?style=flat)](https://www.npmjs.org/package/' + pkg.name + ')';
    };

    helper.service.bower_version = function () {
        var pkg = context.locator.repositoryPath() + '/bower.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./bower.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![Bower version](http://img.shields.io/bower/v/' + pkg.name + '.svg?style=flat)](http://bower.io/search/?q=' + pkg.name + ')';
    };

    helper.service.travis = function () {
        var rep = {},
            badge;

        rep.username = gitinfo({name: 'username'}, context);
        rep.name = gitinfo({name: 'name'}, context);
        rep.branch = gitinfo({name: 'branch'}, context);

        badge = '![Travis build status](http://img.shields.io/travis/' + rep.username + '/' + rep.name + '/' + rep.branch + '.svg?style=flat)';

        return '[' + badge + '](https://travis-ci.org/' + rep.username + '/' + rep.name + ')';
    };

    if (!helper.service[config.name.replace(/-/g, '_')]) {
        throw new Error('config.name "' + config.name + '" is unknown service.');
    }

    return helper.service[config.name.replace(/-/g, '_')]();
};

helper.weight = function () {
    return 10;
};

module.exports = helper;