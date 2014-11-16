var helper = {},
    contents = require('marked-toc');

helper = function (markdown, config) {
    config = config || {};

    return contents(markdown, {
        template: '<%= depth %><%= bullet %> [<%= heading %>](#<%= url %>)\n',
        bullet: '*',
        maxDepth: config.maxDepth || 3,
        firsth1: false,
        omit: ['Table of Contents', 'TOC', 'TABLE OF CONTENTS', 'Contents'],
        clean: [],
        blacklist: true,
        allowedChars: '-'
    });
};

helper.weight = function () {
    return 100;
};

module.exports = helper;