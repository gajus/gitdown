var Gitdown,
    Input,
    Mustache = require('mustache'),
    jsonfile = require('jsonfile'),
    contents = require('marked-toc'),
    fs = require('fs');

Gitdown = function (input) {
    var gitdown = {},
        rootPath = Gitdown.getRepositoryPath(),
        env = {};

    env.gitdown = {
        foo: 'bar'
    };

    /**
     * 
     */
    env.gitdown.contents = 'test';

    /**
     * @return {String}
     */
    gitdown.render = function () {
        // Temporary convert all {{}} expressions that to not start with "gitdown" to
        // §§}} to avoid templating system from interpreting it.
        input = input.replace(/{{(?!gitdown)/, function (match) {
            return '§§';
        });

        input = Mustache.render(input, env);

        input = input.replace(/§§/, function (match) {
            return '{{';
        });

        return input;
    };

    return gitdown;
};

Gitdown.render = {};
Gitdown.render.contents = function (input) {
    return contents.raw(input, {
        template: '<%= depth %><%= bullet %>[<%= heading %>](#<%= url %>)\n',
        bullet: '*',
        maxDepth: 3,
        firsth1: false,
        omit: ['Table of Contents', 'TOC', 'TABLE OF CONTENTS', 'Contents'],
        clean: [],
        blacklist: true,
        allowedChars: '-'
    }).toc;
};

/**
 * @param {String} dirname Path to start the iteration with.
 * @return {String} Path to the .git directory
 */
Gitdown.getGitPath = function (dirname) {
    var gitpath;

    dirname = dirname || __dirname;

    do {
        if (fs.existsSync(dirname + '/.git')) {
            gitpath = dirname + '/.git';

            break;
        }

        dirname = fs.realpathSync(dirname + '/..');
    } while (fs.existsSync(dirname) && dirname != '/');

    if (!gitpath) {
        throw new Error('.git path cannot be located.');
    }

    return gitpath;
};

/**
 * @return {String} Path to the repository.
 */
Gitdown.getRepositoryPath = function () {
    return fs.realpathSync(Gitdown.getGitPath() + '/..');
};

Gitdown.readFile = function (inputFile) {
    var input;

    if (!fs.existsSync(inputFile)) {
        throw new Error('Input file does not exist.')
    }

    input = fs.readFileSync(inputFile, {encoding: 'utf8'});

    return Gitdown.read(input);
};

Gitdown.read = function (input) {
    return Gitdown(input);
};

module.exports = Gitdown;