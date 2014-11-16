var helper = {},
    contents = require('marked-toc');

helper = function (markdown, config) {
    config = config || {};

    config.maxDepth = config.maxDepth || 3;

    return contents(markdown, {
        template: '<%= depth %><%= bullet %> [<%= heading %>](#<%= url %>)\n',
        bullet: '*',
        maxDepth: config.maxDepth,
        firsth1: false,
        omit: ['xxx'],
        clean: [],
        blacklist: true,
        allowedChars: '-'
    });
};

helper.weight = function () {
    return 100;
};

module.exports = helper;