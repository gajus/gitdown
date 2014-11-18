var Parser,
    Promise = require('bluebird'),
    Locator = require('./locator.js');

/**
 * Parser is responsible for matching all of the instances of the Gitdown JSON and invoking
 * the associated operator functions. Operator functions are invoked in the order of the weight
 * associated with each function. Each operator function is passed the markdown document in
 * its present state (with alterations as a result of the preceding operator functions) and the
 * config from the JSON. This process is repeated until all commands have been executed and
 * parsing the document does not result in alteration of its state, i.e. there are no more Gitdown
 * JSON hooks that could have been generated by either of the preceding operator functions.
 *
 * @return {Parser}
 */
Parser = function Parser () {
    var parser,
        bindingIndex = 0;

    if (!(this instanceof Parser)) {
        return new Parser();
    }

    parser = this;

    /**
     * Iterates markdown parsing and execution of the parsed commands until all of the
     * commands have been executed and the document does not no longer change after parsing it.
     * 
     * @param {String} markdown
     * @param {Array} commands
     * @return {Promise} Promise is resolved with the state object.
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

            if (state.done) {
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
     * @param {String} _markdown
     * @param {Array} commands
     */
    parser.parse = function (markdown, commands) {
        var ignoreSection = [];

        // console.log('\n\n\n\ninput markdown:\n\n', markdown);

        // @see http://regex101.com/r/zO0eV6/2
        // console.log('markdown (before)', markdown);

        // /[\s\S]/ is an equivalent of /./m
        markdown = markdown.replace(/<!--\sgitdown:\soff\s-->[\s\S]*?(?:$|<!--\sgitdown:\son\s-->)/g, function (match) {
            ignoreSection.push(match);
            return '⊂⊂I:' + ignoreSection.length + '⊃⊃';
        });

        // console.log('markdown (after)', markdown);

        markdown = markdown.replace(/({"gitdown"(?:[^}]+}))/g, function (match) {
            var command = JSON.parse(match),
                name = command.gitdown,
                config = command;

            delete config.gitdown;

            bindingIndex++;

            if (!Parser.helpers[name]) {
                throw new Error('Unknown helper "' + name + '".');
            }

            commands.push({
                bindingIndex: bindingIndex,
                name: name,
                config: config,
                helper: Parser.helpers[name],
                executed: false
            });

            return '⊂⊂C:' + (bindingIndex) + '⊃⊃';
        });

        markdown = markdown.replace(/⊂⊂I:([0-9]+)⊃⊃/g, function (match, p1) {
            return ignoreSection[parseInt(p1, 10) - 1];
        });

        // console.log('\n\n\n\nmarkdown:\n\n', markdown);

        return {
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
            state.done = true;

            return Promise.resolve(state);
        }

        // Find the lowest weight among all of the not executed commands.

        lowestWeight = Math.min.apply(null, notExecutedCommands.map(function (command) {
            return command.helper.weight();
        }));

        // console.log('lowestWeight', lowestWeight);

        // Find all commands with the lowest weight.
        lowestWeightCommands = notExecutedCommands.filter(function (command) {
            var commandWeight = command.helper.weight();

            return commandWeight == lowestWeight;
        });

        // Execute each command and update markdown binding.
        lowestWeightCommands.forEach(function (command) {
            var promise = Promise.resolve(command.helper(state.markdown, command.config, Locator));

            promise.then(function (value) {
                state.markdown = state.markdown.replace('⊂⊂C:' + command.bindingIndex + '⊃⊃', value);

                command.executed = true;
            });

            act.push(promise);
        });

        // console.log('lowestWeightCommands', lowestWeightCommands, '\n\n\n\n');

        return Promise
            .all(act)
            .then(function () {
                return state;
            });
    };
};

Parser.loadHelpers = function () {
    var glob = require('glob'),
        path = require('path');

    Parser.helpers = {};

    glob.sync(__dirname + '/helpers/*.js').forEach(function (helper) {
        Parser.helpers[path.basename(helper, '.js')] = require(helper);
    });
};

Parser.loadHelpers();

module.exports = Parser;