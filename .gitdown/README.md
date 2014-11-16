<<{"gitdown": "badge", "name": "npm-version"}>>
<<{"gitdown": "badge", "name": "travis"}>>

Gitdown is a markdown preprocessor for Github. It is a tool to help to maintain the documentation. Gitdown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

What can Gitdown do better to streamline the documentation maintenance? [Raise an issue](https://github.com/gajus/gitdown/issues).

<<{"gitdown": "contents", "maxDepth": 2}>>

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

// Provide parser configuration.
// gitdown.config({});

// Output the markdown file.
// All of the file system operations are relative to the root of the repository.
gitdown.write('README.md');
```

## Syntax

Gitdown extends markdown syntax using JSON:

<!-- gitdown: off -->
```json
<<{"gitdown": "helper name", "parameter name": "parameter value"}>>
```
<!-- gitdown: on -->

The JSON object must have a `gitdown` property that identifies the helper you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the helper that you are referring to.

JSON strings that are not encapsulated in `<<>>` and do not start with "gitdown" will remain untouched.

### Ignoring Sections of the Document

Use HTML comment tags to ignore sections of the document:

```html
Gitdown JSON will be interpreted.
<!-- gitdown: off -->
Gitdown JSON will not be interpreted.
<!-- gitdown: on -->
Gitdown JSON will be interpreted.
```

## Features

<<{"gitdown": "include", "file": ".gitdown/helpers/contents.md"}>>
<<{"gitdown": "include", "file": ".gitdown/helpers/anchor.md"}>>
<<{"gitdown": "include", "file": ".gitdown/helpers/include.md"}>>
<<{"gitdown": "include", "file": ".gitdown/helpers/filesize.md"}>>
<<{"gitdown": "include", "file": ".gitdown/helpers/badge.md"}>>
<<{"gitdown": "include", "file": ".gitdown/helpers/date.md"}>>