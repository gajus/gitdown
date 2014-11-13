var Gitdown = {},
    Promise = require('bluebird'),
    fs = require('fs'),
    bindingIndex = 0;

/**
 * @param {String|Promise} input
 */
Gitdown = function Gitdown (input) {
    var gitdown;

    if (!(this instanceof Gitdown)) {
        return new Gitdown(input);
    }

    gitdown = this;

    input = Promise.resolve(input);

    /**
     * 
     */
    gitdown._execute = function (command) {
        if (command.gitdown == 'test') {
            return Promise.resolve('test');
        }
    };

    /*return Promise
            .all(commands)
            .then(function () {
                commands.forEach(function (promise, i) {
                    inputString = inputString.replace('⊂' + (i + 1) + '⊃', promise.value());
                });

                return inputString;
            });*/

    /**
     * Process input.
     * 
     * @return {Promise}
     */
    gitdown.get = function () {
        return input
            .then(gitdown._parse);
    };

    /**
     * Write processed input to a file.
     *
     * @param {String} fileName
     */
    gitdown.write = function (fileName) {
        return gitdown
            .get()
            .then(function (outputString) {
                return fs.writeFileSync(fileName, outputString);
            });
    };
};

/**
 * Read input from a file.
 * 
 * @param {String} fileName
 * @return {Gitdown}
 */
Gitdown.read = function (fileName) {
    var input = fs.readFileSync(fileName, {
        encoding: 'utf8'
    });

    return Gitdown(input);
};

/**
 * 
 * 
 * @return {String} Path to the .git directory.
 */
Gitdown._getGitPath = function () {
    var gitpath;

    dirname = __dirname;

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
 * Returns the parent path of the .git path.
 * 
 * @return {String} Path to the repository.
 */
Gitdown._getRepositoryPath = function () {
    return fs.realpathSync(Gitdown._getGitPath() + '/..');
};

Gitdown.Parser = function Parser () {
    var parser;

    if (!(this instanceof Parser)) {
        return new Parser();
    }

    parser = this;

    /**
     * Iterates markdown parsing and execution of the parsed commands
     * until there are no more commands to execute.
     * 
     * @param {String} markdown
     * @param {Array} commands
     */
    parser.play = function (markdown, commands) {
        var state;

        commands = commands || [];

        state = parser.parse(markdown, commands);

        act = parser.execute(state);

        return act.then(function (state) {
            var notExecutedCommands;

            notExecutedCommands = state.commands
                .filter(function (command) {
                    return !command.executed;
                });

            if (state.inputMarkdown == state.markdown && !notExecutedCommands.length) {
                return state;
            } else {
                return parser.play(state.markdown, state.commands);
            }
        });
    };

    /**
     * Parses the markdown for Gitdown JSON. Replaces the said JSON with placeholders for
     * the output of the command defined in the JSON.
     * 
     * @see http://stackoverflow.com/questions/26910402/regex-to-match-json-in-a-document/26910403
     * @param {String} inputMarkdown
     * @param {Array} commands
     */
    parser.parse = function (inputMarkdown, commands) {
        // console.log('parser.parse', 'inputMarkdown', inputMarkdown);

        markdown = inputMarkdown.replace(/<<({"gitdown"(?:[^}]+}))>>/g, function (match) {
            var command = JSON.parse(match.slice(2, -2)),
                name = command.gitdown,
                parameters = command;

            delete parameters.gitdown;

            bindingIndex++;

            commands.push({
                bindingIndex: bindingIndex,
                name: name,
                parameters: parameters,
                util: Gitdown.utils[name],
                executed: false
            });

            return '⊂⊂' + (bindingIndex) + '⊃⊃';
        });

        return {
            inputMarkdown: inputMarkdown,
            markdown: markdown,
            commands: commands
        };
    };

    /**
     * Execute all of the commands sharing the lowest common weight against
     * the current state of the markdown document.
     * 
     * @param {Object} state
     * @return {Promise} Promise resolves to a state after all of the commands have been resolved.
     */
    parser.execute = function (state) {
        var lowestWeight,
            lowestWeightCommands,
            notExecutedCommands,
            act = [];

        notExecutedCommands = state.commands.filter(function (command) {
            return !command.executed;
        });

        if (!notExecutedCommands.length) {
            return Promise.resolve(state);
        }

        // Find the lowest weight among all of the not executed commands.
        lowestWeight = notExecutedCommands.map(function (command) {
            return command.util._weight();
        }).sort()[0];

        // Find all commands with the lowest weight.
        lowestWeightCommands = notExecutedCommands.filter(function (command) {
            var commandWeight = command.util._weight();

            return commandWeight == lowestWeight;
        });

        // Execute each command and update markdown binding.
        lowestWeightCommands.forEach(function (command) {
            var promise = command.util(state.markdown, command.parameters);

            promise.then(function (value) {
                state.markdown = state.markdown.replace('⊂⊂' + command.bindingIndex + '⊃⊃', value);

                command.executed = true;
            });

            act.push(promise);
        });

        return Promise
            .all(act)
            .then(function () {
                return state;
            });
    };
};

Gitdown.utils = {};
Gitdown.utils.test = require('./util/test.js');
Gitdown.utils.test_weight_10 = require('./util/test_weight_10.js');
Gitdown.utils.test_weight_20 = require('./util/test_weight_20.js');
Gitdown.utils.include = require('./util/include.js');

module.exports = Gitdown;