/**
 * The package that deals with data fetch, storing, and serialization.
 */

import { Repository } from '../core/processed-types';
import { fetchRecent, fetchAll } from './client';
import { exists, store, retrive } from './storage';

export type Fetcher = (owner: string, name: string) => Promise<Repository<Date>>;

export const freshFetchRecentAndStore: Fetcher = (
  owner: string,
  name: string
): Promise<Repository<Date>> =>
  fetchRecent({
    owner,
    name,
    issuesLimit: 100,
    pullRequestsLimit: 100,
  }).then(({ repository }) => {
    store(`${owner}-${name}-recent`, repository);
    return repository;
  });

export const freshFetchAllAndStore: Fetcher = (
  owner: string,
  name: string
): Promise<Repository<Date>> =>
  fetchAll(owner, name).then((repository) => {
    store(`${owner}-${name}-all`, repository);
    return repository;
  });

export const getRecent: Fetcher = async (
  owner: string,
  name: string
): Promise<Repository<Date>> => {
  const id = `${owner}-${name}-recent`;
  if (exists(id)) {
    return retrive(id);
  }
  return freshFetchRecentAndStore(owner, name);
};

export const getAll: Fetcher = async (owner: string, name: string): Promise<Repository<Date>> => {
  const id = `${owner}-${name}-all`;
  if (exists(id)) {
    return retrive(id);
  }
  return freshFetchAllAndStore(owner, name);
};
