### Variables

<!-- gitdown: off -->
```json
{"gitdown": "variable"}
```
<!-- gitdown: on -->

Prints date.

#### Example

<!-- gitdown: off -->
```js
var gitdown;

gitdown = Gitdown('{"gitdown": "variable", "name": "foo"}');

gitdown.config({
    variable: {
        foo: 'Foo'
    }
});
```
<!-- gitdown: on -->

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the parser `variable` configuration property.  | N/A |

#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `variable` | Variable object | `{}` |