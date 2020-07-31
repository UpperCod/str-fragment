export interface Item {
    value: string;
    args: any[];
    indexOpen: number;
    indexEnd: number;
}

export interface Block {
    open: Item;
    end: Item;
}
