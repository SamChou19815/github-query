import { GraphQLClient } from 'graphql-request';
import { processClientResponse } from '../core/processor';
import { Response } from '../core/response-types';
import { Repository } from '../core/processed-types';
import GITHUB_TOKEN from './github-token';

const ENDPOINT = 'https://api.github.com/graphql';

const graphQLClient = new GraphQLClient(ENDPOINT, {
  headers: { authorization: `Bearer ${GITHUB_TOKEN}` }
});

export type RequestConfiguration = {
  readonly owner: string;
  readonly name: string;
  readonly issuesLimit: number;
  readonly issuesCursor?: string;
  readonly pullRequestsLimit: number;
  readonly pullRequestsCursor?: string;
  readonly commitHistoryLimit: number;
  readonly commitHistoryCursor?: string;
};

const beforeArgument = (before?: string): string => (before == null ? '' : `, before: "${before}"`);

const issuesQuery = (issuesLimit: number, before?: string): string => `
  issues(last: ${issuesLimit}${beforeArgument(before)}) {
    totalCount
    pageInfo {
      endCursor
    }
    nodes {
      number
      title
      author {
        login
      }
      state
      createdAt
      closedAt
      timelineItems {
        updatedAt
      }
    }
  }
`;

const pullRequestsQuery = (pullRequestsLimit: number, before?: string): string => `
  pullRequests(last: ${pullRequestsLimit}${beforeArgument(before)}) {
    totalCount
    pageInfo {
      endCursor
    }
    nodes {
      number
      title
      author {
        login
      }
      state
      createdAt
      closedAt
      timelineItems {
        updatedAt
      }
    }
  }
`;

const commitQuery = (commitHistoryLimit: number, after?: string): string => `
  object(expression: "master") {
    ... on Commit {
      history(first: ${commitHistoryLimit}${after == null ? '' : `, after: "${after}"`}) {
        totalCount
        pageInfo {
          endCursor
        }
        nodes {
          id
          message
          additions
          deletions
          author {
            user {
              login
            }
          }
          associatedPullRequests(last: 1) {
            nodes {
              title
              number
            }
          }
          committedDate
          changedFiles
          pushedDate
          status {
            state
          }
          signature {
            isValid
          }
          committedDate
          pushedDate
        }
      }
    }
  }
`;

type RecentRepositoryInformation = {
  readonly repository: Repository<Date>;
  readonly issuesCursor?: string;
  readonly pullRequestsCursor?: string;
  readonly commitHistoryCursor?: string;
};

export const fetchRecent = async ({
  owner,
  name,
  issuesLimit,
  issuesCursor,
  pullRequestsLimit,
  pullRequestsCursor,
  commitHistoryLimit,
  commitHistoryCursor
}: RequestConfiguration): Promise<RecentRepositoryInformation> => {
  const query = `
  query {
    repository(name: "${name}", owner: "${owner}") {
      updatedAt
      hasIssuesEnabled
      licenseInfo {
        key
      }
      pushedAt
      ${issuesQuery(issuesLimit, issuesCursor)}
      ${pullRequestsQuery(pullRequestsLimit, pullRequestsCursor)}
      ${commitQuery(commitHistoryLimit, commitHistoryCursor)}
    }
  }
  `;
  const response: Response = await graphQLClient.request(query);
  const repository = processClientResponse(response);
  const { repository: rawRepository } = response;
  return {
    repository,
    issuesCursor: rawRepository.issues.pageInfo.endCursor,
    pullRequestsCursor: rawRepository.pullRequests.pageInfo.endCursor,
    commitHistoryCursor: rawRepository.object.history.pageInfo.endCursor
  };
};

export const fetchAll = async (owner: string, name: string): Promise<Repository<Date>> => {
  const LIMIT = 100;
  const information = await fetchRecent({
    owner,
    name,
    issuesLimit: LIMIT,
    pullRequestsLimit: LIMIT,
    commitHistoryLimit: LIMIT
  });
  const { repository } = information;
  let { issuesCursor, pullRequestsCursor, commitHistoryCursor } = information;
  const { issues, pullRequests, commits, ...repositoryMetadata } = repository;
  const issueList = [...issues];
  const pullRequestList = [...pullRequests];
  const commitList = [...commits];
  while (issuesCursor != null || pullRequestsCursor != null || commitHistoryCursor != null) {
    const {
      repository: { issues: newIssues, pullRequests: newPullRequests, commits: newCommits },
      issuesCursor: newIssuesCursor,
      pullRequestsCursor: newPullRequestsCursor,
      commitHistoryCursor: newCommitHistoryCursor
      // eslint-disable-next-line no-await-in-loop
    } = await fetchRecent({
      owner,
      name,
      issuesLimit: issuesCursor == null ? 0 : LIMIT,
      issuesCursor,
      pullRequestsLimit: pullRequestsCursor == null ? 0 : LIMIT,
      pullRequestsCursor,
      commitHistoryLimit: commitHistoryCursor == null ? 0 : LIMIT,
      commitHistoryCursor
    });
    issueList.push(...newIssues);
    pullRequestList.push(...newPullRequests);
    commitList.push(...newCommits);
    issuesCursor = issueList.length < repository.issuesCount ? newIssuesCursor : undefined;
    pullRequestsCursor =
      pullRequestList.length < repository.pullRequestsCount ? newPullRequestsCursor : undefined;
    commitHistoryCursor =
      commitList.length < repository.commitsCount ? newCommitHistoryCursor : undefined;
  }
  return {
    issues: issueList,
    pullRequests: pullRequestList,
    commits: commitList,
    ...repositoryMetadata
  };
};
