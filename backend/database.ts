import * as admin from 'firebase-admin';
import { WriteBatch, Timestamp } from '@google-cloud/firestore';
import {
  processRepository,
  Repository,
  RepositoryMetadata,
  Issue,
  PullRequest,
  Commit
} from 'github-query-core';
import * as serviceAccount from './firebase-adminsdk.json';
import { DATABASE_URL } from './configuration.js';

export const initialize = (): void => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: DATABASE_URL
  });
};

const database = () => admin.firestore();

const REPOSITORY_METADATA_COLLECTION = `github-query-repository-metadata`;
const REPOSITORY_OBJECT_COLLECTION = `github-query-repository-objects`;

// Used to overcome 500 item per batch limit
const batchedWrite = async <T>(
  items: readonly T[],
  writer: (batch: WriteBatch, item: T) => void
): Promise<void> => {
  const jobs = [];
  for (let i = 0; i < items.length / 500; i += 1) {
    const start = i * 500;
    const end = Math.min(i * 500 + 500, items.length);
    const batch = database().batch();
    items.slice(start, end).forEach(item => writer(batch, item));
    jobs.push(batch.commit());
  }
  await Promise.all(jobs);
};

export const update = async (repositoryId: string, repository: Repository<Date>): Promise<void> => {
  const { issues, pullRequests, commits, ...metadata } = repository;
  await Promise.all([
    database()
      .collection(REPOSITORY_METADATA_COLLECTION)
      .doc(repositoryId)
      .set(metadata),
    batchedWrite(issues, (batch, issue) =>
      batch.set(
        database()
          .collection(REPOSITORY_OBJECT_COLLECTION)
          .doc(`${repositoryId}-${issue.number}`),
        { repositoryId, type: 'issue', ...issue }
      )
    ),
    batchedWrite(pullRequests, (batch, pullRequest) =>
      batch.set(
        database()
          .collection(REPOSITORY_OBJECT_COLLECTION)
          .doc(`${repositoryId}-${pullRequest.number}`),
        { repositoryId, type: 'pull-request', ...pullRequest }
      )
    ),
    batchedWrite(commits, (batch, commit) => {
      const number = commit.pushedDate.getTime();
      batch.set(
        database()
          .collection(REPOSITORY_OBJECT_COLLECTION)
          .doc(`${repositoryId}-${number}`),
        { repositoryId, type: 'commit', number, ...commit }
      );
    })
  ]);
};

export const readRecent = async (repositoryId: string): Promise<Repository<Date> | null> => {
  const limit = 1000;
  const metadata = await database()
    .collection(REPOSITORY_METADATA_COLLECTION)
    .doc(repositoryId)
    .get()
    .then(doc => doc.data() as RepositoryMetadata<Timestamp> | undefined);
  if (metadata === undefined) {
    return null;
  }
  // We setup database in this way to avoid manually maintain indices.
  const issuesPromise = database()
    .collection(REPOSITORY_OBJECT_COLLECTION)
    .where('repositoryId', '==', repositoryId)
    .where('type', '==', 'issue')
    .where('number', '>=', 0)
    .orderBy('number', 'desc')
    .limit(limit)
    .get()
    .then(snapshot => snapshot.docs.map(document => document.data() as Issue<Timestamp>));
  const pullRequestsPromise = database()
    .collection(REPOSITORY_OBJECT_COLLECTION)
    .where('repositoryId', '==', repositoryId)
    .where('type', '==', 'pull-request')
    .where('number', '>=', 0)
    .orderBy('number', 'desc')
    .limit(limit)
    .get()
    .then(snapshot => snapshot.docs.map(document => document.data() as PullRequest<Timestamp>));
  const commitsPromise = database()
    .collection(REPOSITORY_OBJECT_COLLECTION)
    .where('repositoryId', '==', repositoryId)
    .where('type', '==', 'commit')
    .where('number', '>=', 0)
    .orderBy('number', 'desc')
    .limit(limit)
    .get()
    .then(snapshot => snapshot.docs.map(document => document.data() as Commit<Timestamp>));
  const [issues, pullRequests, commits] = await Promise.all([
    issuesPromise,
    pullRequestsPromise,
    commitsPromise
  ]);
  return processRepository({ issues, pullRequests, commits, ...metadata }, (timestamp: Timestamp) =>
    timestamp.toDate()
  );
};
