### Find Dead URLs and Fragment Identifiers

Uses [Deadlink](https://github.com/gajus/deadlink) to iterate through all of the URLs in the resulting document. Throws an error if the request resolves in HTTP status other than 200 or fragment identifier (anchor) is not found.

#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `deadlink.findDeadURLs` | Find dead URLs. | `false` |
| `deadlink.findDeadFragmentIdentifiers` | Find dead fragment identifiers. | `true` |
| `deadlink.ignoreURLs` | URLs matching the regex will be ignored. | N/A |