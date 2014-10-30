## Use

```js
// Read the markdown file written using the Gitdown syntactic sugar.
var gitdown = Gitdown.fromFile('./README.gitdown.md');

// Output the markdown file.
gitdown.save('./README.md');
```

### Dead URLs

Gitdown will iterate through all of the URLs in the document and throw an error if request to the URL results in HTTP status other than 200.

```js
{
    lookForURL: true
}
```

### Dead Anchor URLs

Gitdown will iterate through all of the URLs that use anchors to reference content an throw an error when the anchor cannot be resolved.

```js
{
    lookForURLAnchor: true
}
```

### Load JSON

### Badges

```Handlebars
{{gitdown.badge.npm}}
{{gitdown.badge.bower}}
{{gitdown.badge.travis-ci}}
{{gitdown.badge.twitter.tweet}}
{{gitdown.badge.twitter.retweet}}
```

Most of the badges will be generated using https://badge.fury.io/.

Missing a badge? Open an issue and it will be added.

In addition to inserting the markdown code for the badge, Gitdown will decache the image URL.

### Table of Contents

You can generate Table of Contents for the document using `{{gitdown.contents}}` expression:

```Handlebars
{{gitdown.contents}}
```

Table of contents is generated using the default settings of [marked-toc](https://github.com/jonschlinkert/marked-toc).

### Reference an Anchor in the Repository

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

Gitdown will thow an error if the anchor is not found.

### Produce Documentation for the Doc bloc

### function body for the reference

#### Exclude From Index

Gitdown will throw an error if there are multiple anchors in the code base using the same name.

Configure `gitdown.anchor.exclude` to exclude paths matching the expression:

```js
gitdown.anchor.exclude = [
    '/dist/*'
];
```

### File Size

Use `{{gitdown.filesize}}` to get file size:

```Handlebars
{{gitdown.filesize}}./dist/foo.js{{gitdown.filesize}}
```

Use `{{gitdown.filesize.gzip}}` to calculate gziped file size:

```Handlebars
{{gitdown.filesize.gzip}}./dist/foo.js{{/gitdown.filesize.gzip}}
```

### Timestamp

`{{gitdown.timestamp}}` returns UNIX timestamp. This is mostly useful to decache content.


### Include File

You can include an arbitrary file.

```Handlebars
{{gitdown.include}}./file/path/relative/to/the/repository{{/gitdown.include}}
```

### Template

Gitdown comes with several templates for (Install)


### API documentation

e.g. https://github.com/kimmobrunfeldt/progressbar.js#api