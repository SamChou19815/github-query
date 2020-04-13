import { Repository } from '../core/processed-types';
import { AnalysisResult } from './analysis-common';

interface PullRequestMemberStatistics extends AnalysisResult {
  readonly [memberId: string]: number;
}

type MutablePullRequestMemberStatistics = {
  -readonly [memberId in keyof PullRequestMemberStatistics]: number;
};

const analyzeSingleRepository = (
  { pullRequests }: Repository<Date>,
  afterDate: Date | null
): PullRequestMemberStatistics => {
  const statistics: MutablePullRequestMemberStatistics = {};
  pullRequests.forEach(({ author, createdAt }) => {
    if (author == null) {
      return;
    }
    if (afterDate != null && createdAt < afterDate) {
      return;
    }
    statistics[author] = (statistics[author] ?? 0) + 1;
  });
  return statistics;
};

export default (
  repositories: readonly Repository<Date>[],
  afterDate: Date | null
): PullRequestMemberStatistics => {
  const globalStatistics: MutablePullRequestMemberStatistics = {};
  repositories.forEach((repository) => {
    const localStatistics = analyzeSingleRepository(repository, afterDate);
    Object.entries(localStatistics).forEach(([author, count]) => {
      globalStatistics[author] = (globalStatistics[author] ?? 0) + count;
    });
  });
  const sortedGlobalStatistics: MutablePullRequestMemberStatistics = {};
  Object.entries(globalStatistics)
    .sort(([, count1], [, count2]) => count2 - count1)
    .forEach(([author, count]) => {
      sortedGlobalStatistics[author] = count;
    });
  return sortedGlobalStatistics;
};
