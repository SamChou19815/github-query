import { Repository } from 'github-query-core';
import { fetchRecent, fetchAll, RequestConfiguration } from './client';
import {
  initialize as initializeFirestore,
  update as updateRepository,
  readRecent
} from './database';

const fetchRecentAndRecord = (configuration: RequestConfiguration): Promise<Repository<Date>> =>
  fetchRecent(configuration).then(async ({ repository }) => {
    await updateRepository(`${configuration.owner}-${configuration.name}`, repository);
    return repository;
  });

const fetchAllAndRecord = (owner: string, name: string): Promise<Repository<Date>> =>
  fetchAll(owner, name).then(async repository => {
    await updateRepository(`${owner}-${name}`, repository);
    return repository;
  });

export { initializeFirestore, fetchRecentAndRecord, fetchAllAndRecord, readRecent };
