export interface capture {
  text: string;
  args: string[];
  line: number;
  indent: number;
  start: number;
  end: number;
}

export type captures = Array<capture[]>;

export interface replace {
  ({ before: string, after: string, value: string }, captures: capture[]): any;
}

export interface walk {
  ({ before: string, after: string, value: string }): void;
}

export interface filter {
  (argsOpen: string[], argsClosed: string[]): boolean | null;
}

export interface config {
  open: RegExp;
  closed: RegExp;
  limit?: number;
  filter?: filter;
  forceNextLine?: boolean;
}
