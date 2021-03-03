import { test } from "uvu";
import * as assert from "uvu/assert";
import { getFragments, replaceFragments } from "../src/str-fragment.js";

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
    literal: {
        input: `
const style = /*css*/\`
        :host{width: 200px;}
\`

const jsx = <host class={\`.header\${height:200px}\`}>
`,
        output: `

`,
    },
};

test("simple replace", async (t) => {
    let reg = /^---/m;
    let fragments = getFragments(cases.frontmatter.input, {
        open: reg,
        end: reg,
        equal: true,
    });
    let str = replaceFragments(
        cases.frontmatter.input,
        fragments,
        () => cases.frontmatter.replace
    );

    assert.is(str, cases.frontmatter.output);
});

test.run();
