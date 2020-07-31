/**
 *
 * @typedef {Object} CallbackParam
 * @property {string} body
 * @property {string} content
 * @property {import("./internal").Item} open
 * @property {import("./internal").Item} end
 */

/**
 * @param {string} text
 * @param {number} diff
 * @param {import("./internal").Block} block
 * @param {(param:CallbackParam)=>string} callback
 */
function replaceItem(text, diff, { open, end }, callback) {
    let before = text.slice(0, open.indexOpen + diff);
    let after = text.slice(end.indexEnd + diff);
    let body = text.slice(open.indexOpen + diff, end.indexEnd + diff);
    let content = text.slice(open.indexEnd + diff, end.indexOpen + diff);
    let nextContent = callback({ body, content, open, end }) + "";
    diff += nextContent.length - body.length;
    text = before + nextContent + after;
    return { diff, text };
}

/**
 *
 * @param {string} text
 * @param {import("./internal").Block[]} blocks
 * @param {(param:CallbackParam)=>string} callback
 * @param {number} [limit=-1]
 * @returns {string}
 */
export function replaceFragments(text, blocks, callback, limit = -1) {
    let diff = 0;
    for (let i = 0; i < blocks.length; i++) {
        let res = replaceItem(text, diff, blocks[i], callback);
        diff = res.diff;
        text = res.text;
        if (limit == i + 1) break;
    }
    return text;
}

/**
 *
 * @param {string} text
 * @param {import("./internal").Block[]} blocks
 * @param {(param:CallbackParam)=>string} callback
 * @param {number} [limit=-1]
 * @returns {void}
 */
export function walkFragments(text, blocks, callback, limit = -1) {
    replaceFragments(
        text,
        blocks,
        (param) => {
            callback(param);
            return param.body;
        },
        limit
    );
}
