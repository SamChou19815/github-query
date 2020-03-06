export type Options = {
  readonly repositories: readonly string[];
  readonly after: Date | null;
  readonly recent: boolean;
  readonly fresh: boolean;
  readonly help: boolean;
};
