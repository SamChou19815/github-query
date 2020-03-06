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
  const { repo, recent, fresh } = yargs
    .option('repo', {
      demandOption: true,
      description: 'Path to the repository. e.g. facebook/react'
    })
    .option('recent', {
      default: false,
      description: 'Only get recent information.'
    })
    .boolean('recent')
    .option('fresh', {
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

  let fetcher: Fetcher;
  if (recent) {
    fetcher = fresh ? freshFetchRecentAndStore : getRecent;
  } else {
    fetcher = fresh ? freshFetchAllAndStore : getAll;
  }
  console.log(`Fetching data for \`${repo}\`...`);
  fetcher(owner, name)
    .then(analyze)
    .catch(() => console.error(`Unable to fetch data for ${repo}.`));
}

main();
