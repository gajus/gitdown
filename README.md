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
| `name` | Anchor name. | N/A |

#### Parser Configuration

| Name | Description | Default |
| `anchor.exclude` | Array of paths to exclude. | `['./dist/*']` |
### Include File

<!-- gitdown: off -->
```json
<<{"gitdown": "include"}>>
```
<!-- gitdown: on -->

Includes the contents of the file to the document. The included file can have Gitdown JSON hooks.

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

Generates badge markdown for the requested service, e.g.

```markdown
[![NPM version](https://badge.fury.io/js/gitdown.svg?time=1415967099)](http://badge.fury.io/js/gitdown)
[![Bower version](https://badge.fury.io/bo/gitdown.svg?time=1415967099)](http://badge.fury.io/bo/gitdown)
```

Gitdown will be using the environment to load the info required to generate the badge, e.g. if it is NPM badge, it will lookup `package.json` file in the root directory of the repository.

In addition to generating the markdown code, Gitdown will de-cache the image URL (using `?time` parameter).

Most of the badges will be generated using https://badge.fury.io/.

#### Supported Services

* https://www.npmjs.org/ (npm)
* http://bower.io/ (bower)
* https://travis-ci.org/ (travis-ci)

Missing a badge? [Raise an issue](https://github.com/gajus/gitdown/issues) and I will add it.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. | N/A |
undefined