export * from "./utils";
/**
 *
 * @param {string} text
 * @param {import("./internal").config} config
 * @returns {import("./internal").captures}
 */
export function getFragments(
  text,
  { open, closed, limit, filter, forceNextLine }
) {
  let lines = text.split(/\n/);
  let length = lines.length;
  /**@type {(import("./internal").capture[]|false)} */
  let ref = false;
  /**@type {import("./internal").captures} */
  let fragments = [];
  let size = 0;
  for (let i = 0; i < length; i++) {
    let line = lines[i];
    let move = 0;
    let indent = line.match(/^\s*/)[0].length;
    let currentSize = size;
    size += line.length;
    if (!ref) {
      let testOpen = line.match(open);
      if (testOpen) {
        let [text, ...args] = testOpen;
        line = line.replace(text, "");
        move = text.length;
        ref = [
          {
            text,
            args,
            line: i,
            indent,
            start: currentSize + i + testOpen.index,
            end: currentSize + i + testOpen.index + text.length,
          },
        ];
      }
    }
    if (ref) {
      if (forceNextLine && ref[0].line == i) continue;
      let testClosed = line.match(closed);
      if (testClosed) {
        let [text, ...args] = testClosed;
        if (filter && !filter(ref[0].args, args)) continue;
        ref.push({
          text,
          line: i,
          indent,
          args,
          start: currentSize + move + i + testClosed.index,
          end: currentSize + move + i + testClosed.index + text.length,
        });
        let index = fragments.push(ref);
        if (limit != null && index > limit) {
          break;
        }
        ref = false;
      }
    }
  }
  return fragments;
}
