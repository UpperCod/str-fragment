import { captures, replace, captures, walk } from "./internal";

declare module "str-fragment" {
  export function getFragments(text: string, config: config): captures;

  export function replaceFragments(
    text: string,
    fragments: captures,
    replace: replace
  ): string;

  export function walkFragments(
    text: string,
    fragments: captures,
    walk: walk
  ): void;
}
