# str-replace

Capture text fragments based on regular expressions that are executed for each line of the text.

## Install

```bash
npm install @uppercod/str-fragment
```

## Example

```js
import { getFragments, replaceFragments } from "@uppercod/str-fragment";

let str = `
/**
 * old comment
 */
let s = "";
`;

/**@type {import("str-fragment/internal").captures}*/
let fragments = getFragment(str, {
    open: /\/\*\*/,
    closed: /\*\//,
    equal: false, // if fragments share capture equality set equal to true
});

replaceFragments(str, fragments, () => `/** new comment */`);
// /** new comment */
// let s = "";
```

## more expressions

**template-string**

```js
let blocks = getFragments(code, {
    open: /css`/,
    end: /`/,
});
```

**frontmatter**

```js
let blocks = getFragments(code, {
    open: /^---/m,
    end: /^---/m,
    equal: true,
});
```

## Api

### replaceFragments

Replace the fragments with a new text, if null returns no replacement of the evaluated fragment is generated

### walkFragments

Walk on the shards generate changes
