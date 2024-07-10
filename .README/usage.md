## Command Line Usage

```sh
npm install gitdown -g
gitdown ./.README/README.md --output-file ./README.md

```

## API Usage

Gitdown is designed to be run using either of the build systems, such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/).

```js
const Gitdown = require('gitdown');

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

### Gulp

Gitdown `writeFile` method returns a promise, that will make Gulp wait until the task is completed. No third-party plugins needed.

```js
const gulp = require('gulp');
const Gitdown = require('gitdown');

gulp.task('gitdown', () => {
  return Gitdown
    .readFile('./.README/README.md')
    .writeFile('README.md');
});

gulp.task('watch', () => {
  gulp.watch(['./.README/*'], ['gitdown']);
});

```

### Logging

Gitdown is using `console` object to log messages. You can set your own logger:

```js
gitdown.setLogger({
  info: () => {},
  warn: () => {}
});

```

The logger is used to inform about [Dead URLs and Fragment Identifiers](#find-dead-urls-and-fragment-identifiers).

## Syntax

Gitdown extends markdown syntax using JSON:

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
Gitdown JSON will be interpolated.
&lt;!-- gitdown: off --&gt;
Gitdown JSON will not be interpolated.
&lt;!-- gitdown: on --&gt;
Gitdown JSON will be interpolated.

```

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

<!-- gitdown: off -->
```json
{"gitdown": "my-helper-name", "foo": "bar"}

```
<!-- gitdown: on -->

Produces:

```markdown
foo: bar

```
