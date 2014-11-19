### Gitinfo

<!-- gitdown: off -->
```json
{"gitdown": "gitinfo"}
```
<!-- gitdown: on -->

Gets info about a local GitHub repository.

This is a wrapper around [Gitinfo](https://github.com/gajus/gitinfo).

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "gitinfo", "name": "username"}
{"gitdown": "gitinfo", "name": "name"}
{"gitdown": "gitinfo", "name": "url"}
{"gitdown": "gitinfo", "name": "branch"}
```
<!-- gitdown: on -->

```
{"gitdown": "gitinfo", "name": "username"}
{"gitdown": "gitinfo", "name": "name"}
{"gitdown": "gitinfo", "name": "url"}
{"gitdown": "gitinfo", "name": "branch"}
```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of [Gitinfo](https://github.com/gajus/gitinfo) property. | N/A |

#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `gitinfo.gitPath` | Path to the `.git/` directory or a descendant. | `__dirname` of the script constructing an instance of `Gitdown`. |