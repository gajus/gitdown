### Generate Badges

<!-- gitdown: off -->
```json
{"gitdown": "badge"}
```
<!-- gitdown: on -->

GitDown generates markdown for badges using the environment variables, e.g. if it is an NPM badge, GitDown will lookup the package name from `package.json`.

Badges are generated using http://shields.io/.

#### Supported Services

| Name | Description |
| --- | --- |
| `npm-version` | [NPM](https://www.npmjs.org/) package version. |
| `bower-version` | [Bower](http://bower.io/) package version. |
| `travis` | State of the [Travis](https://travis-ci.org/) build. |

What service are you missing? [Raise an issue](https://github.com/gajus/gitdown/issues).

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "badge", "name": "npm"}
{"gitdown": "badge", "name": "travis"}
```
<!-- gitdown: on -->

Generates:

```markdown
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "travis"}
```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. | N/A |