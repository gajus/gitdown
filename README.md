

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


The JSON object must have a `gitdown` property that identifies the helper you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the helper that you are referring to.

JSON strings that are not encapsulated in `<<>>` and do not start with "gitdown" will remain untouched.

### Ignoring Sections of the Document

Use HTML comment tags to ignore sections of the document:



## Features

### Generate Badges

<!-- gitdown: off -->
```json
<<{"gitdown": "badge"}>>
```
<!-- gitdown: on -->

Gitdown is using the environment variables to generate the markdown for the badge, e.g. if it is an NPM badge, Gitdown will lookup the package name for the `package.json`.

Badges are generated using http://shields.io/.

#### Supported Services

* npm-version
* travis

#### Example

<!-- gitdown: off -->
```json
<<{"gitdown": "badge", "name": "npm"}>>
<<{"gitdown": "badge", "name": "travis"}>>
```
<!-- gitdown: on -->

Generates:

```markdown
[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat)](https://www.npmjs.org/package/gitdown)
[![Travis build status](http://img.shields.io/travis/gajus/gitdown/master.svg?style=flat)](https://travis-ci.org/gajus/gitdown)
```

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. See http://shields.io/. | N/A |
