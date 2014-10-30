## Use

```js
// Read the markdown file written using the Gitdown syntactic sugar.
var gitdown = Gitdown.fromFile('./README.gitdown.md');

// Output the markdown file.
gitdown.save('./README.md');
```

### Table of Contents

You can generate Table of Contents for the document using `{{gitdown.contents}}` expression:

```markdown
{{gitdown.contents}}
```

Table of contents is generated using the default settings of [marked-toc](https://github.com/jonschlinkert/marked-toc).