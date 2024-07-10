[![GitSpo Mentions](https://gitspo.com/badges/mentions/gajus/gitdown?style=flat-square)](https://gitspo.com/mentions/gajus/gitdown)
[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat-square)](https://www.npmjs.org/package/gitdown)
[![Travis build status](http://img.shields.io/travis/brettz9/gitdown/update-readme.svg?style=flat-square)](https://travis-ci.org/brettz9/gitdown)
[![Dependency Status](https://img.shields.io/david/brettz9/gitdown.svg?style=flat-square)](https://david-dm.org/brettz9/gitdown)

Gitdown adds [additional functionality](#user-content-features) (generating table of contents, including documents, using variables, etc.) to [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/).

<a name="user-content-cheat-sheet"></a>
<a name="cheat-sheet"></a>
## Cheat Sheet


```js
// Generate table of contents
{"gitdown": "contents"}
{"gitdown": "contents", "maxLevel": 4}
{"gitdown": "contents", "rootId": "features"}

// Use a custom defined variable
{"gitdown": "variable", "name": "nameOfTheVariable"}

// Include file
{"gitdown": "include", "file": "./LICENSE.md"}

// Get file size
{"gitdown": "filesize", "file": "./src/gitdown.js"}
{"gitdown": "filesize", "file": "./src/gitdown.js", "gzip": true}

// Generate badges
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "bower-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}
{"gitdown": "badge", "name": "david-dev"}
{"gitdown": "badge", "name": "waffle"}

// Print date
{"gitdown": "date", "format": "YYYY"}

```


<a name="user-content-contents"></a>
<a name="contents"></a>
## Contents

* [Cheat Sheet](#user-content-cheat-sheet)
* [Contents](#user-content-contents)
* [Command Line Usage](#user-content-command-line-usage)
* [API Usage](#user-content-api-usage)
    * [Logging](#user-content-api-usage-logging)
* [Syntax](#user-content-syntax)
    * [Ignoring Sections of the Document](#user-content-syntax-ignoring-sections-of-the-document)
    * [Register a Custom Helper](#user-content-syntax-register-a-custom-helper)
* [Features](#user-content-features)
    * [Generate Table of Contents](#user-content-features-generate-table-of-contents)
    * [Heading Nesting](#user-content-features-heading-nesting)
    * [Find Dead URLs and Fragment Identifiers](#user-content-features-find-dead-urls-and-fragment-identifiers)
    * [Reference an Anchor in the Repository](#user-content-features-reference-an-anchor-in-the-repository)
    * [Variables](#user-content-features-variables)
    * [Include File](#user-content-features-include-file)
    * [Get File Size](#user-content-features-get-file-size)
    * [Generate Badges](#user-content-features-generate-badges)
    * [Print Date](#user-content-features-print-date)
    * [Gitinfo](#user-content-features-gitinfo)
* [Recipes](#user-content-recipes)
    * [Automating Gitdown](#user-content-recipes-automating-gitdown)


<a name="user-content-command-line-usage"></a>
<a name="command-line-usage"></a>
## Command Line Usage

```sh
npm install gitdown -g
gitdown ./.README/README.md --output-file ./README.md

```

<a name="user-content-api-usage"></a>
<a name="api-usage"></a>
## API Usage

```js
import Gitdown from 'gitdown';

// Read the markdown file written using the Gitdown extended markdown.
// File name is not important.
// Having all of the Gitdown markdown files under ./.README/ path is the recommended convention.
const gitdown = await Gitdown.readFile('./.README/README.md');

// If you have the subject in a string, call the constructor itself:
// gitdown = await Gitdown.read('literal string');

// Get config.
gitdown.getConfig()

// Set config.
gitdown.setConfig({
  gitinfo: {
    gitPath: __dirname
  }
})

// Output the markdown file.
// All of the file system operations are relative to the root of the repository.
gitdown.writeFile('README.md');
```

<a name="user-content-api-usage-logging"></a>
<a name="api-usage-logging"></a>
### Logging

Gitdown is using `console` object to log messages. You can set your own logger:

```js
gitdown.setLogger({
  info: () => {},
  warn: () => {}
});

```

The logger is used to inform about [Dead URLs and Fragment Identifiers](#user-content-find-dead-urls-and-fragment-identifiers).

<a name="user-content-syntax"></a>
<a name="syntax"></a>
## Syntax

Gitdown extends markdown syntax using JSON:


```json
{"gitdown": "helper name", "parameter name": "parameter value"}

```


The JSON object must have a `gitdown` property that identifies the helper you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the helper that you are referring to.

JSON that does not start with a "gitdown" property will remain untouched.

<a name="user-content-syntax-ignoring-sections-of-the-document"></a>
<a name="syntax-ignoring-sections-of-the-document"></a>
### Ignoring Sections of the Document

Use HTML comment tags to ignore sections of the document:

```html
Gitdown JSON will be interpolated.
&lt;!-- gitdown: off --&gt;
Gitdown JSON will not be interpolated.
&lt;!-- gitdown: on --&gt;
Gitdown JSON will be interpolated.

```

<a name="user-content-syntax-register-a-custom-helper"></a>
<a name="syntax-register-a-custom-helper"></a>
### Register a Custom Helper

```js
gitdown.registerHelper('my-helper-name', {
  /**
    * @var {Number} Weight determines the processing order of the helper function. Default: 10.
    */
  weight: 10,
  /**
    * @param {Object} config JSON configuration.
    * @return {mixed|Promise}
    */
  compile: (config) => {
      return 'foo: ' + config.foo;
  }
});
```


```json
{"gitdown": "my-helper-name", "foo": "bar"}

```


Produces:

```markdown
foo: bar

```


a

<a name="user-content-features"></a>
<a name="features"></a>
## Features

<a name="user-content-features-generate-table-of-contents"></a>
<a name="features-generate-table-of-contents"></a>
### Generate Table of Contents


```json
{"gitdown": "contents"}

```


Generates table of contents.

The table of contents is generated using [markdown-contents](https://github.com/gajus/markdown-contents).

<a name="user-content-features-generate-table-of-contents-example"></a>
<a name="features-generate-table-of-contents-example"></a>
#### Example


```json
{"gitdown": "contents", "maxLevel": 4, "rootId": "features"}

```


```markdown
* [Generate Table of Contents](#user-content-features-generate-table-of-contents)
    * [Example](#user-content-features-generate-table-of-contents-example)
    * [JSON Configuration](#user-content-features-generate-table-of-contents-json-configuration)
* [Heading Nesting](#user-content-features-heading-nesting)
    * [Parser Configuration](#user-content-features-heading-nesting-parser-configuration)
* [Find Dead URLs and Fragment Identifiers](#user-content-features-find-dead-urls-and-fragment-identifiers)
    * [Parser Configuration](#user-content-features-find-dead-urls-and-fragment-identifiers-parser-configuration-1)
* [Reference an Anchor in the Repository](#user-content-features-reference-an-anchor-in-the-repository)
    * [JSON Configuration](#user-content-features-reference-an-anchor-in-the-repository-json-configuration-1)
    * [Parser Configuration](#user-content-features-reference-an-anchor-in-the-repository-parser-configuration-2)
* [Variables](#user-content-features-variables)
    * [Example](#user-content-features-variables-example-1)
    * [JSON Configuration](#user-content-features-variables-json-configuration-2)
    * [Parser Configuration](#user-content-features-variables-parser-configuration-3)
* [Include File](#user-content-features-include-file)
    * [Example](#user-content-features-include-file-example-2)
    * [JSON Configuration](#user-content-features-include-file-json-configuration-3)
* [Get File Size](#user-content-features-get-file-size)
    * [Example](#user-content-features-get-file-size-example-3)
    * [JSON Configuration](#user-content-features-get-file-size-json-configuration-4)
* [Generate Badges](#user-content-features-generate-badges)
    * [Supported Services](#user-content-features-generate-badges-supported-services)
    * [Example](#user-content-features-generate-badges-example-4)
    * [JSON Configuration](#user-content-features-generate-badges-json-configuration-5)
* [Print Date](#user-content-features-print-date)
    * [Example](#user-content-features-print-date-example-5)
    * [JSON Configuration](#user-content-features-print-date-json-configuration-6)
* [Gitinfo](#user-content-features-gitinfo)
    * [Example](#user-content-features-gitinfo-example-6)
    * [Supported Properties](#user-content-features-gitinfo-supported-properties)
    * [JSON Configuration](#user-content-features-gitinfo-json-configuration-7)
    * [Parser Configuration](#user-content-features-gitinfo-parser-configuration-4)


```

<a name="user-content-features-generate-table-of-contents-json-configuration"></a>
<a name="features-generate-table-of-contents-json-configuration"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxLevel` | The maximum heading level after which headings are excluded. | 3 |
| `rootId` | ID of the root heading. Provide it when you need table of contents for a specific section of the document. Throws an error if element with the said ID does not exist in the document. | N/A |

<a name="user-content-features-heading-nesting"></a>
<a name="features-heading-nesting"></a>
### Heading Nesting

Github markdown processor generates heading ID based on the text of the heading.

The conflicting IDs are solved with a numerical suffix, e.g.

```markdown
# Foo
## Something
# Bar
## Something

```

```html
<h1 id="foo">Foo</h1>
<h2 id="something">Something</h1>
<h1 id="bar">Bar</h1>
<h2 id="something-1">Something</h1>

```

The problem with this approach is that it makes the order of the content important.

Gitdown will nest the headings using parent heading names to ensure uniqueness, e.g.

```markdown
# Foo
## Something
# Bar
## Something

```

```html
<h1 id="foo">Foo</h1>
<h2 id="foo-something">Something</h1>
<h1 id="bar">Bar</h1>
<h2 id="bar-something">Something</h1>

```

<a name="user-content-features-heading-nesting-parser-configuration"></a>
<a name="features-heading-nesting-parser-configuration"></a>
#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `headingNesting.enabled` | Boolean flag indicating whether to nest headings. | `true` |

<a name="user-content-features-find-dead-urls-and-fragment-identifiers"></a>
<a name="features-find-dead-urls-and-fragment-identifiers"></a>
### Find Dead URLs and Fragment Identifiers

Uses [Deadlink](https://github.com/gajus/deadlink) to iterate through all of the URLs in the resulting document. Throws an error if either of the URLs is resolved with an HTTP status other than 200 or fragment identifier (anchor) is not found.

<a name="user-content-features-find-dead-urls-and-fragment-identifiers-parser-configuration-1"></a>
<a name="features-find-dead-urls-and-fragment-identifiers-parser-configuration-1"></a>
#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `deadlink.findDeadURLs` | Find dead URLs. | `false` |
| `deadlink.findDeadFragmentIdentifiers` | Find dead fragment identifiers. | `false` |

<!-- -->
<!--| `deadlink.ignoreURLs` | URLs matching the regex will be ignored. | N/A |-->

<a name="user-content-features-reference-an-anchor-in-the-repository"></a>
<a name="features-reference-an-anchor-in-the-repository"></a>
### Reference an Anchor in the Repository

> This feature is under development.
> Please suggest ideas https://github.com/gajus/gitdown/issues


```json
{"gitdown": "anchor"}

```


Generates a Github URL to the line in the source code with the anchor documentation tag of the same name.

Place a documentation tag `@gitdownanchor <name>` anywhere in the code base, e.g.

```js
/**
 * @gitdownanchor my-anchor-name
 */

```

Then reference the tag in the Gitdown document:


```
Refer to [foo]({"gitdown": "anchor", "name": "my-anchor-name"}).

```


The anchor name must match `/^[a-z]+[a-z0-9\-_:\.]*$/i`.

Gitdown will throw an error if the anchor is not found.

<a name="user-content-features-reference-an-anchor-in-the-repository-json-configuration-1"></a>
<a name="features-reference-an-anchor-in-the-repository-json-configuration-1"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Anchor name. | N/A |

<a name="user-content-features-reference-an-anchor-in-the-repository-parser-configuration-2"></a>
<a name="features-reference-an-anchor-in-the-repository-parser-configuration-2"></a>
#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `anchor.exclude` | Array of paths to exclude. | `['./dist/*']` |

<a name="user-content-features-variables"></a>
<a name="features-variables"></a>
### Variables


```json
{"gitdown": "variable"}

```


Prints the value of a property defined under a parser `variable.scope` configuration property. Throws an error if property is not set.

<a name="user-content-features-variables-example-1"></a>
<a name="features-variables-example-1"></a>
#### Example


```js
const gitdown = Gitdown(
  '{"gitdown": "variable", "name": "name.first"}' +
  '{"gitdown": "variable", "name": "name.last"}'
);

gitdown.setConfig({
  variable: {
    scope: {
      name: {
        first: "Gajus",
        last: "Kuizinas"
      }
    }
  }
});

```


<a name="user-content-features-variables-json-configuration-2"></a>
<a name="features-variables-json-configuration-2"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the property defined under a parser `variable.scope` configuration property. | N/A |

<a name="user-content-features-variables-parser-configuration-3"></a>
<a name="features-variables-parser-configuration-3"></a>
#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `variable.scope` | Variable scope object. | `{}` |

<a name="user-content-features-include-file"></a>
<a name="features-include-file"></a>
### Include File


```json
{"gitdown": "include"}

```


Includes the contents of the file to the document.

The included file can have Gitdown JSON hooks.

<a name="user-content-features-include-file-example-2"></a>
<a name="features-include-file-example-2"></a>
#### Example

See source code of [./.README/README.md](https://github.com/gajus/gitdown/blob/master/.README/README.md).

<a name="user-content-features-include-file-json-configuration-3"></a>
<a name="features-include-file-json-configuration-3"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |

<a name="user-content-features-get-file-size"></a>
<a name="features-get-file-size"></a>
### Get File Size


```json
{"gitdown": "filesize"}

```


Returns file size formatted in human friendly format.

<a name="user-content-features-get-file-size-example-3"></a>
<a name="features-get-file-size-example-3"></a>
#### Example


```json
{"gitdown": "filesize", "file": "src/gitdown.js"}
{"gitdown": "filesize", "file": "src/gitdown.js", "gzip": true}

```


Generates:

```markdown
9.3 kB
2.8 kB

```

<a name="user-content-features-get-file-size-json-configuration-4"></a>
<a name="features-get-file-size-json-configuration-4"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |
| `gzip` | A boolean value indicating whether to gzip the file first. | `false` |

<a name="user-content-features-generate-badges"></a>
<a name="features-generate-badges"></a>
### Generate Badges


```json
{"gitdown": "badge"}

```


Gitdown generates markdown for badges using the environment variables, e.g. if it is an NPM badge, Gitdown will lookup the package name from `package.json`.

Badges are generated using http://shields.io/.

<a name="user-content-features-generate-badges-supported-services"></a>
<a name="features-generate-badges-supported-services"></a>
#### Supported Services

| Name | Description |
| --- | --- |
| `npm-version` | [NPM](https://www.npmjs.org/) package version. |
| `bower-version` | [Bower](http://bower.io/) package version. |
| `travis` | State of the [Travis](https://travis-ci.org/) build. |
| `david` | [David](https://david-dm.org/) state of the dependencies. |
| `david-dev` | [David](https://david-dm.org/) state of the development dependencies. |
| `waffle` | Issues ready on [Waffle](https://waffle.io/) board. |
| `gitter` | Join [Gitter](https://gitter.im/) chat. |
| `coveralls` | [Coveralls](https://coveralls.io/). |
| `codeclimate-gpa` | [Code Climate](https://codeclimate.com/) GPA. |
| `codeclimate-coverage` | [Code Climate](https://codeclimate.com/) test coverage. |
| `appveyor` | [AppVeyor](http://www.appveyor.com/) status. |

What service are you missing? [Raise an issue](https://github.com/gajus/gitdown/issues).

<a name="user-content-features-generate-badges-example-4"></a>
<a name="features-generate-badges-example-4"></a>
#### Example


```json
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}

```


Generates:

```markdown
[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat-square)](https://www.npmjs.org/package/gitdown)
[![Travis build status](http://img.shields.io/travis/brettz9/gitdown/update-readme.svg?style=flat-square)](https://travis-ci.org/brettz9/gitdown)
[![Dependency Status](https://img.shields.io/david/brettz9/gitdown.svg?style=flat-square)](https://david-dm.org/brettz9/gitdown)

```

<a name="user-content-features-generate-badges-json-configuration-5"></a>
<a name="features-generate-badges-json-configuration-5"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. | N/A |

<a name="user-content-features-print-date"></a>
<a name="features-print-date"></a>
### Print Date


```json
{"gitdown": "date"}

```


Prints a string formatted according to the given [moment format](http://momentjs.com/docs/#/displaying/format/) string using the current time.

<a name="user-content-features-print-date-example-5"></a>
<a name="features-print-date-example-5"></a>
#### Example


```json
{"gitdown": "date"}
{"gitdown": "date", "format": "YYYY"}

```


Generates:

```markdown
1563038327
2019

```

<a name="user-content-features-print-date-json-configuration-6"></a>
<a name="features-print-date-json-configuration-6"></a>
#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `format` | [Moment format](http://momentjs.com/docs/#/displaying/format/). | `X` (UNIX timestamp) |

<a name="user-content-features-gitinfo"></a>
<a name="features-gitinfo"></a>
### Gitinfo


```json
{"gitdown": "gitinfo"}

```


[Gitinfo](https://github.com/gajus/gitinfo) gets info about the local GitHub repository.

<a name="user-content-features-gitinfo-example-6"></a>
<a name="features-gitinfo-example-6"></a>
#### Example


```json
{"gitdown": "gitinfo", "name": "username"}
{"gitdown": "gitinfo", "name": "name"}
{"gitdown": "gitinfo", "name": "url"}
{"gitdown": "gitinfo", "name": "branch"}

```


```
brettz9
gitdown
https://github.com/brettz9/gitdown
update-readme

```

<a name="user-content-features-gitinfo-supported-properties"></a>
<a name="features-gitinfo-supported-properties"></a>
#### Supported Properties

|Name|Description|
|---|---|
|`username`|Username of the repository author.|
|`name`|Repository name.|
|`url`|Repository URL.|
|`branch`|Current branch name.|

<a name="user-content-features-gitinfo-json-configuration-7"></a>
<a name="features-gitinfo-json-configuration-7"></a>
#### JSON Configuration

|Name|Description|Default|
|---|---|---|
|`name`|Name of the property.|N/A|

<a name="user-content-features-gitinfo-parser-configuration-4"></a>
<a name="features-gitinfo-parser-configuration-4"></a>
#### Parser Configuration

|Name|Description|Default|
|---|---|---|
|`gitinfo.defaultBranchName`|Default branch to use when the current branch name cannot be resolved.|N/A|
|`gitinfo.gitPath`|Path to the `.git/` directory or a descendant. | `__dirname` of the script constructing an instance of `Gitdown`.|


<a name="user-content-recipes"></a>
<a name="recipes"></a>
## Recipes

<a name="user-content-recipes-automating-gitdown"></a>
<a name="recipes-automating-gitdown"></a>
### Automating Gitdown

Use [Husky](https://www.npmjs.com/package/husky) to check if user generated README.md before committing his changes.

```json
"husky": {
  "hooks": {
    "pre-commit": "npm run lint && npm run test && npm run build",
    "pre-push": "gitdown ./.README/README.md --output-file ./README.md --check",
  }
}

```

`--check` attributes makes Gitdown check if the target file differes from the source template. If the file differs then the program exits with an error code and message:

> Gitdown destination file does not represent the current state of the template.

Do not automate generating and committing documentation: automating commits will result in a noisy commit log.
