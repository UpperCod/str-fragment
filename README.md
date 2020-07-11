# str-replace

Capture text fragments based on regular expressions that are executed for each line of the text, ex:

```js
import { getFragments, replaceFragments, walkFragments } from "str-fragment";

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
});

replaceFragments(str, fragments, () => `/** new comment */`);
// /** new comment */
// let s = "";
```

### replaceFragments

Replace the fragments with a new text, if null returns no replacement of the evaluated fragment is generated

### walkFragments

Walk on the shards generate changes
