import { Block, Item } from "./internal";

declare module "@uppercod/str-fragment" {
    export * from "./internal";

    export interface Config {
        open: RegExp;
        end: RegExp;
        equal?: boolean;
    }

    export interface CallbackParam {
        body: string;
        content: string;
        open: Item;
        end: Item;
    }

    export function getFragments(text: string, config: Config): Block[];

    export function replaceFragments(
        text: string,
        blocks: Block[],
        callback: (param: CallbackParam) => string,
        limit: number = -1
    ): string;

    export function walkFragments(
        text: string,
        blocks: Block[],
        callback: (param: CallbackParam) => void,
        limit: number = -1
    ): string;
}
