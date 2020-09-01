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
 */
function find(text, reg) {
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
    let itemsOpen = find(text, open);
    let itemsEnd = find(text, end);

    let itemOpen;
    /**@type {import("./internal").Block[]} */
    let blocks = [];

    itemsEnd = equal
        ? itemsEnd
        : itemsEnd.filter(
              (block) =>
                  !itemsOpen.some(
                      ({ indexOpen, indexEnd }) =>
                          block.indexOpen >= indexOpen &&
                          block.indexOpen <= indexEnd
                  )
          );

    while ((itemOpen = itemsOpen.pop())) {
        let nextItemsEnd = [...itemsEnd];
        let itemEnd;
        itemsEnd = [];
        while ((itemEnd = nextItemsEnd.shift())) {
            if (itemEnd.indexOpen > itemOpen.indexEnd) {
                blocks.unshift({ open: itemOpen, end: itemEnd });
                itemsEnd.push(...nextItemsEnd);
                break;
            } else {
                itemsEnd.push(itemEnd);
            }
        }
    }

    let parentBlock;

    return blocks.filter((block) => {
        if (!parentBlock) {
            parentBlock = block;
            return true;
        }
        if (
            block.open.indexOpen > parentBlock.open.indexOpen &&
            block.end.indexEnd < parentBlock.end.indexEnd
        ) {
            return false;
        } else {
            parentBlock = block;
            return true;
        }
    });
}

export { getFragments, replaceFragments, walkFragments };
//# sourceMappingURL=index.js.map
