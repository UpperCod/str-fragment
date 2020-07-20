'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Replaces a group of fragments
 * @param {string} text
 * @param {import("./internal").captures} fragments
 * @param {import("./internal").replace} replace
 */
function replaceFragments(text, fragments, replace) {
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
function walkFragments(text, fragments, walk) {
  replaceFragments(text, fragments, (fragment) => {
    walk(fragment);
  });
}

/**
 *
 * @param {string} text
 * @param {import("./internal").config} config
 * @returns {import("./internal").captures}
 */
function getFragments(
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

exports.getFragments = getFragments;
exports.replaceFragments = replaceFragments;
exports.walkFragments = walkFragments;
