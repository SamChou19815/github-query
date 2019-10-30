import { CommitState, IssueState, PullRequestState } from './common-types';

type Author = { readonly login: string };

export type RawIssue = {
  readonly number: number;
  readonly title: string;
  readonly author?: Author;
  readonly state: IssueState;
  readonly createdAt: string;
  readonly closedAt: string | null;
  readonly timelineItems: { readonly updatedAt: string };
};

export type RawPullRequest = {
  readonly number: number;
  readonly title: string;
  readonly author?: Author;
  readonly state: PullRequestState;
  readonly createdAt: string;
  readonly closedAt: string | null;
  readonly timelineItems: { readonly updatedAt: string };
};

type AssociatedPullRequest = { readonly title: string; readonly number: number };

export type RawCommit = {
  readonly id: string;
  readonly message: string;
  readonly signature?: { readonly isValid: boolean };
  readonly additions: number;
  readonly deletions: number;
  readonly committedDate: string;
  readonly pushedDate: string;
  readonly changedFiles: number;
  readonly associatedPullRequests: { readonly nodes: readonly AssociatedPullRequest[] };
  readonly author: { readonly user?: Author };
  readonly status?: { readonly state: CommitState };
};

type Connetion<T> = {
  readonly totalCount: number;
  readonly pageInfo: { readonly endCursor?: string };
  readonly nodes: readonly T[];
};

type RawRepository = {
  readonly hasIssuesEnabled: true;
  readonly licenseInfo?: { readonly key: string };
  readonly updatedAt: string;
  readonly pushedAt: string;
  readonly issues: Connetion<RawIssue>;
  readonly pullRequests: Connetion<RawPullRequest>;
  readonly object: { readonly history: Connetion<RawCommit> };
};

export type Response = { readonly repository: RawRepository };
