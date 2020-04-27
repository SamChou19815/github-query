#!/usr/bin/env node

/* eslint-disable no-console */
import chalk from 'chalk';

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
import displayWithCharts from './display/display-chart';
import displayWithText from './display/display-text';

async function fetchRepositoryData(
  fetcher: Fetcher,
  repositories: readonly string[]
): Promise<(readonly [string, Repository<Date>])[]> {
  const fetchedRepositories: [string, Repository<Date>][] = [];
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
        console.log(chalk.yellow(`Fetched ${repo}.`));
      }
      fetchedRepositories.push([repo, repository]);
    } catch (error) {
      console.error(`Unable to fetch data for ${repo}. Error: ${error.message}`);
    }
  }
  return fetchedRepositories;
}

async function main() {
  const { repositories, after, recent, fresh, chart } = cli();

  let fetcher: Fetcher;
  if (recent) {
    fetcher = fresh ? freshFetchRecentAndStore : getRecent;
  } else {
    fetcher = fresh ? freshFetchAllAndStore : getAll;
  }

  const fetchedRepositories = await fetchRepositoryData(fetcher, repositories);

  const allAnalysisResult = [
    ...aggregatedAnalyzeLocal(fetchedRepositories, after),
    ...analyzeGlobal(
      fetchedRepositories.map(([, repository]) => repository),
      after
    ),
  ];
  if (chart || process.env.CHART_MODE === 'true') {
    displayWithCharts(allAnalysisResult);
  } else {
    displayWithText(allAnalysisResult);
  }
}

main();
