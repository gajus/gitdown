var helper = {},
    fs = require('fs'),
    jsonfile = require('jsonfile');

helper.compile = function (config, context) {
    var services = {};

    config = config || {};

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    /**
     *
     */
    services['npm-version'] = function () {
        var pkg = context.locator.repositoryPath() + '/package.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./package.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![NPM version](http://img.shields.io/npm/v/' + pkg.name + '.svg?style=flat)](https://www.npmjs.org/package/' + pkg.name + ')';
    };

    /**
     *
     */
    services['bower-version'] = function () {
        var bower = context.locator.repositoryPath() + '/bower.json';

        if (!fs.existsSync(bower)) {
            throw new Error('./bower.json is not found.');
        }

        bower = jsonfile.readFileSync(bower);

        return '[![Bower version](http://img.shields.io/bower/v/' + bower.name + '.svg?style=flat)](http://bower.io/search/?q=' + bower.name + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/10
     */
    services['david'] = function () {
        var gitinfo = context.parser.helpers().gitinfo,
            repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context),
            badge = '![Dependency Status](https://david-dm.org/' + repository + '.svg?style=flat)';

        return '[' + badge + '](https://david-dm.org/' + repository + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/10
     */
    services['david-dev'] = function () {
        var gitinfo = context.parser.helpers().gitinfo,
            repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context),
            badge = '![Dependency Status](https://david-dm.org/' + repository + '/dev-status.svg?style=flat)';

        return '[' + badge + '](https://david-dm.org/' + repository + '#info=devDependencies)';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/12
     */
    services['gitter'] = function () {
        var gitinfo = context.parser.helpers().gitinfo,
            repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context),
            badge = '![Gitter chat](https://badges.gitter.im/' + repository + '.png)';

        return '[' + badge + '](https://gitter.im/' + repository + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/13
     */
    services['coveralls'] = function () {
        var gitinfo = context.parser.helpers().gitinfo,
            repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context),
            branch = gitinfo.compile({name: 'branch'}, context);
            badge = '![Coverage Status](https://img.shields.io/coveralls/' + repository + '/' + branch + '.svg)';

        return '[' + badge + '](https://coveralls.io/r/' + repository + '?branch=' + branch + ')';
    };

    /**
     * @todo Link does not include travis branch.
     */
    services.travis = function () {
        var rep = {},
            badge,
            gitinfo = context.parser.helpers().gitinfo,
            repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);

        rep.branch = gitinfo.compile({name: 'branch'}, context);

        badge = '![Travis build status](http://img.shields.io/travis/' + repository + '/' + rep.branch + '.svg?style=flat)';

        return '[' + badge + '](https://travis-ci.org/' + repository + ')';
    };

    /**
     *
     */
    services.waffle = function () {
        var badge,
            gitinfo = context.parser.helpers().gitinfo,
            repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);


        badge = '![Stories in Ready](https://badge.waffle.io/' + repository + '.svg?label=ready&title=Ready)';

        return '[' + badge + '](https://waffle.io/' + repository + ')';
    };

    if (!services[config.name]) {
        throw new Error('config.name "' + config.name + '" is unknown service.');
    }

    return services[config.name]();
};

helper.weight = 10;

module.exports = helper;