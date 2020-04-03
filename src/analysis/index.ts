/* eslint-disable no-console */
import chalk from 'chalk';

import { Repository } from '../core/processed-types';
import { Analysis } from './analysis-common';
import IssueHealthAnalysis from './analysis-issue-health';
import PullRequestHealthAnalysis from './analysis-pr-health';

const allAnalysis: { readonly [analysisName: string]: Analysis } = {
  IssueHealthAnalysis,
  PullRequestHealthAnalysis,
};

const analyze = (repository: Repository<Date>, afterDate: Date | null): void => {
  Object.entries(allAnalysis).forEach(([analysisName, analysisFunction]) => {
    console.group(chalk.cyan(analysisName));
    const result = analysisFunction(repository, afterDate);
    Object.entries(result).forEach(([metricName, metricResult]) => {
      console.log(`${metricName}: ${metricResult}`);
    });
    console.groupEnd();
  });
};

export default analyze;
