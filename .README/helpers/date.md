### Print Date

<!-- gitdown: off -->
```json
{"gitdown": "date"}

```
<!-- gitdown: on -->

Prints a string formatted according to the given [moment format](http://momentjs.com/docs/#/displaying/format/) string using the current time.

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "date"}
{"gitdown": "date", "format": "YYYY"}

```
<!-- gitdown: on -->

Generates:

```markdown
1563038327
2019

```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `format` | [Moment format](http://momentjs.com/docs/#/displaying/format/). | `X` (UNIX timestamp) |
