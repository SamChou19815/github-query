import { IssueState, PullRequestState } from './common-types';

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
};

export type Response = { readonly repository: RawRepository };
