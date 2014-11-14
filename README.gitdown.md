Gitdown is a markdown preprocessor for Github. It is a tool to help to maintain the documentation. Gitdown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

Is there anything that Gitdown can do better to streamline the documentation maintenance? [Raise an issue](https://github.com/gajus/gitdown/issues).

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
<<{"gitdown": "helper name", "parameter name": "parameter value"}>>
```

The JSON object must have `gitdown` property that identifies the helper you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the function you are referring to.

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

### Generate Badges

```json
<<{"gitdown": "badge"}>>
```

Generates badge markdown for the requested service, e.g.

```
[![NPM version](https://badge.fury.io/js/brim.svg?time=1415967099)](http://badge.fury.io/js/brim)
[![Bower version](https://badge.fury.io/bo/brim.svg?time=1415967099)](http://badge.fury.io/bo/brim)
```

Gitdown will be using the environment to load the info required to generate the badge, e.g. if it is NPM badge, it will lookup `package.json` file in the root directory of the repository.

In addition to generating the markdown code, Gitdown will de-cache the image URL (using `?time` parameter).

Most of the badges will be generated using https://badge.fury.io/.

#### Supported Services

* https://www.npmjs.org/
* http://bower.io/
* https://travis-ci.org/

Missing a badge? [Raise an issue](https://github.com/gajus/gitdown/issues) and I will add it.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. | N/A |

{{gitdown.badge.npm}}
{{gitdown.badge.bower}}
{{gitdown.badge.travis-ci}}
{{gitdown.badge.twitter.tweet}}
{{gitdown.badge.twitter.retweet}}
```