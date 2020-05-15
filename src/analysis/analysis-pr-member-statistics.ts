import { Repository } from '../core/processed-types';
import { AnalysisStatistics, AnalysisResult } from './analysis-common';

type MutableStatistics = {
  -readonly [memberId in keyof AnalysisStatistics]: number;
};

const analyzeSingleRepository = (
  { pullRequests }: Repository<Date>,
  afterDate: Date | null
): AnalysisStatistics => {
  const statistics: MutableStatistics = {};
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
): AnalysisResult => {
  const globalStatistics: MutableStatistics = {};
  repositories.forEach((repository) => {
    const localStatistics = analyzeSingleRepository(repository, afterDate);
    Object.entries(localStatistics).forEach(([author, count]) => {
      globalStatistics[author] = (globalStatistics[author] ?? 0) + count;
    });
  });
  const sortedGlobalStatistics: MutableStatistics = {};
  Object.entries(globalStatistics)
    .sort(([, count1], [, count2]) => count2 - count1)
    .forEach(([author, count]) => {
      sortedGlobalStatistics[author] = count;
    });
  return { statisticsValueType: 'count', statistics: sortedGlobalStatistics };
};
