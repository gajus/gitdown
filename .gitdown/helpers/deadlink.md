### Find Dead URLs and Fragment Identifiers

Uses [Deadlink](https://github.com/gajus/deadlink) to iterate through all of the URLs in the resulting document and throw an error if the request resolves in HTTP status other than 200 or fragment identifier (anchor) is not found.

### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `findDeadURLs` | Find dead URLs. | `false` |
| `findDeadFragmentIdentifiers` | Find dead fragment identifiers. | `true` |