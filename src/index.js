export * from "./utils";
/**
 *
 * @param {string} text
 * @param {import("./internal").config} config
 * @returns {import("./internal").captures}
 */
export function getFragments(text, { open, closed, limit, filter }) {
  let lines = text.split(/\n/);
  let length = lines.length;
  /**@type {(import("./internal").capture[]|false)} */
  let ref = false;
  /**@type {import("./internal").captures} */
  let fragments = [];
  let size = 0;
  for (let i = 0; i < length; i++) {
    let line = lines[i];
    let lineSize = line.length;
    let move = 0;
    let indent = line.match(/^\s*/)[0].length;
    if (!ref) {
      let testOpen = line.match(open);
      if (testOpen) {
        let [text, ...args] = testOpen;
        line = line.replace(open, "");
        move = text.length;
        ref = [
          {
            text,
            args,
            line: i,
            indent,
            start: size + i + testOpen.index,
            end: size + i + testOpen.index + text.length,
          },
        ];
      }
    }
    if (ref) {
      let testClosed = line.match(closed);
      if (testClosed) {
        let [text, ...args] = testClosed;
        if (filter && !filter(ref[0].args, args)) continue;
        ref.push({
          text,
          line: i,
          indent,
          args,
          start: size + move + i + testClosed.index,
          end: size + move + i + testClosed.index + text.length,
        });
        let index = fragments.push(ref);
        if (limit != null && index > limit) {
          break;
        }
        ref = false;
      }
    }
    size += lineSize;
  }
  return fragments;
}
