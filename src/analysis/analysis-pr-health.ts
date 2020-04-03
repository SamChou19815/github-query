import { Repository } from '../core/processed-types';
import { AnalysisResult, roundToDaysWith2Digits } from './analysis-common';

interface PullRequestHealthStatistics extends AnalysisResult {
  readonly openPullRequestCount: number;
  readonly mergedPullRequestCount: number;
  readonly closedPullRequestCount: number;
  readonly averageMergeDays: number;
  readonly averageCloseDays: number;
  // Assuming open ones are immediately merged.
  readonly mostOptimisticAverageMergeDays: number;
  // Assuming open ones are immediately closed.
  readonly mostOptimisticAverageCloseDays: number;
}

export default (
  { pullRequests }: Repository<Date>,
  afterDate: Date | null
): PullRequestHealthStatistics => {
  let openPullRequestCount = 0;
  let mergedPullRequestCount = 0;
  let closedPullRequestCount = 0;
  let mergedTotalNonMergedTime = 0;
  let allTotalNonMergedTime = 0;
  let closedTotalOpenTime = 0;
  let allTotalOpenTime = 0;
  const currentTime = new Date().getTime();
  const filteredPullRequests =
    afterDate === null
      ? pullRequests
      : pullRequests.filter(({ createdAt }) => createdAt >= afterDate);
  filteredPullRequests.forEach(({ state, createdAt, closedAt }) => {
    switch (state) {
      case 'OPEN':
        openPullRequestCount += 1;
        break;
      case 'MERGED':
        mergedPullRequestCount += 1;
        break;
      case 'CLOSED':
        closedPullRequestCount += 1;
        break;
      default:
        throw new Error();
    }
    if (closedAt != null) {
      if (state === 'OPEN') {
        throw new Error();
      }
      const difference = closedAt.getTime() - createdAt.getTime();
      closedTotalOpenTime += difference;
      allTotalOpenTime += difference;
      if (state === 'MERGED') {
        mergedTotalNonMergedTime += difference;
        allTotalNonMergedTime += difference;
      }
    } else {
      if (state !== 'OPEN') {
        throw new Error();
      }
      const difference = currentTime - createdAt.getTime();
      allTotalOpenTime += difference;
      allTotalNonMergedTime += difference;
    }
  });
  const averageMergeDays = roundToDaysWith2Digits(
    mergedTotalNonMergedTime / mergedPullRequestCount
  );
  const averageCloseDays = roundToDaysWith2Digits(
    closedTotalOpenTime / (mergedPullRequestCount + closedPullRequestCount)
  );
  const mostOptimisticAverageMergeDays = roundToDaysWith2Digits(
    allTotalNonMergedTime / (openPullRequestCount + mergedPullRequestCount)
  );
  const mostOptimisticAverageCloseDays = roundToDaysWith2Digits(
    allTotalOpenTime / (openPullRequestCount + mergedPullRequestCount + closedPullRequestCount)
  );
  return {
    openPullRequestCount,
    mergedPullRequestCount,
    closedPullRequestCount,
    averageMergeDays,
    averageCloseDays,
    mostOptimisticAverageMergeDays,
    mostOptimisticAverageCloseDays,
  };
};
