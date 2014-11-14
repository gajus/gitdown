Gitdown is a markdown preprocessor for Github. It is a tool to help to maintain the documentation. Gitdown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

What can Gitdown do better to streamline the documentation maintenance? [Raise an issue](https://github.com/gajus/gitdown/issues).

## Usage

```js
var Gitdown = require('gitdown'),
    gitdown;

// Read the markdown file written using the Gitdown extended markdown.
// File name is not important.
// Having all of the Gitdown markdown files under .gitdown/ path is a recommended convention.
gitdown = Gitdown.read('.gitdown/README.md');

// If you have the subject in a string, call the constructor itself:
// gitdown = Gitdown('literal string');

// Output the markdown file.
// All of the file system operations are relative to the root of the repository.
gitdown.write('README.md');
```

## Syntax

Gitdown extends markdown syntax using JSON:

```json
<<{"gitdown": "helper name", "parameter name": "parameter value"}>>
```

The JSON object must have `gitdown` property that identifies the helper you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the function you are referring to.

JSON strings that are not encapsulated in `<<>>` will remain untouched.

## Features

<<{"gitdown": "./.gitdown/helpers/contents.md"}>>
<<{"gitdown": "./.gitdown/helpers/anchor.md"}>>
<<{"gitdown": "./.gitdown/helpers/include.md"}>>
<<{"gitdown": "./.gitdown/helpers/filesize.md"}>>
<<{"gitdown": "./.gitdown/helpers/badge.md"}>>
<<{"gitdown": "./.gitdown/helpers/timestamp.md"}>>