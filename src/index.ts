#!/usr/bin/env node

/* eslint-disable no-console */

import { aggregatedAnalyzeLocal, analyzeGlobal } from './analysis';
import cli from './cli';
import { Repository } from './core/processed-types';
import {
  Fetcher,
  freshFetchAllAndStore,
  freshFetchRecentAndStore,
  getRecent,
  getAll,
} from './data';

async function fetchRepositoryData(
  fetcher: Fetcher,
  repositories: readonly string[]
): Promise<(readonly [string, Repository<Date>])[]> {
  const fetchedRepositories: [string, Repository<Date>][] = [];
  console.log('Fetching repository data...');
  for (const repo of repositories) {
    const repoParts = repo.split('/');
    if (repoParts.length !== 2) {
      console.error(
        `Repo must have format \`[org/user name]/[repo name]\`. Bad repository: ${repo}`
      );
      // eslint-disable-next-line no-continue
      continue;
    }
    const [owner, name] = repoParts;
    try {
      const start = new Date().getTime();
      // eslint-disable-next-line no-await-in-loop
      const repository = await fetcher(owner, name);
      const end = new Date().getTime();
      if (end - start > 500) {
        console.log(`Fetched ${repo}.`);
      }
      fetchedRepositories.push([repo, repository]);
    } catch (error) {
      console.error(`Unable to fetch data for ${repo}. Error: ${error.message}`);
    }
  }
  return fetchedRepositories;
}

async function main() {
  const { repositories, after, recent, fresh } = cli();

  let fetcher: Fetcher;
  if (recent) {
    fetcher = fresh ? freshFetchRecentAndStore : getRecent;
  } else {
    fetcher = fresh ? freshFetchAllAndStore : getAll;
  }

  const fetchedRepositories = await fetchRepositoryData(fetcher, repositories);

  console.log('Analyzing repository data...');
  aggregatedAnalyzeLocal(fetchedRepositories, after);
  analyzeGlobal(
    fetchedRepositories.map(([, repository]) => repository),
    after
  );
}

main();
