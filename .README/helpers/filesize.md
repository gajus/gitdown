### Get File Size

<!-- gitdown: off -->
```json
{"gitdown": "filesize"}

```
<!-- gitdown: on -->

Returns file size formatted in human friendly format.

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "filesize", "file": "src/gitdown.js"}
{"gitdown": "filesize", "file": "src/gitdown.js", "gzip": true}

```
<!-- gitdown: on -->

Generates:

```markdown
{"gitdown": "filesize", "file": "src/gitdown.js"}
{"gitdown": "filesize", "file": "src/gitdown.js", "gzip": true}

```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `file` | Path to the file. The path is relative to the root of the repository. | N/A |
| `gzip` | A boolean value indicating whether to gzip the file first. | `false` |
