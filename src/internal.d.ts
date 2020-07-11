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
