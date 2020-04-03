import { GraphQLClient } from 'graphql-request';

import { Repository } from '../core/processed-types';
import { processClientResponse } from '../core/processor';
import { Response } from '../core/response-types';
import GITHUB_TOKEN from './github-token';

const ENDPOINT = 'https://api.github.com/graphql';

const graphQLClient = new GraphQLClient(ENDPOINT, {
  headers: { authorization: `Bearer ${GITHUB_TOKEN}` },
});

export type RequestConfiguration = {
  readonly owner: string;
  readonly name: string;
  readonly issuesLimit: number;
  readonly issuesCursor?: string;
  readonly pullRequestsLimit: number;
  readonly pullRequestsCursor?: string;
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

type RecentRepositoryInformation = {
  readonly repository: Repository<Date>;
  readonly issuesCursor?: string;
  readonly pullRequestsCursor?: string;
};

export const fetchRecent = async ({
  owner,
  name,
  issuesLimit,
  issuesCursor,
  pullRequestsLimit,
  pullRequestsCursor,
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
  };
};

export const fetchAll = async (owner: string, name: string): Promise<Repository<Date>> => {
  const LIMIT = 100;
  const information = await fetchRecent({
    owner,
    name,
    issuesLimit: LIMIT,
    pullRequestsLimit: LIMIT,
  });
  const { repository } = information;
  let { issuesCursor, pullRequestsCursor } = information;
  const { issues, pullRequests, ...repositoryMetadata } = repository;
  const issueList = [...issues];
  const pullRequestList = [...pullRequests];
  while (issuesCursor != null || pullRequestsCursor != null) {
    const {
      repository: { issues: newIssues, pullRequests: newPullRequests },
      issuesCursor: newIssuesCursor,
      pullRequestsCursor: newPullRequestsCursor,
      // eslint-disable-next-line no-await-in-loop
    } = await fetchRecent({
      owner,
      name,
      issuesLimit: issuesCursor == null ? 0 : LIMIT,
      issuesCursor,
      pullRequestsLimit: pullRequestsCursor == null ? 0 : LIMIT,
      pullRequestsCursor,
    });
    issueList.push(...newIssues);
    pullRequestList.push(...newPullRequests);
    issuesCursor = issueList.length < repository.issuesCount ? newIssuesCursor : undefined;
    pullRequestsCursor =
      pullRequestList.length < repository.pullRequestsCount ? newPullRequestsCursor : undefined;
  }
  return {
    issues: issueList,
    pullRequests: pullRequestList,
    ...repositoryMetadata,
  };
};
