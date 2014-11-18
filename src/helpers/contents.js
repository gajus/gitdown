var helper = {};

helper = function (config) {
    var raw;

    config = config || {};

    config.maxDepth = config.maxDepth || 3;

    return '[Table of contents has been temporary removed.]';

    /*raw = contents.raw(markdown, {
        template: '<%= depth %><%= bullet %> [<%= heading %>](#<%= url %>)\n',
        bullet: '*',
        maxDepth: config.maxDepth,
        firsth1: false,
        omit: ['xxx'],
        clean: [],
        blacklist: false,
        allowedChars: '-'
    });

    return contents(markdown, {
        template: '<%= depth %><%= bullet %> [<%= heading %>](#<%= url %>)\n',
        bullet: '*',
        maxDepth: config.maxDepth,
        firsth1: false,
        omit: ['xxx'],
        clean: [],
        blacklist: false,
        allowedChars: '-'
    });*/
};

helper.weight = function () {
    return 100;
};

module.exports = helper;