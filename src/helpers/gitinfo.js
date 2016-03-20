/* eslint-disable import/no-commonjs */

const helper = {};
const _ = require('lodash');
const Gitinfo = require('gitinfo');

helper.compile = (config, context) => {
    const parserConfig = context.gitdown.getConfig().gitinfo;
    const gitinfo = Gitinfo({
        gitPath: parserConfig.gitPath
    });

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    if (['username', 'name', 'url', 'branch'].indexOf(config.name) === -1) {
        throw new Error('Unexpected config.name value ("' + config.name + '").');
    }

    if (!_.isFunction(gitinfo[config.name])) {
        throw new Error('Gitinfo module does not provide function "' + config.name + '".');
    }

    return gitinfo[config.name]();
};

helper.weight = 10;

module.exports = helper;
