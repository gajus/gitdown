### Generate Badges

<!-- gitdown: off -->
```json
<<{"gitdown": "badge"}>>
```
<!-- gitdown: on -->

Gitdown is using the environment variables to generate the markdown for the badge, e.g. if it is an NPM badge, Gitdown will lookup the package name for the `package.json`.

Badges are generated using http://shields.io/.

### Supported Services

* npm-version
* travis

### Example

<!-- gitdown: off -->
```json
<<{"gitdown": "badge", "name": "npm"}>>
<<{"gitdown": "badge", "name": "travis"}>>
```
<!-- gitdown: on -->

Generates:

```markdown
<<{"gitdown": "badge", "name": "npm-version"}>>
<<{"gitdown": "badge", "name": "travis"}>>
```

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. See http://shields.io/. | N/A |