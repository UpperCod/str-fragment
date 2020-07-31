export * from "./utils";
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
export function getFragments(text, { open, end, equal }) {
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
