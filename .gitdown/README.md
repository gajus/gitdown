{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}

Gitdown adds [additional functionality](#features) (generating table of contents, including documents, using variables, etc.) to [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/).

## Cheat sheet

<!-- gitdown: off -->
```js
// Generate table of contents
{"gitdown": "contents"}

// Use a custom defined variable
{"gitdown": "variable", "name": "nameOfTheVariable"}

// Include file
{"gitdown": "include", "file": "LICENSE.md"}

// Get file size
{"gitdown": "filesize", "file": "src/gitdown.js"}
{"gitdown": "filesize", "file": "src/gitdown.js", "gzip": true}

// Generate badges
{"gitdown": "badge", "name": "npm"}
{"gitdown": "badge", "name": "travis"}

// Print date
{"gitdown": "date", "format": "YYYY"}
```
<!-- gitdown: on -->

## Contents

{"gitdown": "contents", "maxDepth": 2}

{"gitdown": "include", "file": ".gitdown/usage.md"}

## Features

{"gitdown": "include", "file": ".gitdown/helpers/contents.md"}
{"gitdown": "include", "file": ".gitdown/helpers/heading-nesting.md"}
{"gitdown": "include", "file": ".gitdown/helpers/deadlink.md"}
{"gitdown": "include", "file": ".gitdown/helpers/anchor.md"}
{"gitdown": "include", "file": ".gitdown/helpers/variable.md"}
{"gitdown": "include", "file": ".gitdown/helpers/include.md"}
{"gitdown": "include", "file": ".gitdown/helpers/filesize.md"}
{"gitdown": "include", "file": ".gitdown/helpers/badge.md"}
{"gitdown": "include", "file": ".gitdown/helpers/date.md"}
{"gitdown": "include", "file": ".gitdown/helpers/gitinfo.md"}