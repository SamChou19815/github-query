import { CommitState, IssueState, PullRequestState } from './common-types';

/*
 * NOTE:
 * We make these types parametric on D to ensure we can easily convert between
 * Date and Timestamp.
 */

export type Issue<D> = {
  readonly number: number;
  readonly title: string;
  readonly author: string | null;
  readonly state: IssueState;
  readonly createdAt: D;
  readonly closedAt: D | null;
  readonly updatedAt: D;
};

export type PullRequest<D> = {
  readonly number: number;
  readonly title: string;
  readonly author: string | null;
  readonly state: PullRequestState;
  readonly createdAt: D;
  readonly closedAt: D | null;
  readonly updatedAt: D;
};

export type Commit<D> = {
  readonly id: string;
  readonly message: string;
  readonly hasValidSignature: boolean;
  readonly isFromPullRequest: boolean;
  readonly committedDate: D;
  readonly pushedDate: D;
  readonly additions: number;
  readonly deletions: number;
  readonly changedFiles: number;
  readonly author: string | null;
  readonly state: CommitState | null;
};

export type RepositoryMetadata<D> = {
  readonly hasIssuesEnabled: true;
  readonly licenseKey: string | null;
  readonly updatedAt: D;
  readonly pushedAt: D;
  readonly issuesCount: number;
  readonly pullRequestsCount: number;
  readonly commitsCount: number;
};

export type Repository<D> = RepositoryMetadata<D> & {
  readonly issues: readonly Issue<D>[];
  readonly pullRequests: readonly PullRequest<D>[];
  readonly commits: readonly Commit<D>[];
};
