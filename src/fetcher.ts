/* eslint-disable no-console */

import dotEnv from 'dotenv';
import { GraphQLClient } from 'graphql-request';

import { Repository } from './core/processed-types';
import { processClientResponse } from './core/processor';

dotEnv.config();

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN ?? 'INVALID_TOKEN'}` },
});

const freshFetchRecent = (owner: string, name: string): Promise<Repository<Date>> =>
  graphQLClient
    .request(
      `
query {
  repository(name: "${name}", owner: "${owner}") {
    updatedAt
    hasIssuesEnabled
    licenseInfo {
      key
    }
    pushedAt
    issues(last: 50) {
      totalCount
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
    pullRequests(last: 50) {
      totalCount
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
  }
}
`
    )
    .then(processClientResponse);

export default freshFetchRecent;
