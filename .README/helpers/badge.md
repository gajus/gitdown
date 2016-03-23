### Generate Badges

<!-- gitdown: off -->
```json
{"gitdown": "badge"}
```
<!-- gitdown: on -->

Gitdown generates markdown for badges using the environment variables, e.g. if it is an NPM badge, Gitdown will lookup the package name from `package.json`.

Badges are generated using http://shields.io/.

#### Supported Services

| Name | Description |
| --- | --- |
| `npm-version` | [NPM](https://www.npmjs.org/) package version. |
| `bower-version` | [Bower](http://bower.io/) package version. |
| `travis` | State of the [Travis](https://travis-ci.org/) build. |
| `david` | [David](https://david-dm.org/) state of the dependencies. |
| `david-dev` | [David](https://david-dm.org/) state of the development dependencies. |
| `waffle` | Issues ready on [Waffle](https://waffle.io/) board. |
| `gitter` | Join [Gitter](https://gitter.im/) chat. |
| `coveralls` | [Coveralls](https://coveralls.io/). |
| `codeclimate-gpa` | [Code Climate](https://codeclimate.com/) GPA. |
| `codeclimate-coverage` | [Code Climate](https://codeclimate.com/) test coverage. |
| `appveyor` | [AppVeyor](http://www.appveyor.com/) status. |

What service are you missing? [Raise an issue](https://github.com/gajus/gitdown/issues).

#### Example

<!-- gitdown: off -->
```json
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}
```
<!-- gitdown: on -->

Generates:

```markdown
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "travis"}
{"gitdown": "badge", "name": "david"}
```

#### JSON Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. | N/A |
