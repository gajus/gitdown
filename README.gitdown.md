## Use

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

## Configuration

```js
var config = {};
```

### Find Dead URLs and Fragment Identifiers

Gitdown is using [Deadlink](https://github.com/gajus/deadlink) to find dead URLs and Fragment Identifiers.

Deadlink extracts all URLs from the resulting markdown document and ensure that the URL and the associated fragment identifier are resolvable. This includes all remote URLs, remote and local anchor links (e.g. `[Download](#download)`).

```js
config.findDeadURL = true;
config.findDeadFragmentIdentifier = true;
```

## Gitdown API

### Get File Size

Calculates the file size. Returns size formatted in a human friendly format.

| Method | Parameter | Description |
| --- | --- | --- |
| `gitdown.filesize` | Path to the file. | Size of the file. |
| `gitdown.filesize.gzip` | Path to the file. | Size of the file after it has been gzipped. |

```Handlebars
{{gitdown.filesize}}./dist/foo.js{{gitdown.filesize}}
{{gitdown.filesize.gzip}}./dist/foo.js{{gitdown.filesize.gzip}}
```