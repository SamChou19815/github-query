/* eslint-disable no-console */
import * as yargs from 'yargs';
import { fetchAllAndStore, fetchRecentAndStore } from './data';

function main() {
  const { repo, recent } = yargs
    .option('repo', {
      demandOption: true,
      description: 'Path to the repository. e.g. facebook/react'
    })
    .option('recent', {
      default: false,
      description: 'Only fetch recent information.'
    })
    .boolean('recent')
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

  if (recent) {
    console.log('Fetching with limit');
    fetchRecentAndStore(owner, name).then(console.log);
  } else {
    console.log('Fetching all...');
    fetchAllAndStore(owner, name).then(console.log);
  }
}

main();
