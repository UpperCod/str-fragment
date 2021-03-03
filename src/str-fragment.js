export * from "./utils.js";
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
export function getFragments(text, { open, end, equal }) {
    const itemsOpen = find(text, open);
    let itemsEnd = find(text, end, true).slice(0, itemsOpen.length);
    const min = itemsOpen[0] ? itemsOpen[0].indexEnd : 0;
    if (equal) {
        itemsOpen.forEach((item, index) => {
            if (index % 2) item.end = true;
        });
        itemsEnd = [];
    }
    const items = [
        ...itemsOpen,
        ...itemsEnd.filter(
            (item) =>
                item.indexOpen > min &&
                !itemsOpen.some(
                    ({ indexOpen, indexEnd }) =>
                        item.indexOpen >= indexOpen && item.indexEnd <= indexEnd
                )
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
