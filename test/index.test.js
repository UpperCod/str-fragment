let test = require("ava");
let { getFragments, replaceFragments } = require("../cjs");

let cases = {
  frontmatter: {
    input: `---
name: simple-test
before : | 
    every master plop
    ---
after : ...
---

## md?`,
    replace: `---
new content
---`,
    output: `---
new content
---

## md?`,
  },
};

test("simple replace", async (t) => {
  let reg = /^---/;
  let fragments = getFragments(cases.frontmatter.input, {
    open: reg,
    closed: reg,
  });

  let str = replaceFragments(
    cases.frontmatter.input,
    fragments,
    () => cases.frontmatter.replace
  );

  t.is(str, cases.frontmatter.output);
});
