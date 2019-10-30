/* eslint-disable no-console */
import * as yargs from 'yargs';
import { initialize } from './database';
import { fetchAllAndRecord, fetchRecentAndRecord } from '.';

function main() {
  const { owner, name, recent } = yargs
    .option('owner', { demandOption: true, description: 'Owner of the repository. e.g. facebook' })
    .option('name', { demandOption: true, description: 'Name of the repository. e.g. react' })
    .option('recent', {
      default: false,
      description: 'Only fetch recent information.'
    })
    .boolean('recent')
    .help().argv;

  if (typeof owner !== 'string') {
    console.error('Owner must be a string!');
    return;
  }
  if (typeof name !== 'string') {
    console.error('Name must be a string!');
    return;
  }

  initialize();
  if (recent) {
    console.log('Fetching with limit');
    fetchRecentAndRecord({
      owner,
      name,
      issuesLimit: 100,
      pullRequestsLimit: 100,
      commitHistoryLimit: 100
    }).then(console.log);
  } else {
    console.log('Fetching all...');
    fetchAllAndRecord(owner, name).then(console.log);
  }
}

main();
