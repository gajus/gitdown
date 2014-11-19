var helper = {},
    Gitinfo = require('gitinfo');

helper = function (config, context) {
    var parserConfig = context.gitdown.config().gitinfo,
        gitinfo = Gitinfo({gitPath: parserConfig.gitPath});

    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    if (['username', 'name', 'url', 'branch'].indexOf(config.name) == -1) {
        throw new Error('Unexpected config.name value ("' + config.name + '").');
    }

    if (typeof gitinfo[config.name] !== 'function') {
        throw new Error('Gitinfo module does not provide function "' + config.name + '".');
    }

    return gitinfo[config.name]();
};

helper.weight = function () {
    return 10;
};

module.exports = helper;