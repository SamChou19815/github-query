/* eslint-disable no-console */
import { Analysis } from './analysis-common';
import IssueHealthAnalysis from './analysis-issue-health';
import PullRequestHealthAnalysis from './analysis-pr-health';
import { Repository } from '../core/processed-types';

const allAnalysis: { readonly [analysisName: string]: Analysis } = {
  IssueHealthAnalysis,
  PullRequestHealthAnalysis
};

const analyze = (repository: Repository<Date>): void => {
  Object.entries(allAnalysis).forEach(([analysisName, analysisFunction]) => {
    console.group(analysisName);
    const result = analysisFunction(repository);
    Object.entries(result).forEach(([metricName, metricResult]) => {
      console.log(`${metricName}: ${metricResult}`);
    });
    console.groupEnd();
  });
};

export default analyze;
