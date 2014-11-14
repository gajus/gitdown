Gitdown is a markdown preprocessor for Github. It is a tool to help to maintain the documentation. Gitdown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

## Usage

```js
var gitdown;

// Read the markdown file written using the Gitdown extended markdown.
// File name is not important. "{name}.gitdown.md", "{name}.md" is recommended convention.
gitdown = Gitdown.read('./README.gitdown.md');

// If you have the subject in a string, call the constructor itself:
// gitdown = Gitdown('literal string');

// Output the markdown file.
gitdown.write('./README.md');
```

## Syntax

Gitdown extends markdown syntax using JSON:

```json
<<{"gitdown": "method name", "parameter name": "parameter value"}>>
```

The JSON object must have `gitdown` property that identifies the method you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the function you are referring to.

JSON strings that are not encapsulated in `<<>>` will remain untouched.

## Features

### Generate Table of Contents

```json
<<{"gitdown": "contents"}>>
```

Table of contents is generated using [Contents](https://github.com/gajus/contents).

The underlying implementation will render markdown file into HTML and then use Contents to generate the table of contents.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxDepth` | The maximum the level of the heading. | 3 |

### Include File

```json
<<{"gitdown": "include"}>>
```

Includes the contents of the file to the document. The included file can have Gitdown JSON hooks.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |

### Get File Size

```json
<<{"gitdown": "filesize"}>>
```

Returns file size formatted in human friendly format.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |
| `gzip` | A boolean value indicating whether to gzip the file first. | `false` |