### Date

<!-- gitdown: off -->
```json
<<{"gitdown": "date"}>>
```
<!-- gitdown: on -->

Prints date.

#### Example

<!-- gitdown: off -->
```json
<<{"gitdown": "date"}>>
<<{"gitdown": "date", "format": "YYYY"}>>
```
<!-- gitdown: on -->

Generates:

```markdown
<<{"gitdown": "date"}>>
<<{"gitdown": "date", "format": "YYYY"}>>
```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `format` | [Moment format](http://momentjs.com/docs/#/displaying/format/). | `X` (UNIX timestamp) |