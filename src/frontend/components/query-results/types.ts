import { Repository } from '../../core/processed-types';

export type RepositoryId = { readonly owner: string; readonly name: string };

export type ItemsProps<T> = { readonly items: readonly T[] };

export type RepositoryProps = {
  readonly repository: Repository<Date>;
};
