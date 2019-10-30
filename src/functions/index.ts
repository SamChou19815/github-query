/* eslint-disable no-console */
import * as functions from 'firebase-functions';
import { initializeFirestore, fetchRecentAndRecord, readRecent } from '../backend';
import * as configuration from './fetch-configuration.json';

initializeFirestore();

type RepositoryId = { readonly owner: string; readonly name: string };

type Configuration = {
  readonly limit: number;
  readonly frequency: string;
  readonly repositories: readonly RepositoryId[];
};

const { limit, frequency, repositories }: Configuration = configuration as Configuration;

export const GithubQueryScheduledFetch = functions.pubsub.schedule(frequency).onRun(async () => {
  const issuesLimit = limit;
  const pullRequestsLimit = limit;
  const commitHistoryLimit = limit;
  console.log('Fetching new information...');
  const promises = repositories.map(({ owner, name }) =>
    fetchRecentAndRecord({ owner, name, issuesLimit, pullRequestsLimit, commitHistoryLimit })
  );
  await Promise.all(promises);
});

export const GithubQueryHandleClientRequest = functions.https.onRequest((request, response) => {
  const owner = request.param('owner');
  const name = request.param('name');
  const repositoryId = `${owner}-${name}`;
  readRecent(repositoryId).then(repositoryOptional => response.json(repositoryOptional));
});
