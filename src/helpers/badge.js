var helper = {},
    fs = require('fs'),
    jsonfile = require('jsonfile');

helper = function (markdown, config, Locator) {
    config = config || {};

    if (!config.name) {
        throw new Error('Badge config.name must be provided.');
    }

    helper.service_npm_version = function () {
        var pkg = Locator.repositoryPath() + '/package.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./package.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[!http://img.shields.io/npm/v/' + pkg.name + '.svg?style=flat](https://www.npmjs.org/package/' + pkg.name + ')';
    };

    if (!helper['service_' + config.name.replace(/-/g, '_')]) {
        throw new Error('Badge config.name "' + config.name + '" is unknown service.');
    }

    return helper['service_' + config.name.replace(/-/g, '_')]();
};

helper.weight = function () {
    return 10;
};

module.exports = helper;