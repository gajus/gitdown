### Generate Badges

```json
<<{"gitdown": "badge"}>>
```

Generates badge markdown for the requested service, e.g.

```
[![NPM version](https://badge.fury.io/js/gitdown.svg?time=1415967099)](http://badge.fury.io/js/gitdown)
[![Bower version](https://badge.fury.io/bo/gitdown.svg?time=1415967099)](http://badge.fury.io/bo/gitdown)
```

Gitdown will be using the environment to load the info required to generate the badge, e.g. if it is NPM badge, it will lookup `package.json` file in the root directory of the repository.

In addition to generating the markdown code, Gitdown will de-cache the image URL (using `?time` parameter).

Most of the badges will be generated using https://badge.fury.io/.

#### Supported Services

* https://www.npmjs.org/ (npm)
* http://bower.io/ (bower)
* https://travis-ci.org/ (travis-ci)

Missing a badge? [Raise an issue](https://github.com/gajus/gitdown/issues) and I will add it.

#### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `name` | Name of the service. | N/A |