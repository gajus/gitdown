## Use

```js
// Read the markdown file written using the Gitdown syntactic sugar.
var gitdown = Gitdown.fromFile('./README.gitdown.md');

// Output the markdown file.
gitdown.save('./README.md');
```

### Look For Dead URLs

Gitdown will iterate through all of the URLs in the resulting markdown document and throw an error if request to the URL results in HTTP status 404.

```js
{
    findDeadURL: true
}
```

### Look For Dead Fragment Identifiers

Gitdown will iterate through all of the URLs in the resulting markdown document that use a [fragment identifier](http://www.w3.org/html/wg/drafts/html/master/browsers.html#scroll-to-fragid) (anchor) and throw an error if anchor cannot be found.

```js
{
    findDeadFragmentIdentifierRemote: true,
    findDeadFragmentIdentifierLocal: true
}
```

* `findDeadFragmentIdentifierRemote` will look at fragment identifiers that refer to documents outside of the file that is being processed.
* `findDeadFragmentIdentifierLocal` will look at fragment identifiers only with local references (e.g. `[More Examples](#more-examples)`.

### Get File Size

Calculates the size of a file. Returns size formatted to a human friendly format.

| Method | Parameter | Description |
| --- | --- | --- |
| `gitdown.filesize` | Path to the file. | Size of the file. |
| `gitdown.filesize.gzip` | Path to the file. | Size of the file after it has been gzipped. |

```Handlebars
{{gitdown.filesize}}./dist/foo.js{{gitdown.filesize}}
{{gitdown.filesize.gzip}}./dist/foo.js{{gitdown.filesize.gzip}}
```