### Gitinfo

<!-- gitdown: off -->
```json
{"gitdown": "gitinfo"}
```
<!-- gitdown: on -->

[Gitinfo](https://github.com/gajus/gitinfo) gets info about the local GitHub repository.

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

#### Supported Properties

|Name|Description|
|---|---|
|`username`|Username of the repository author.|
|`name`|Repository name.|
|`url`|Repository URL.|
|`branch`|Current branch name.|

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of [Gitinfo](https://github.com/gajus/gitinfo) property. | N/A |

#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `gitinfo.gitPath` | Path to the `.git/` directory or a descendant. | `__dirname` of the script constructing an instance of `Gitdown`. |