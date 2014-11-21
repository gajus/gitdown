var helper = {},
    MarkdownContents = require('markdown-contents');

helper = function (config, context) {
    //var raw;
    //config = config || {};
    //config.maxDepth = config.maxDepth || 3;

    return MarkdownContents(context.markdown).markdown();

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