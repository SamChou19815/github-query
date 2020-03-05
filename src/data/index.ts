/**
 * The package that deals with data fetch, storing, and serialization.
 */

import { Repository } from '../core/processed-types';
import { fetchRecent, fetchAll } from './client';
import { store } from './storage';

export const fetchRecentAndStore = (owner: string, name: string): Promise<Repository<Date>> =>
  fetchRecent({
    owner,
    name,
    issuesLimit: 100,
    pullRequestsLimit: 100,
    commitHistoryLimit: 100
  }).then(({ repository }) => {
    store(`${owner}-${name}-recent`, repository);
    return repository;
  });

export const fetchAllAndStore = (owner: string, name: string): Promise<Repository<Date>> =>
  fetchAll(owner, name).then(repository => {
    store(`${owner}-${name}-all`, repository);
    return repository;
  });
