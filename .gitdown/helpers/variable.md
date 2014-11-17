### Variables

<!-- gitdown: off -->
```json
{"gitdown": "variable"}
```
<!-- gitdown: on -->

Prints the value of a property defined in a parser `variable` configuration. Throws an error at the time of compilation if property is not set.

`_` property is reserved for Gitdown.

#### Example

<!-- gitdown: off -->
```js
var gitdown;

gitdown = Gitdown(
    '{"gitdown": "variable", "name": "user.firstName"}' +
    '{"gitdown": "variable", "name": "user.lastName"}'
);

gitdown.config({
    variable: {
        user: {
            firstName: "Gajus",
            lastName: "Kuizinas"
        }
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