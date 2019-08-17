import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-adminsdk.json';
import { WriteBatch, Timestamp } from '@google-cloud/firestore';
import {
  processRepository,
  Repository,
  RepositoryMetadata,
  Issue,
  PullRequest,
  Commit
} from 'github-query-core';
import { DATABASE_URL } from './configuration.js';

export const initialize = (): void => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: DATABASE_URL
  });
};

const database = () => admin.firestore();

const REPOSITORY_METADATA_COLLECTION = `github-query-repository-metadata`;

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
          .collection(`github-query-${repositoryId}-issues`)
          .doc(`${repositoryId}-${issue.number}`),
        {
          repositoryId,
          ...issue
        }
      )
    ),
    batchedWrite(pullRequests, (batch, pullRequest) =>
      batch.set(
        database()
          .collection(`github-query-${repositoryId}-pull-requests`)
          .doc(`${repositoryId}-${pullRequest.number}`),
        { repositoryId, ...pullRequest }
      )
    ),
    batchedWrite(commits, (batch, commit) =>
      batch.set(
        database()
          .collection(`github-query-${repositoryId}-commits`)
          .doc(`${repositoryId}-${commit.id}`),
        {
          repositoryId,
          ...commit
        }
      )
    )
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
    .collection(`github-query-${repositoryId}-issues`)
    .orderBy('number', 'desc')
    .limit(limit)
    .get()
    .then(snapshot => snapshot.docs.map(document => document.data() as Issue<Timestamp>));
  const pullRequestsPromise = database()
    .collection(`github-query-${repositoryId}-pull-requests`)
    .orderBy('number', 'desc')
    .limit(limit)
    .get()
    .then(snapshot => snapshot.docs.map(document => document.data() as PullRequest<Timestamp>));
  const commitsPromise = database()
    .collection(`github-query-${repositoryId}-commits`)
    .orderBy('pushedDate', 'desc')
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
