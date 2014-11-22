## Usage

GitDown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

```js
var GitDown = require('gitdown'),
    gitdown,
    config = {};

// Read the markdown file written using the GitDown extended markdown.
// File name is not important.
// Having all of the GitDown markdown files under .gitdown/ path is a recommended convention.
gitdown = GitDown.read('.gitdown/README.md');

// If you have the subject in a string, call the constructor itself:
// gitdown = GitDown('literal string');

// Output the markdown file.
// All of the file system operations are relative to the root of the repository.
gitdown.write('README.md');
```

### Gulp

GitDown `write` method returns a promise, that will make Gulp wait until the task is completed. No third-party plugins needed.

```js
var gulp = require('gulp'),
    GitDown = require('gitdown');

gulp.task('gitdown', function () {
    return GitDown
        .read('.gitdown/README.md')
        .write('README.md');
});

gulp.task('watch', function () {
    gulp.watch(['./.gitdown/*'], ['gitdown']);
});
```

### Parser Configuration

Parser configuration is an [access descriptor property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) `gitdown.config`.

```js
var config;

// Get parser configuration.
config = gitdown.config;

// Modify configuration.
config.gitinfo.gitPath = __dirname;

// Set parser configuration.
gitdown.config = config;
```

Modifying property of a resolved configuration object will bypass the configuration object validation:

```js
// Do not do this.
gitdown.config.gitinfo.gitPath = __dirname;
```

### Logging

GitDown is using `console` object to log messages. You can set your own logger:

```js
gitdown.logger = {
    info: function () {},
    warn: function () {}
};
```

The logger is used to inform about [Dead URLs and Fragment Identifiers](#find-dead-urls-and-fragment-identifiers).

## Syntax

GitDown extends markdown syntax using JSON:

<!-- gitdown: off -->
```json
{"gitdown": "helper name", "parameter name": "parameter value"}
```
<!-- gitdown: on -->

The JSON object must have a `gitdown` property that identifies the helper you intend to execute. The rest is a regular JSON string, where each property is a named configuration property of the helper that you are referring to.

JSON that does not start with a "gitdown" property will remain untouched.

### Ignoring Sections of the Document

Use HTML comment tags to ignore sections of the document:

```html
GitDown JSON will be interpolated.
<!-- gitdown: off -->
GitDown JSON will not be interpolated.
<!-- gitdown: on -->
GitDown JSON will be interpolated.
```