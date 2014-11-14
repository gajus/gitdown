### Find Dead URLs and Fragment Identifiers

To iterate through all of the URLs and throw an error if request to the URL results in HTTP status other than 200:

```js
findDeadURLs();
```

To iterate through all of the URLs that have a [fragment identifier](http://www.w3.org/html/wg/drafts/html/master/browsers.html#scroll-to-fragid) (anchor) and throw an error if anchor cannot be found:

```js
findDeadFragmentIdentifiers();
```