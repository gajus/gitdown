### Timestamp

```json
<<{"gitdown": "timestamp"}>>
```

Prints UNIX timestamp. This is designed to be used to de-cache content, e.g.

```Handlebars
[!foo](http://foo.com/picture.png?time={{gitdown.timestamp}})
```