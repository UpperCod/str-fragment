/**
 * Replaces a group of fragments
 * @param {string} text
 * @param {import("./internal").captures} fragments
 * @param {import("./internal").replace} replace
 */
export function replaceFragments(text, fragments, replace) {
  let move = 0;
  return fragments
    .reduce((splitText, [open, closed]) => {
      let fBefore = splitText.slice(move + open.start, move + open.end);
      let fValue = splitText.slice(move + open.end, move + closed.start);
      let fAfter = splitText.slice(move + closed.start, move + closed.end);
      let before = fBefore.join("");
      let value = fValue.join("");
      let after = fAfter.join("");
      let group = before + value + after;
      let next = replace({ before, after, value }, [open, closed]);
      if (next != null) {
        let before = splitText.slice(0, move + open.start);
        let after = splitText.slice(move + closed.end);
        move += next.length - group.length;
        return [...before, ...next, ...after];
      }
      return splitText;
    }, text.split(""))
    .join("");
}
/**
 * @param {string} text
 * @param {import("./internal").captures} fragments
 * @param {import("./internal").walk} walk
 */
export function walkFragments(text, fragments, walk) {
  replaceFragments(text, fragments, (fragment) => {
    walk(fragment);
  });
}
