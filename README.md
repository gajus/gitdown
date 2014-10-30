## Use

```js
// Read the markdown file written using the Gitdown syntactic sugar.
var gitdown = Gitdown.fromFile('./README.gitdown.md');

// Output the markdown file.
gitdown.save('./README.md');
```

### Table of Contents

You can generate Table of Contents for the document using `{{gitdown.contents}}` expression:

```Handlebars
{{gitdown.contents}}
```

Table of contents is generated using the default settings of [marked-toc](https://github.com/jonschlinkert/marked-toc).

### Include File

You can include an arbitrary file.

```Handlebars
{{gitdown.include}}./file/path/relative/to/the/repository{{/gitdown.include}}
```

### Reference an Anchor

Gitdown allows you to reference an anchor declared in the entire codebase.

Use documentation tag `@gitdownanchor <name>` to place an anchor in the code base, e.g.

```js
/**
 * @gitdownanchor my-anchor-name
 */
```

Use `{{gitdown.anchor}}my-anchor-name{{/gitdown.anchor}}` to get the link to the anchor.

```
Refer to [foo]({{gitdown.anchor}}my-anchor-name{{/gitdown.anchor}}).
```

The anchor name must match `/^[a-z]+[a-z0-9\-_:\.]*$/i`.

#### Exclude From Index

Gitdown will throw an error if there are multiple anchors in the code base using the same name.

Configure `gitdown.anchor.exclude` to exclude paths matching the expression:

```js
gitdown.anchor.exclude = [
    '/dist/*'
];
```