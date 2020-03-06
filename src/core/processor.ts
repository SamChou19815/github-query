import { RawIssue, RawPullRequest, Response } from './response-types';
import { Issue, PullRequest, Repository } from './processed-types';

const processIssue = ({
  number,
  title,
  author,
  state,
  createdAt,
  closedAt,
  timelineItems: { updatedAt }
}: RawIssue): Issue<Date> => ({
  number,
  title,
  author: author == null ? null : author.login,
  state,
  createdAt: new Date(createdAt),
  closedAt: closedAt == null ? null : new Date(closedAt),
  updatedAt: new Date(updatedAt)
});

const processPullRequest = ({
  number,
  title,
  author,
  state,
  createdAt,
  closedAt,
  timelineItems: { updatedAt }
}: RawPullRequest): PullRequest<Date> => ({
  number,
  title,
  author: author == null ? null : author.login,
  state,
  createdAt: new Date(createdAt),
  closedAt: closedAt == null ? null : new Date(closedAt),
  updatedAt: new Date(updatedAt)
});

export const processClientResponse = ({
  repository: {
    hasIssuesEnabled,
    licenseInfo,
    updatedAt,
    pushedAt,
    issues: { totalCount: issuesCount, nodes: issueNodes },
    pullRequests: { totalCount: pullRequestsCount, nodes: pullRequestNodes }
  }
}: Response): Repository<Date> => ({
  hasIssuesEnabled,
  licenseKey: licenseInfo == null ? null : licenseInfo.key,
  updatedAt: new Date(updatedAt),
  pushedAt: new Date(pushedAt),
  issuesCount,
  pullRequestsCount,
  issues: issueNodes.map(processIssue),
  pullRequests: pullRequestNodes.map(processPullRequest)
});

export const processRepository = <T, R>(
  source: Repository<T>,
  converter: (date: T) => R
): Repository<R> => {
  const optionalConverter = (optionalDate: T | null): R | null =>
    optionalDate === null ? null : converter(optionalDate);
  const {
    hasIssuesEnabled,
    licenseKey,
    updatedAt,
    pushedAt,
    issuesCount,
    pullRequestsCount,
    issues,
    pullRequests
  } = source;
  return {
    hasIssuesEnabled,
    licenseKey,
    updatedAt: converter(updatedAt),
    pushedAt: converter(pushedAt),
    issuesCount,
    pullRequestsCount,
    issues: issues.map(({ createdAt, closedAt, updatedAt: updatedAtTime, ...rest }) => ({
      ...rest,
      createdAt: converter(createdAt),
      closedAt: optionalConverter(closedAt),
      updatedAt: converter(updatedAtTime)
    })),
    pullRequests: pullRequests.map(
      ({ createdAt, closedAt, updatedAt: updatedAtTime, ...rest }) => ({
        ...rest,
        createdAt: converter(createdAt),
        closedAt: optionalConverter(closedAt),
        updatedAt: converter(updatedAtTime)
      })
    )
  };
};
