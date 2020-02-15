#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const argv = yargs
  .usage('Usage: $0 <README.md> [options]')
  .demand(1, 1, 'Gitdown program must be executed with exactly one non-option argument.')
  .options({
    check: {
      default: false,
      description: 'Checks if the destination file represents the current state of the template. Terminates program with exit status 1 if generating a new document would result in changes of the target document. Terminates program with exit status 0 otherwise (without writng to the destination).',
      type: 'boolean',
    },
    force: {
      default: false,
      describe: 'Write to file with different extension than ".md".',
      type: 'boolean',
    },
    'output-file': {
      demand: true,
      describe: 'Path to the output file.',
      type: 'string',
    },
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

    try {
      fs.accessSync(inputFile, fs.constants.W_OK);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('inputFile', inputFile);

      throw new Error('Input file does not exist or cannot be written by the calling process.');
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

const main = async () => {
  const inputFile = argv._[0];
  const outputFile = argv.outputFile;

  const resolvedInputFile = path.resolve(process.cwd(), inputFile);
  const resolvedOutputFile = path.resolve(process.cwd(), outputFile);

  // eslint-disable-next-line global-require
  const Gitdown = require('..');

  const gitdown = Gitdown.readFile(resolvedInputFile);

  if (argv.check) {
    const generatedMarkdown = await gitdown.get();

    if (fs.readFileSync(resolvedOutputFile, 'utf-8') === generatedMarkdown) {
      return;
    } else {
      // eslint-disable-next-line no-console
      console.error('Gitdown destination file does not represent the current state of the template.');

      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    return;
  }

  gitdown.writeFile(resolvedOutputFile);
};

main();
