import { Repository } from '../core/processed-types';
import { AnalysisResult } from './analysis-common';

interface PullRequestMemberStatistics extends AnalysisResult {
  readonly [memberId: string]: number;
}

type MutablePullRequestMemberStatistics = {
  -readonly [memberId in keyof PullRequestMemberStatistics]: number;
};

export default (
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
