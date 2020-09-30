#!/usr/bin/env node

/* eslint-disable no-console */

import { Repository } from './core/processed-types';
import freshFetchRecent from './fetcher';

const helpMessage = `$ github-query <options> [repo...]
[repo]     Path to the repository. e.g. facebook/react [string list] [required]
--help     Show help                                                  [boolean]
`;

const getRepositoriesFromCLIArguments = (): readonly string[] => {
  const repositories: string[] = [];
  let help = false;
  process.argv.slice(2).forEach((argument) => {
    if (argument === '--help') {
      help = true;
    } else {
      repositories.push(argument);
    }
  });

  if (help) {
    console.log(helpMessage);
    process.exit(0);
  }
  if (repositories.length === 0) {
    console.error('Repository list should not be empty!');
    console.log('');
    console.log(helpMessage);
    process.exit(2);
  }

  return repositories;
};

(async () => {
  const repositories = getRepositoriesFromCLIArguments();

  const fetchedRepositories: (readonly [string, Repository<Date>])[] = [];
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
      const repository = await freshFetchRecent(owner, name);
      const end = new Date().getTime();
      if (end - start > 500) {
        console.log(`Fetched ${repo}.`);
      }
      fetchedRepositories.push([repo, repository]);
    } catch (error) {
      console.error(`Unable to fetch data for ${repo}. Error: ${error.message}`);
    }
  }

  console.log(JSON.stringify(fetchedRepositories, undefined, 2));
})();
