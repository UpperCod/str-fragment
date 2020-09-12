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
function replaceFragments(text, blocks, callback, limit = -1) {
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
function walkFragments(text, blocks, callback, limit = -1) {
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

/**
 *
 * @param {string} text
 * @param {RegExp} reg
 * @param {boolean} [end]
 */
function find(text, reg, end) {
    let current;
    let position = 0;
    /**@type {import("./internal").Item[]} */
    let items = [];
    while ((current = text.match(reg))) {
        let [value, ...args] = current;
        let length = current.index + value.length;
        if (!length) break;
        items.push({
            value,
            args,
            indexOpen: position + current.index,
            indexEnd: position + length,
            end,
        });
        position += length;
        text = text.slice(length);
    }
    return items;
}
/**
 *
 * @param {string} text
 * @param {{open:RegExp,end:RegExp,equal:boolean}} find
 */
function getFragments(text, { open, end, equal }) {
    const itemsOpen = find(text, open);
    const itemsEnd = find(text, end, true);
    const min = itemsOpen[0] ? itemsOpen[0].indexEnd : 0;
    const items = [
        ...itemsOpen,
        ...itemsEnd.filter(
            (item) =>
                item.indexOpen > min &&
                (equal ||
                    !itemsOpen.some(
                        ({ indexOpen, indexEnd }) =>
                            item.indexOpen >= indexOpen &&
                            item.indexEnd <= indexEnd
                    ))
        ),
    ].sort((a, b) => (a.indexOpen > b.indexOpen ? 1 : -1));

    /**@type {import("./internal").Block[]} */
    let blocks = [];
    let item;
    let nested = 0;
    while ((item = items.shift())) {
        for (let i = 0; i < items.length; i++) {
            const next = items[i];
            if (next.end) {
                if (!nested--) {
                    nested = nested > 0 ? nested : 0;
                    blocks.push({ open: item, end: next });
                    items.splice(0, i + 1);
                    break;
                }
            } else {
                nested++;
            }
        }
    }
    return blocks;
}

export { getFragments, replaceFragments, walkFragments };
//# sourceMappingURL=index.js.map
