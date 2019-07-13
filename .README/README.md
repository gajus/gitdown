[![GitSpo Mentions](https://gitspo.com/badges/mentions/gajus/gitdown?style=flat-square)](https://gitspo.com/mentions/gajus/gitdown)
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}

Gitdown adds [additional functionality](#features) (generating table of contents, including documents, using variables, etc.) to [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/).

## Cheat Sheet

<!-- gitdown: off -->
```js
// Generate table of contents
{"gitdown": "contents"}
{"gitdown": "contents", "maxLevel": 4}
{"gitdown": "contents", "rootId": "features"}

// Use a custom defined variable
{"gitdown": "variable", "name": "nameOfTheVariable"}

// Include file
{"gitdown": "include", "file": "./LICENSE.md"}

// Get file size
{"gitdown": "filesize", "file": "./src/gitdown.js"}
{"gitdown": "filesize", "file": "./src/gitdown.js", "gzip": true}

// Generate badges
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "bower-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}
{"gitdown": "badge", "name": "david-dev"}
{"gitdown": "badge", "name": "waffle"}

// Print date
{"gitdown": "date", "format": "YYYY"}

```
<!-- gitdown: on -->

## Contents

{"gitdown": "contents", "maxDepth": 2}

{"gitdown": "include", "file": "./usage.md"}

a

## Features

{"gitdown": "include", "file": "./helpers/contents.md"}
{"gitdown": "include", "file": "./helpers/heading-nesting.md"}
{"gitdown": "include", "file": "./helpers/deadlink.md"}
{"gitdown": "include", "file": "./helpers/anchor.md"}
{"gitdown": "include", "file": "./helpers/variable.md"}
{"gitdown": "include", "file": "./helpers/include.md"}
{"gitdown": "include", "file": "./helpers/filesize.md"}
{"gitdown": "include", "file": "./helpers/badge.md"}
{"gitdown": "include", "file": "./helpers/date.md"}
{"gitdown": "include", "file": "./helpers/gitinfo.md"}

## Recipes

### Automating Gitdown

Use [Husky](https://www.npmjs.com/package/husky) to check if user generated README.md before committing his changes.

```json
"husky": {
  "hooks": {
    "pre-commit": "npm run lint && npm run test && npm run build",
    "pre-push": "gitdown ./.README/README.md --output-file ./README.md --check",
  }
}

```

`--check` attributes makes Gitdown check if the target file differes from the source template. If the file differs then the program exits with an error code and message:

> Gitdown destination file does not represent the current state of the template.

Do not automate generating and committing documentation: automating commits will result in a noisy commit log.
