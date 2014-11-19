### Generate Table  of Contents

> Under development.

<!-- gitdown: off -->
```json
{"gitdown": "contents"}
```
<!-- gitdown: on -->

Generates table of contents.

The table of contents is generated using [markdown-contents](https://github.com/gajus/markdown-contents).

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "contents", "maxDepth": 2, "root": "features"}
```
<!-- gitdown: on -->

```markdown
{"gitdown": "contents", "maxDepth": 2, "root": "features"}
```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxDepth` | The maximum the level of the heading. | 3 |
| `root` | ID of the root heading. Provide it when you need table of contents for a specific section of the document. Throws an error if element with the said ID does not exist in the document. | N/A |