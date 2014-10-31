## Use

```js
// Read the markdown file written using the Gitdown syntactic sugar.
var gitdown = Gitdown.fromFile('./README.gitdown.md');

// Output the markdown file.
gitdown.save('./README.md');
```

### File Size

| Method | Description |
| --- | --- |
| `gitdown.filesize` | Calculates size of a file. Returns size formatted to a human friendly format. |
| `gitdown.filesize.gzip` | Calculates the size of a file. Returns size formatted to a human friendly format. |

```Handlebars
{{gitdown.filesize}}./dist/foo.js{{gitdown.filesize}}
{{gitdown.filesize.gzip}}./dist/foo.js{{gitdown.filesize.gzip}}
```