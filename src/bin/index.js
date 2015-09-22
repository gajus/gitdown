'use strict';

var yargs,
    argv,
    subject,
    _,
    fileExists;

yargs = require('yargs');

fileExists = function (path) {
    var fs,
        stat;

    fs = require('fs');

    try {
        stat = fs.statSync(path);
    } catch (e) {

    }

    return stat && stat.isFile();
};

argv = yargs
    .usage('Usage: $0 <README.md> [options]')
    .demand(1, 1, 'Gitdown program must be executed with exactly one non-option argument.')
    .options({
        'output-file': {
            demand: true,
            describe: 'Path to the output file.',
            type: 'string'
        },
        force: {
            demand: false,
            default: false,
            describe: 'Write to file with different extension than ".md".',
            type: 'boolean'
        }
    })
    .example('$0 ./.README/README.md --output-file ./README.md')
    .example('$0 ./.README/README.md --output-file ./README.txt --force')
    .wrap(null)
    .check(function (argv, options) {
        var fs,
            path,
            inFile,
            outputFile,
            outputFileExtension,
            outputFileExists;

        fs = require('fs');
        path = require('path');

        if (argv._[0].indexOf('./') !== 0) {
            throw new Error('Input file path must be a relative path. It must start with "./", e.g. "./README".');
        }

        if (argv.outputFile.indexOf('./') !== 0) {
            throw new Error('Output file path must be a relative path. It must start with "./", e.g. "./README".');
        }

        inFile = path.resolve(process.cwd(), argv._[0]);

        if (!fileExists(inFile)) {
            throw new Error('Input file does not exist.');
        }

        outputFile = argv.outputFile;
        outputFileExtension = path.extname(outputFile).toLowerCase();
        outputFileExists = path.resolve(process.cwd(), outputFile);

        if (outputFileExists && outputFileExists === inFile) {
            throw new Error('Output file cannot overwrite the input file.');
        }

        if (outputFileExtension !== '.md' && !argv.force) {
            throw new Error('Cannot write into a file with an extension different than ".md". Use --force option.');
        }

        return true;
    })
    .strict()
    .argv;

(function (inputFile, outputFile) {
    var Gitdown,
        gitdown,
        path,
        dirName;

    path = require('path');
    inputFile = path.resolve(process.cwd(), inputFile);
    outputFile = path.resolve(process.cwd(), outputFile);

    Gitdown = require('./../');
    gitdown = Gitdown.readFile(inputFile);
    gitdown.writeFile(outputFile);
} (
    argv._[0],
    argv.outputFile
));
