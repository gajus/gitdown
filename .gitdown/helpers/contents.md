### Generate Table of Contents

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
{"gitdown": "contents", "maxLevel": 3, "rootId": "features"}
```
<!-- gitdown: on -->

```markdown
{"gitdown": "contents", "maxLevel": 3, "rootId": "features"}
```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `maxLevel` | The maximum heading level after which headings are excluded. | 3 |
| `rootId` | ID of the root heading. Provide it when you need table of contents for a specific section of the document. Throws an error if element with the said ID does not exist in the document. | N/A |