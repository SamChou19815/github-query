/* eslint-disable no-console */
import * as yargs from 'yargs';
import {
  Fetcher,
  freshFetchAllAndStore,
  freshFetchRecentAndStore,
  getRecent,
  getAll
} from './data';
import analyze from './analysis';

function main() {
  const { repo, after, recent, fresh } = yargs
    .option('repo', {
      demandOption: true,
      type: 'string',
      description: 'Path to the repository. e.g. facebook/react'
    })
    .option('after', {
      type: 'string',
      description: 'Only consider objects after this specified time. e.g. 2020-02-02'
    })
    .option('recent', {
      type: 'boolean',
      default: false,
      description: 'Only get recent information.'
    })
    .boolean('recent')
    .option('fresh', {
      type: 'boolean',
      default: false,
      description: 'Force fetching new data.'
    })
    .boolean('fresh')
    .help().argv;

  if (typeof repo !== 'string') {
    console.error('Repo must be a string!');
    process.exit(2);
  }
  const repoParts = repo.split('/');
  if (repoParts.length !== 2) {
    console.error('Repo must have format `[organization/user name]/[repo name]`.');
    process.exit(2);
  }
  const [owner, name] = repoParts;

  let afterDate: Date | null;
  if (typeof after === 'string') {
    afterDate = new Date(after);
  } else {
    afterDate = null;
  }

  let fetcher: Fetcher;
  if (recent) {
    fetcher = fresh ? freshFetchRecentAndStore : getRecent;
  } else {
    fetcher = fresh ? freshFetchAllAndStore : getAll;
  }
  console.log(`Fetching data for \`${repo}\`...`);
  fetcher(owner, name)
    .then(repository => analyze(repository, afterDate))
    .catch(() => {
      console.error(`Unable to fetch data for ${repo}.`);
      process.exit(1);
    });
}

main();
