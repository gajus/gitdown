'use strict';

var helper = {};

helper.compile = function () {
    throw new Error('This helper cannot be called from the context of the markdown document.');
};

helper.weight = 100;

module.exports = helper;
