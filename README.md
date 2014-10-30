## Use

```js
// Read the markdown file written using the Gitdown syntactic sugar.
var gitdown = Gitdown.fromFile('./README.gitdown.md');

// Output the markdown file.
gitdown.save('./README.md');
```

### Find Dead URLs

Gitdown will iterate through all of the URLs and throw an error if request to the URL results in HTTP status other than 200.

```js
{
    findDeadURL: true
}
```

### Find Dead Fragment Identifiers

Gitdown will iterate through all of the URLs that use a [fragment identifier](http://www.w3.org/html/wg/drafts/html/master/browsers.html#scroll-to-fragid) (anchor) and throw an error if anchor cannot be found.

```js
{
    findDeadFragmentIdentifier: true
}
```

### Variables

`user` property is designed to pass arbitrary data to the document scope under `{{gitdown.user}}` namespace.

```js
{
    user: {
        foo: 'bar'
    }
}
```

This will make:

```Handlebars
{{gitdown.user.foo}}
```

To resolve "bar".

Beware that unresolved references will render empty.

### Import JSON

Use `Gitdown.json(filename)` to read and parse JSON files. In combination with (User Variables)[#user-variables], it can be used to import arbitrary data (e.g. package configuration) to the document scope.

The `filename` is relative to the repository.

```js
{
    user: {
        package: Gitdown.json('package.json')
    }
}
```

`Gitdown.json` will throw an error if file is not found or cannot be parsed as JSON.













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

Use `{{gitdown.filesize}}` to get the file size:

```Handlebars
{{gitdown.filesize}}./dist/foo.js{{gitdown.filesize}}
```

Use `{{gitdown.filesize.gzip}}` to calculate the gziped file size:

```Handlebars
{{gitdown.filesize.gzip}}./dist/foo.js{{/gitdown.filesize.gzip}}
```

### Timestamp

`{{gitdown.timestamp}}` returns UNIX timestamp. This is mostly useful to decache content, e.g.

```Handlebars
[!foo](http://foo.com/picture.png?time={{gitdown.timestamp}})
```

### Include File

You can include an arbitrary file.

```Handlebars
{{gitdown.include}}./file/path/relative/to/the/repository{{/gitdown.include}}
```

If you are including a code block that requires syntax highlighting, you must wrap the code block yourself, e.g.


```Handlebars
```json
{{gitdown.include}}./package.json{{/gitdown.include}}
```
```

### Template

Gitdown comes with several templates for (Install)


### API documentation

e.g. https://github.com/kimmobrunfeldt/progressbar.js#api