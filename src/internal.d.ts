export interface Item {
    value: string;
    args: any[];
    indexOpen: number;
    indexEnd: number;
    end: boolean;
}

export interface Block {
    open: Item;
    end: Item;
}
