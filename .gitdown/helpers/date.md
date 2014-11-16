### Date

<!-- gitdown: off -->
```json
<<{"gitdown": "date"}>>
```
<!-- gitdown: on -->

Prints date.

<!-- gitdown: off -->
```Handlebars
[!foo](http://foo.com/picture.png?time=<<{"gitdown": "date"}>>)
```
<!-- gitdown: on -->

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `format` | [Moment format](http://momentjs.com/docs/#/displaying/format/). | `X` (Unix timestamp) |