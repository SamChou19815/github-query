import { RawCommit, RawIssue, RawPullRequest, Response } from './response-types';
import { Commit, Issue, PullRequest, Repository } from './processed-types';

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

const processCommit = ({
  id,
  message,
  signature,
  additions,
  deletions,
  committedDate,
  pushedDate,
  changedFiles,
  author: { user },
  associatedPullRequests,
  status
}: RawCommit): Commit<Date> => ({
  id,
  message,
  hasValidSignature: signature != null && signature.isValid,
  isFromPullRequest: associatedPullRequests.nodes.length >= 1,
  additions,
  deletions,
  committedDate: new Date(committedDate),
  pushedDate: new Date(pushedDate),
  changedFiles,
  author: user == null ? null : user.login,
  state: status == null ? null : status.state
});

export const processClientResponse = ({
  repository: {
    hasIssuesEnabled,
    licenseInfo,
    updatedAt,
    pushedAt,
    issues: { totalCount: issuesCount, nodes: issueNodes },
    pullRequests: { totalCount: pullRequestsCount, nodes: pullRequestNodes },
    object: {
      history: { totalCount: commitsCount, nodes: commitNodes }
    }
  }
}: Response): Repository<Date> => ({
  hasIssuesEnabled,
  licenseKey: licenseInfo == null ? null : licenseInfo.key,
  updatedAt: new Date(updatedAt),
  pushedAt: new Date(pushedAt),
  issuesCount,
  pullRequestsCount,
  commitsCount,
  issues: issueNodes.map(processIssue),
  pullRequests: pullRequestNodes.map(processPullRequest),
  commits: commitNodes.map(processCommit)
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
    commitsCount,
    issues,
    pullRequests,
    commits
  } = source;
  return {
    hasIssuesEnabled,
    licenseKey,
    updatedAt: converter(updatedAt),
    pushedAt: converter(pushedAt),
    issuesCount,
    pullRequestsCount,
    commitsCount,
    issues: issues.map(({ createdAt, closedAt, updatedAt, ...rest }) => ({
      ...rest,
      createdAt: converter(createdAt),
      closedAt: optionalConverter(closedAt),
      updatedAt: converter(updatedAt)
    })),
    pullRequests: pullRequests.map(({ createdAt, closedAt, updatedAt, ...rest }) => ({
      ...rest,
      createdAt: converter(createdAt),
      closedAt: optionalConverter(closedAt),
      updatedAt: converter(updatedAt)
    })),
    commits: commits.map(({ committedDate, pushedDate, ...rest }) => ({
      ...rest,
      committedDate: converter(committedDate),
      pushedDate: converter(pushedDate)
    }))
  };
};
