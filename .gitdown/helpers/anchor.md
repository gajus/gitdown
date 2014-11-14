### Reference an Anchor in the Repository

```json
<<{"gitdown": "anchor"}>>
```

Generates a URL to the line in the source code where the anchor appears.

Place a documentation tag `@gitdownanchor <name>` anywhere in the code base, e.g.

```js
/**
 * @gitdownanchor my-anchor-name
 */
```

Then reference the tag in the Gitdown document:

```
Refer to [foo](<<{"gitdown": "anchor", "name": "my-anchor-name"}>>).
```

The anchor name must match `/^[a-z]+[a-z0-9\-_:\.]*$/i`.

Gitdown will thow an error if the anchor is not found.

#### Configuration

| Name | Description | Default |
| `name` | Anchor name. | N/A |