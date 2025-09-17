export type TableHeaderInput =
  | { type: 'input'; columnId: string }
  | { type: 'select'; columnId: string; options: { label: string; value: string }[] };
