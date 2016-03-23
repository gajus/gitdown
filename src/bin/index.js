#!/usr/bin/env node

/* eslint-disable import/no-commonjs */

const _ = require('lodash');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

const fileExists = (filePath) => {
    let stat;

    try {
        stat = fs.statSync(filePath);
    } catch (error) {
        // Continue regardless of error.
    }

    return stat && stat.isFile();
};

const argv = yargs
    .usage('Usage: $0 <README.md> [options]')
    .demand(1, 1, 'Gitdown program must be executed with exactly one non-option argument.')
    .options({
        force: {
            default: false,
            demand: false,
            describe: 'Write to file with different extension than ".md".',
            type: 'boolean'
        },
        'output-file': {
            demand: true,
            describe: 'Path to the output file.',
            type: 'string'
        }
    })
    .example('$0 ./.README/README.md --output-file ./README.md')
    .example('$0 ./.README/README.md --output-file ./README.txt --force')
    .wrap(null)
    .check((sargv) => {
        if (!_.startsWith(sargv._[0], './')) {
            throw new Error('Input file path must be a relative path. It must start with "./", e.g. "./README".');
        }

        if (!_.startsWith(sargv.outputFile, './')) {
            throw new Error('Output file path must be a relative path. It must start with "./", e.g. "./README".');
        }

        const inputFile = path.resolve(process.cwd(), sargv._[0]);

        if (!fileExists(inputFile)) {
            throw new Error('Input file does not exist.');
        }

        const outputFile = sargv.outputFile;
        const outputFileExtension = path.extname(outputFile).toLowerCase();
        const outputFileExists = path.resolve(process.cwd(), outputFile);

        if (outputFileExists && outputFileExists === inputFile) {
            throw new Error('Output file cannot overwrite the input file.');
        }

        if (outputFileExtension !== '.md' && !sargv.force) {
            throw new Error('Cannot write into a file with an extension different than ".md". Use --force option.');
        }

        return true;
    })
    .strict()
    .argv;

((inputFile, outputFile) => {
    const resolvedInputFile = path.resolve(process.cwd(), inputFile);
    const resolvedOutputFile = path.resolve(process.cwd(), outputFile);

    /* eslint-disable global-require */
    const Gitdown = require('./../');
    /* eslint-enable */
    const gitdown = Gitdown.readFile(resolvedInputFile);

    gitdown.writeFile(resolvedOutputFile);
})(
    argv._[0],
    argv.outputFile
);
