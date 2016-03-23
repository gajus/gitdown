/* eslint-disable import/no-commonjs */

const helper = {};
const fs = require('fs');
const jsonfile = require('jsonfile');

helper.compile = (config = {}, context) => {
    const services = {};

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    services['npm-version'] = () => {
        let pkg;

        pkg = context.locator.repositoryPath() + '/package.json';

        if (!fs.existsSync(pkg)) {
            throw new Error('./package.json is not found.');
        }

        pkg = jsonfile.readFileSync(pkg);

        return '[![NPM version](http://img.shields.io/npm/v/' + pkg.name + '.svg?style=flat)](https://www.npmjs.org/package/' + pkg.name + ')';
    };

    services['bower-version'] = () => {
        let bower;

        bower = context.locator.repositoryPath() + '/bower.json';

        if (!fs.existsSync(bower)) {
            throw new Error('./bower.json is not found.');
        }

        bower = jsonfile.readFileSync(bower);

        return '[![Bower version](http://img.shields.io/bower/v/' + bower.name + '.svg?style=flat)](http://bower.io/search/?q=' + bower.name + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/10
     */
    services.david = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const badge = '![Dependency Status](https://david-dm.org/' + repository + '.svg?style=flat)';

        return '[' + badge + '](https://david-dm.org/' + repository + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/10
     */
    services['david-dev'] = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const badge = '![Dependency Status](https://david-dm.org/' + repository + '/dev-status.svg?style=flat)';

        return '[' + badge + '](https://david-dm.org/' + repository + '#info=devDependencies)';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/12
     */
    services.gitter = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const badge = '![Gitter chat](https://badges.gitter.im/' + repository + '.png)';

        return '[' + badge + '](https://gitter.im/' + repository + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/13
     */
    services.coveralls = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const branch = gitinfo.compile({name: 'branch'}, context);
        const badge = '![Coverage Status](https://img.shields.io/coveralls/' + repository + '/' + branch + '.svg)';

        return '[' + badge + '](https://coveralls.io/r/' + repository + '?branch=' + branch + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/33
     */
    services.circleci = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const branch = gitinfo.compile({name: 'branch'}, context);
        const badge = '![Circle CI](https://img.shields.io/circleci/project/' + repository + '/circleci/' + branch + '.svg)';

        return '[' + badge + '](https://circleci.com/gh/' + repository + '?branch=' + branch + ')';
    };

    /**
     * @todo Link does not include travis branch.
     */
    services.travis = () => {
        const rep = {};
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);

        rep.branch = gitinfo.compile({name: 'branch'}, context);

        const badge = '![Travis build status](http://img.shields.io/travis/' + repository + '/' + rep.branch + '.svg?style=flat)';

        return '[' + badge + '](https://travis-ci.org/' + repository + ')';
    };

    /**
     *
     */
    services.waffle = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const badge = '![Stories in Ready](https://badge.waffle.io/' + repository + '.svg?label=ready&title=Ready)';

        return '[' + badge + '](https://waffle.io/' + repository + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/16
     */
    services['codeclimate-gpa'] = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = 'github/' + gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const badge = '![Code Climate](https://codeclimate.com/' + repository + '/badges/gpa.svg)';

        return '[' + badge + '](https://codeclimate.com/' + repository + ')';
    };

    services['codeclimate-coverage'] = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const repository = 'github/' + gitinfo.compile({name: 'username'}, context) + '/' + gitinfo.compile({name: 'name'}, context);
        const badge = '![Code Climate](https://codeclimate.com/' + repository + '/badges/coverage.svg)';

        return '[' + badge + '](https://codeclimate.com/' + repository + ')';
    };

    /**
     * @see https://github.com/gajus/gitdown/issues/35
     */
    services['appveyor'] = () => {
        const gitinfo = context.parser.helpers().gitinfo;
        const username = gitinfo.compile({name: 'username'}, context);
        const name = gitinfo.compile({name: 'name'}, context);
        const branch = gitinfo.compile({name: 'branch'}, context);
        const repository = `${username}/${name}`;
        const badge = `![AppVeyor build status](https://ci.appveyor.com/api/projects/status/github/${repository}?svg=true&branch=${branch})`;

        return `[${badge}](https://ci.appveyor.com/project/${repository}/branch/${branch})`;
    };

    if (!services[config.name]) {
        throw new Error('config.name "' + config.name + '" is unknown service.');
    }

    return services[config.name]();
};

helper.weight = 10;

module.exports = helper;
