### Heading Nesting

Github markdown processor generates heading ID based on the text of the heading.

The conflicting IDs are solved with a numerical suffix, e.g.

```markdown
# Foo
## Something
# Bar
## Something
```

```html
<h1 id="foo">Foo</h1>
<h2 id="something">Something</h1>
<h1 id="bar">Bar</h1>
<h2 id="something-1">Something</h1>
```

The problem with this approach is that it makes the order of the content important.

GitDown will nest the headings using parent heading names to ensure uniqueness, e.g.

```markdown
# Foo
## Something
# Bar
## Something
```

```html
<h1 id="foo">Foo</h1>
<h2 id="foo-something">Something</h1>
<h1 id="bar">Bar</h1>
<h2 id="bar-something">Something</h1>
```

#### Parser Configuration

| Name | Description | Default |
| --- | --- | --- |
| `headingNesting.enabled` | Boolean flag indicating whether to nest headings. | `true` |