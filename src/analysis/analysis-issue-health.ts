import { AnalysisResult, roundToDaysWith2Digits } from './analysis-common';
import { Repository } from '../core/processed-types';

interface PullRequestHealthStatistics extends AnalysisResult {
  readonly openIssueCount: number;
  readonly closedIssueCount: number;
  readonly averageCloseDays: number;
  // Assuming open ones are immediately closed.
  readonly mostOptimisticAverageCloseDays: number;
}

export default ({ issues }: Repository<Date>): PullRequestHealthStatistics => {
  let openIssueCount = 0;
  let closedIssueCount = 0;
  let closedTotalOpenTime = 0;
  let allTotalOpenTime = 0;
  const currentTime = new Date().getTime();
  issues.forEach(({ state, createdAt, closedAt }) => {
    switch (state) {
      case 'OPEN':
        openIssueCount += 1;
        break;
      case 'CLOSED':
        closedIssueCount += 1;
        break;
      default:
        throw new Error();
    }
    if (closedAt != null) {
      const openTimeDifference = closedAt.getTime() - createdAt.getTime();
      closedTotalOpenTime += openTimeDifference;
      allTotalOpenTime += openTimeDifference;
    } else {
      allTotalOpenTime += currentTime - createdAt.getTime();
    }
  });
  const averageCloseDays = roundToDaysWith2Digits(closedTotalOpenTime / closedIssueCount);
  const mostOptimisticAverageCloseDays = roundToDaysWith2Digits(
    allTotalOpenTime / (openIssueCount + closedIssueCount)
  );
  return { openIssueCount, closedIssueCount, averageCloseDays, mostOptimisticAverageCloseDays };
};
