/* eslint-disable import/no-commonjs */

const helper = {};

helper.compile = () => {
    throw new Error('This helper cannot be called from the context of the markdown document.');
};

helper.weight = 100;

module.exports = helper;
