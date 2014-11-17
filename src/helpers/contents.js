var helper = {},
    contents = require(__dirname + '/../../../2014 09 11 contents/src/contents.js');

helper = function (markdown, config) {
    var raw;

    config = config || {};

    config.maxDepth = config.maxDepth || 3;

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