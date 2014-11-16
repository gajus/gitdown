### Generate Table of Contents

> This feature is under development.

<!-- gitdown: off -->
```json
<<{"gitdown": "contents"}>>
```
<!-- gitdown: on -->

Table of contents is generated using [Contents](https://github.com/gajus/contents).

The underlying implementation will render markdown file into HTML and then use Contents to generate the table of contents.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxDepth` | The maximum the level of the heading. | 3 |