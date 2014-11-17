### Generate Table  of Contents

<!-- gitdown: off -->
```json
{"gitdown": "contents"}
```
<!-- gitdown: on -->

Generate table of contents.

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "contents", "root": "generate-table-of-contents"}
```
<!-- gitdown: on -->

```markdown
{"gitdown": "contents", "root": "generate-table-of-contents"}
```

<!--
Table of contents is generated using [Contents](https://github.com/gajus/contents).

The underlying implementation will render markdown file into HTML and then use Contents to generate the table of contents.
-->

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxDepth` | The maximum the level of the heading. | 3 |
| `root` | ID of the root heading. Provide it when you need table of contents for a specific section of the document. Throws an error if element with the said ID does not exist in the document. | N/A |