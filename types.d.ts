import { captures, filter, replace, captures } from "./internal";

declare module "str-fragment" {
  export function getFragments(text: string, config: config): captures;

  export function replaceFragments(
    text: string,
    fragments: captures,
    replace: replace
  ): string;

  export function walkFragments({
    before: string,
    after: string,
    value: string,
  }): void;
}
