/* eslint-disable no-console */
import {
  Fetcher,
  freshFetchAllAndStore,
  freshFetchRecentAndStore,
  getRecent,
  getAll
} from './data';
import cli from './cli';
import analyze from './analysis';

async function main() {
  const { repositories, after, recent, fresh } = cli();

  let fetcher: Fetcher;
  if (recent) {
    fetcher = fresh ? freshFetchRecentAndStore : getRecent;
  } else {
    fetcher = fresh ? freshFetchAllAndStore : getAll;
  }

  console.log('Fetching data and analyzing...');
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
    console.group(repo);
    console.log(`Fetching data...`);
    try {
      // eslint-disable-next-line no-await-in-loop
      const repository = await fetcher(owner, name);
      analyze(repository, after);
    } catch (error) {
      console.error(`Unable to fetch data for ${repo}. Error: ${error.message}`);
    }
    console.groupEnd();
  }
}

main();
