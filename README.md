[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat)](https://www.npmjs.org/package/gitdown)
[![Travis build status](http://img.shields.io/travis/gajus/gitdown/master.svg?style=flat)](https://travis-ci.org/gajus/gitdown)

Gitdown is a markdown preprocessor for Github. It is a tool to help to maintain the documentation. Gitdown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

What can Gitdown do better to streamline the documentation maintenance? [Raise an issue](https://github.com/gajus/gitdown/issues).

* [Usage](#usage)
* [Syntax](#syntax)
  * [Ignoring Sections of the Document](#ignoring-sections-of-the-document)
* [Features](#features)


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

### Generate Table of Contents

> This feature is under development.

<!-- gitdown: off -->
```json
<<{"gitdown": "contents"}>>
```
<!-- gitdown: on -->

Table of contents is generated using [Contents](https://github.com/gajus/contents).

The underlying implementation will render markdown file into HTML and then use Contents to generate the table of contents.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxDepth` | The maximum the level of the heading. | 3 |
### Reference an Anchor in the Repository

> This feature is under development.

<!-- gitdown: off -->
```json
<<{"gitdown": "anchor"}>>
```
<!-- gitdown: on -->

Generates a Github URL to the line in the source code with the anchor documentation tag of the same name.

Place a documentation tag `@gitdownanchor <name>` anywhere in the code base, e.g.

```js
/**
 * @gitdownanchor my-anchor-name
 */
```

Then reference the tag in the Gitdown document:

<!-- gitdown: off -->
```
Refer to [foo](<<{"gitdown": "anchor", "name": "my-anchor-name"}>>).
```
<!-- gitdown: on -->

The anchor name must match `/^[a-z]+[a-z0-9\-_:\.]*$/i`.

Gitdown will throw an error if the anchor is not found.

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Anchor name. | N/A |

#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `anchor.exclude` | Array of paths to exclude. | `['./dist/*']` |
### Include File

<!-- gitdown: off -->
```json
<<{"gitdown": "include"}>>
```
<!-- gitdown: on -->

Includes the contents of the file to the document. The included file can have Gitdown JSON hooks.

#### Example

See source code of [.gitdown/README.md](https://github.com/gajus/gitdown/blob/master/.gitdown/README.md).

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |
### Get File Size

<!-- gitdown: off -->
```json
<<{"gitdown": "filesize"}>>
```
<!-- gitdown: on -->

Returns file size formatted in human friendly format.

#### Example

<!-- gitdown: off -->
```json
<<{"gitdown": "filesize", "file": "src/gitdown.js"}>>
<<{"gitdown": "filesize", "file": "src/gitdown.js", "gzip": true}>>
```
<!-- gitdown: on -->

Generates:

```markdown
1.17 kB
450 B
```

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |
| `gzip` | A boolean value indicating whether to gzip the file first. | `false` |
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
### Date

<!-- gitdown: off -->
```json
<<{"gitdown": "date"}>>
```
<!-- gitdown: on -->

Prints date.

#### Example

<!-- gitdown: off -->
```json
<<{"gitdown": "date"}>>
<<{"gitdown": "date", "format": "YYYY"}>>
```
<!-- gitdown: on -->

Generates:

```markdown
1416149861
2014
```

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `format` | [Moment format](http://momentjs.com/docs/#/displaying/format/). | `X` (UNIX timestamp) |