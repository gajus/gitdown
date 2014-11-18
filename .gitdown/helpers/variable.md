### Variables

<!-- gitdown: off -->
```json
{"gitdown": "variable"}
```
<!-- gitdown: on -->

Prints the value of a property defined under a parser `variable` configuration. Throws an error at the time of template processing if property is not set.

`_` property is reserved for Gitdown.

#### Predefined Variables

> Under development.

| Name | Value |
| --- | --- |
| `_.github.starCount` | Number of stars. |
| `_.github.watcherCount` | Number of watchers. |
| `_.github.forkCount` | Number of forks. |

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